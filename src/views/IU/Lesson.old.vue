<template>
  <div class="container mt-3">
    <LessonMobilePageButtons
      :lesson="lesson"
      :quiz-button-enabled="quizButtonEnabled"
      :course-id="courseId"
      @on-back="handleOnBack"
      @on-ebook="handleEbookClick"
    />
    <div>
      <section class="mb-4 mb-md-0 pb-5 pb-md-0">
        <div
          v-if="!loading && !display404 && lesson.id"
          class="lesson row mx-auto"
        >
          <div class="lesson-video col p-0 me-lg-3 overflow-hidden">
            <LessonLeftSection
              :lesson="lesson"
              :hierarchy-tree="hierarchyTree"
              :notes-text="notesText"
              :notes-saving="notesSaving"
              @on-notes-update="onNotesUpdate"
              @save-video-timestamp="saveVideoTimestamp"
            />
          </div>
          <LessonRightSection
            v-if="!$isMobile"
            :lesson="lesson"
            :course-id="courseId"
            :notes-text="notesText"
            :notes-saving="notesSaving"
            @on-notes-update="onNotesUpdate"
            @handle-ebook-click="handleEbookClick"
            @on-start-exam="onStartExam"
          />
        </div>
        <div v-else-if="display404">
          <PageNotFound />
        </div>
      </section>
    </div>
    <portal to="out-of-app-content">
      <Modal
        v-if="showEbookPrompt"
        :hide-footer="true"
        :hide-header="true"
        :close-on-click-outside="false"
        @close-modal="closeEbookPrompt"
      >
        <template slot="body">
          <AddEbooksToCart
            :level-value="1"
            :course-id="courseId"
            :select-all="true"
            @on-added="handleAddToCart"
            @on-cancel="handleDismissEbookPrompt"
          />
        </template>
      </Modal>
    </portal>
  </div>
</template>

<script>
import LessonRightSection from "@/components/IU/Lessons/LessonRightSection";
import LessonLeftSection from "@/components/IU/Lessons/LessonLeftSection";
import {
  getCourseLessonService,
  saveLessonVideoProgressService,
  updateLessonNoteService,
  dismissLessonEbookService,
} from "@/services/iuService";
import PageNotFound from "@/views/PageNotFound";
import Modal from "@/components/Misc/Modal";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart";
import LessonMobilePageButtons from "@/components/IU/Lessons/LessonMobilePageButtons";

import { MIN_PROGRESS_TO_ACCESS_QUIZ } from "@/dataObject/userProgressData";
import { generateEntityParentTree } from "@/utils/courseUtils";

import { CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import metaTagsUpdateMixin from "@/mixins/Misc/metaTagsUpdateMixin";

export default {
  name: "Lesson",
  components: {
    PageNotFound,
    LessonMobilePageButtons,
    LessonLeftSection,
    Modal,
    AddEbooksToCart,
    LessonRightSection,
  },

  mixins: [toastMixin, devicesMixin, metaTagsUpdateMixin],

  data() {
    return {
      courseId: null,
      lessonId: null,
      lesson: {},
      loading: true,
      display404: false,
      notesText: "",
      hierarchyTree: null,
      hierarchy: null,
      showEbookPrompt: false,
      notesSaving: false,
    };
  },
  computed: {
    quizButtonEnabled() {
      return this.lesson.progress >= MIN_PROGRESS_TO_ACCESS_QUIZ;
    },

    updateLessonProgress() {
      if (!this.lessonId) return false;

      return this.lesson.progress < MIN_PROGRESS_TO_ACCESS_QUIZ ? true : false;
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.loading = true;
      this.courseId = Number(this.$route.params.courseId);
      this.lessonId = Number(this.$route.params.lessonId);

      const response = await getCourseLessonService(
        this.courseId,
        this.lessonId
      );
      if (response.error) return this.handleLessonErr(response);

      const { notes_text, ...lesson } = response.lesson;
      this.lesson = lesson;
      this.notesText = notes_text;
      this.hierarchy = response.hierarchy;
      this.hierarchyTree = generateEntityParentTree(response.hierarchy);
      this.showEbookPrompt = !lesson.hide_ebook_prompt;

      this.loading = false;
      this.$updateMeta(this.lesson.name);
    },

    onStartExam() {
      this.$router.push({
        name: "iu-lesson-quiz",
        params: { courseId: this.courseId, lessonId: this.lessonId },
      });
    },

    handleLessonErr(response) {
      this.loading = false;
      if (response.status === 404) return (this.display404 = true);
      this.$displayServerResponse(response);
    },

    async saveVideoTimestamp(timestamp) {
      const data = {
        timestamp,
        updateLessonProgress: this.updateLessonProgress,
      };
      const response = await saveLessonVideoProgressService(
        this.courseId,
        this.lessonId,
        data
      );

      if (response.updatedLessonProgress)
        this.lesson.progress = response.updatedLessonProgress;
    },
    async onNotesUpdate(text) {
      this.notesSaving = true;
      this.notesText = text;
      const response = await updateLessonNoteService(
        this.courseId,
        this.lessonId,
        { text }
      );
      this.notesSaving = false;
      if (response.error) return this.$displayServerResponse(response);
    },
    async handleEbookClick() {
      if (!this.lesson.has_purchased_ebook) return this.onPurchaseEbook();

      this.redirectToEbook();
    },
    onPurchaseEbook() {
      this.showEbookPrompt = true;
    },
    async handleAddToCart(data) {
      for (const item of data) {
        const parsed = { ...item, type: CART_EBOOK };
        this.$store.dispatch("cart/addItem", parsed);
      }
      this.showEbookPrompt = false;
    },
    redirectToEbook() {
      this.$router.push({
        name: "iu-ebook",
        params: {
          courseId: this.courseId,
          lessonId: this.lesson.id,
        },
      });
    },
    handleOnBack() {
      this.$router.replace({
        name: "iu-course",
        params: {
          id: this.courseId,
        },
      });
    },
    async handleDismissEbookPrompt() {
      dismissLessonEbookService(this.courseId, this.lesson.id);
      this.closeEbookPrompt();
    },
    closeEbookPrompt() {
      this.showEbookPrompt = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.lesson-video {
  > div {
    background: $white;
  }
}

@media (max-width: $laptopWidth) {
  .lesson-video {
    > div {
      background: none;
    }
  }
}
</style>
