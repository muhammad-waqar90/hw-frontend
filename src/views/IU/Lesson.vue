<template>
  <div>
    <PageBackButton @on-back="$router.go(-1)" />
    <div
      v-if="!loadingCourseLesson && !display404"
      class="container font-montserrat mt-3 px-0 px-sm-3"
    >
      <div class="row">
        <div :class="$isPhone ? 'left-part-mob' : 'left-part'">
          <div
            class="bg-white rounded-card-top p-4"
            :class="{ 'rounded-card-bottom': $isPhone }"
          >
            <div class="row">
              <div class="col-7" :class="{ 'w-100 ': $isPhone }">
                <h4 class="font-weight-600 text-capitalize text-dark-gray mb-0">
                  {{ lesson.name }}
                </h4>

                <BreadCrumbs
                  custom-class="small-font"
                  :crumbs="hierarchyTree"
                  :color-hierarchy="true"
                />
              </div>
              <div
                class="col-5 align-self-center"
                :class="[
                  { 'not-available-opacity': !hasEbookAccess },
                  { 'w-100 ': $isPhone },
                ]"
              >
                <ButtonWithLoading
                  v-if="lesson?.has_ebook"
                  class="ebook-button btn blue-border-btn rounded-pill font-weight-600 text-uppercase"
                  :loading="ebookApi.loading"
                  @action="handleLessonEbook"
                >
                  <slot>
                    {{ $t("iu.lesson.ebook") }}
                  </slot>
                </ButtonWithLoading>
              </div>
            </div>

            <div class="row mt-3 position-relative">
              <div class="col-12">
                <LessonVideoPlayer
                  :initial-timestamp="
                    lesson.video_progress ? lesson.video_progress : 0
                  "
                  :thumbnail="lesson.img"
                  :src="lesson.video"
                  aspect-ratio="16:9"
                  :rounded="fullRounded"
                  :pause-video-toggle="pauseVideoToggle"
                  :video-loader="videoLoader"
                  @video-playing="saveVideoTimestamp"
                  @video-paused="saveVideoTimestamp"
                />
                <LessonEbookViewer
                  v-if="
                    lesson.has_ebook &&
                    hasEbookAccess &&
                    !videoMode &&
                    !ebookApi.loading &&
                    ebookApi?.data?.src
                  "
                  :ebook-data="ebookApi?.data"
                  @ebook-error="handleEbookError"
                  @close-modal="closeEbookPreview"
                />
              </div>
            </div>
          </div>
        </div>

        <div
          class="right-part d-flex"
          :class="{ 'right-part-mob mt-3': $isPhone }"
        >
          <div class="col-12 d-flex flex-column bg-white rounded-card p-3 pt-4">
            <div class="row pt-1 mb-2">
              <div class="col mt-auto">
                <ProgressBarLesson
                  v-if="!loadingCourseModuleLessons"
                  :finished-lessons="finishedLessons"
                  :max-lessons="maxLessons"
                  :has-module-exam="lesson.has_module_exam"
                />
              </div>
              <div v-if="lesson.has_module_exam" class="col-auto">
                <button
                  :class="buttonClasses"
                  :disabled="disableButton"
                  class="btn rounded-pill font-weight-600 text-uppercase final-test-btn"
                  @click="handleExamStart"
                >
                  {{ $t("iu.lesson.moduleExam") }}
                </button>
              </div>
            </div>
            <div
              class="row flex-grow-1 position-relative overflow-y-auto scrollbar-blue"
            >
              <div
                v-if="!loadingCourseModuleLessons"
                class="position-absolute mt-3"
              >
                <LessonMenuItem
                  v-for="lessonItem in lessons"
                  :key="lessonItem.id"
                  :lesson="lessonItem"
                  @start-quiz="handleQuizStart"
                  @pause-video="pauseVideo"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loadingCourseLesson">
        <div class="row">
          <div :class="$isPhone ? 'left-part-mob mt-3' : 'left-part'">
            <div
              :key="tab"
              class="col-12 bg-lightgray d-flex flex-column h-100 rounded-card-bottom"
            >
              <div
                class="row g-0 px-4 bg-white bottom-border-gray text-black"
                :class="{ 'tabs-head': $isPhone }"
              >
                <div
                  class="col-auto cursor-pointer text-center position-relative px-0 me-5"
                  :class="{ active: tab === '#notes' }"
                  @click="changeTab('#notes')"
                >
                  <h5 class="font-weight-600 my-notes-font-size mb-1">
                    {{ $t("iu.lesson.myNotes") }}
                    <span
                      v-show="notesSaving"
                      class="spinner-border spinner-border-sm spinner-position text-blue position-absolute ms-1"
                      role="status"
                      aria-hidden="true"
                    />
                  </h5>
                </div>

                <div
                  class="col-auto cursor-pointer text-center px-0 me-5"
                  :class="{ active: tab === '#qa' }"
                  @click="changeTab('#qa')"
                >
                  <h5 class="font-weight-600 my-notes-font-size mb-1">
                    {{ $t("iu.lesson.qa") }}
                  </h5>
                </div>
              </div>

              <div class="row g-0 flex-grow-1 mt-4">
                <div class="col-12 px-4 mb-4">
                  <Notes
                    v-if="tab === '#notes'"
                    :init-text="lesson.notes_text"
                    :notes-updated-at="lesson.notes_updated_at"
                    :lesson-name="lesson.name"
                    @update-notes="onNotesUpdate"
                  />
                  <QA v-if="tab === '#qa'" />
                  <!-- <LessonEBook v-if="tab == 'ebook'" />
                <LessonFaq v-if="tab == 'lessonFAQ'" :items="lesson.lesson_faqs" /> -->
                </div>
              </div>
            </div>

            <!-- <div class="row mt-4">
            <div class="col-12">
              <Faqs />
            </div>
          </div> -->
          </div>

          <div class="mt-3" :class="{ 'right-part mx-auto': !$isPhone }">
            <!-- todo: need to check that emit is required? Also two components with name BookAdvert.vue needed to be a single generic component -->
            <BookAdvert @handle-ebook-click="handleEbookClick" />
          </div>
        </div>
      </div>

      <portal to="out-of-app-content">
        <Modal
          v-if="quizClosePrompt"
          :close-on-click-outside="false"
          :with-confirmation-buttons="true"
          :hide-close-button="true"
          class="alert-container"
          @on-confirm="handleQuizStop(true)"
          @close-modal="handleQuizStop(false)"
        >
          <template slot="header">
            {{ $t("iu.lesson.cancelQuizPrompt.header") }}
          </template>

          <template slot="body">
            {{ $t("iu.lesson.cancelQuizPrompt.body") }}
          </template>
        </Modal>

        <ModalTransparent
          v-if="mode == 'quiz'"
          :hide-footer="true"
          :hide-header="true"
          :close-on-click-outside="false"
          :hide-close-button="quizAssessing"
          @close-modal="openQuizClosePrompt"
        >
          <template slot="body">
            <LessonQuizAttempt
              :next-lesson="nextLesson"
              :is-exam-ready="isExamReady"
              :has-module-exam="lesson.has_module_exam"
              :has-ebook="lesson.has_ebook"
              :has-purchased-ebook="lesson.has_purchased_ebook"
              @handle-exam-start="handleExamStart"
              @change-quiz-in-progress="changeQuizInProgress"
              @reload-lessons="getCourseModuleLessons"
              @set-processing="setProcessing"
              @handle-purchase-ebook="handlePurchaseEbook"
            />
          </template>
        </ModalTransparent>

        <Modal
          v-if="showEbookPrompt"
          :hide-footer="true"
          :hide-header="true"
          :close-on-click-outside="false"
          @close-modal="closeEbookPrompt"
        >
          <template slot="body">
            <AddEbooksToCart
              :level-value="lesson.level"
              :course-id="courseId"
              :select-all="true"
              @on-added="handleAddToCart"
              @on-cancel="handleDismissEbookPrompt"
            />
          </template>
        </Modal>
      </portal>
    </div>

    <section v-else-if="display404">
      <SomethingWrong />
    </section>
  </div>
</template>

<script>
import SomethingWrong from "@/views/SomethingWrong";
import BreadCrumbs from "@/components/Misc/BreadCrumbs";
import ProgressBarLesson from "@/components/Misc/ProgressBarLesson";
import LessonMenuItem from "@/components/IU/Lessons/LessonMenuItem";
import Notes from "@/components/IU/Lessons/Notes";
import QA from "@/components/IU/Lessons/QA";
//import LessonEBook from "@/components/IU/Lessons/LessonEBook"
//import LessonFaq from "@/components/IU/Lessons/LessonFaq"
//import Faqs from '@/components/IU/Lessons/Faqs'
import BookAdvert from "@/components/IU/Lessons/BookAdvert";
import LessonQuizAttempt from "@/views/IU/Quizzes/LessonQuizAttempt";
import ModalTransparent from "@/components/Misc/ModalTransparent";
import Modal from "@/components/Misc/Modal";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart";
import { CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";
import LessonVideoPlayer from "@/components/IU/Lessons/LessonVideoPlayer";
import LessonEbookViewer from "@/components/Common/EbookPreview/LessonEbookViewer.vue";
import { FULL_ROUNDED } from "@/dataObject/video/videoRoundedData";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import { getLessonEbookService } from "@/services/iuService";
import {
  getCourseLessonService,
  saveLessonVideoProgressService,
  getCourseModuleLessons,
  updateLessonNoteService,
  dismissLessonEbookService,
} from "@/services/iuService";
import {
  MIN_PROGRESS_TO_ACCESS_QUIZ,
  COMPLETED_PROGRESS,
} from "@/dataObject/userProgressData";

import { generateEntityParentTree } from "@/utils/courseUtils";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import metaTagsUpdateMixin from "@/mixins/Misc/metaTagsUpdateMixin";
import PageBackButton from "@/components/Misc/BackButtons/PageBackButton";
import { mapGetters } from "vuex";

export default {
  name: "Lesson",

  components: {
    SomethingWrong,
    BreadCrumbs,
    LessonVideoPlayer,
    ProgressBarLesson,
    LessonMenuItem,
    Notes,
    QA,
    //LessonEBook,
    //LessonFaq,
    //Faqs,
    BookAdvert,
    LessonQuizAttempt,
    ModalTransparent,
    Modal,
    AddEbooksToCart,
    PageBackButton,
    ButtonWithLoading,
    LessonEbookViewer,
  },

  mixins: [toastMixin, devicesMixin, metaTagsUpdateMixin, apiMixin],

  beforeRouteUpdate(to, from, next) {
    this.handleQuizStop(true);
    next();
  },

  data() {
    return {
      courseId: null,
      lessonId: null,

      loadingCourseLesson: true,
      loadingCourseModuleLessons: true,
      display404: false,

      lesson: {},
      lessons: [],
      hierarchyTree: null,
      hierarchy: null,

      videoMode: true,

      notesSaving: false,
      tab: "#notes",

      showEbookPrompt: false,
      hasEbookAccess: false,

      mode: "view",
      isQuizInProgress: false,
      quizClosePrompt: false,
      pauseVideoToggle: false,

      hoverType: "",
      quizAssessing: false,

      videoLoader: true,
      ebookApi: getApiState(),
    };
  },

  computed: {
    finishedLessons() {
      return this.lessons.filter(
        (lesson) => lesson.progress == COMPLETED_PROGRESS
      ).length;
    },
    maxLessons() {
      return this.lessons.length;
    },
    isExamReady() {
      if (this.maxLessons == 0) return false;
      return this.finishedLessons == this.maxLessons;
    },
    buttonClasses() {
      if (this.lesson.module_progress !== 100)
        return {
          "blue-btn": this.isExamReady,
          "gray-btn": !this.isExamReady,
        };
      else return "green-btn opacity-100";
    },
    fullRounded() {
      return FULL_ROUNDED;
    },
    nextLesson() {
      const currentIndex = this.lessons
        .map((item) => item.id)
        .indexOf(this.lesson.id);
      if (currentIndex == this.lessons.length - 1) return null;
      return this.lessons[currentIndex + 1];
    },
    tabButtonColor() {
      return this.theme == "day-mode" ? "gray-btn-text" : "gray-btn-text--dark";
    },
    ...mapGetters({
      theme: "theme/getThemeMode",
    }),
    disableButton() {
      return !this.isExamReady || this.lesson.module_progress == 100;
    },
  },

  watch: {
    $route(newRoute, oldRoute) {
      if (newRoute.params.lessonId != oldRoute.params.lessonId) {
        this.init();
      }
      if (this.$route.hash) {
        this.tab = this.$route.hash;
      }
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.courseId = Number(this.$route.params.courseId);
      this.lessonId = Number(this.$route.params.lessonId);
      // Todo: We will use scroll behaviour for the #notes as well
      if (this.$route.hash) {
        this.tab = this.$route.hash;
      }

      await this.getCourseLesson();
      if (this.display404) return;
      await this.getCourseModuleLessons();

      this.ifQuizRedirect();
      this.ifQuizLeft();
      this.$updateMeta(this.lesson.name);
    },
    async getCourseLesson() {
      this.loadingCourseLesson = true;

      const response = await getCourseLessonService(
        this.courseId,
        this.lessonId
      );
      if (response.error) return this.handleCourseLessonErr(response);

      this.lesson = response.lesson;
      this.hierarchy = response.hierarchy;
      this.hierarchyTree = generateEntityParentTree(response.hierarchy);
      if (response.lesson.has_ebook) {
        this.showEbookPrompt = !response.lesson.hide_ebook_prompt;
        this.hasEbookAccess = response.lesson.has_purchased_ebook;
      }
      this.loadingCourseLesson = false;
    },
    async getCourseModuleLessons() {
      this.loadingCourseModuleLessons = true;

      const response = await getCourseModuleLessons(
        this.courseId,
        this.lesson.course_module_id
      );
      if (response.error) return this.handleCourseModuleLessonsErr(response);

      this.lessons = response;

      this.loadingCourseModuleLessons = false;
    },
    changeTab(mode) {
      this.tab = mode;
      this.$router.replace({ path: this.$route.path, hash: mode });
    },
    ifQuizRedirect() {
      if (!this.$route.params.quizOpen) return;

      this.$route.params.quizOpen = false;
      this.handleQuizStart();
    },
    ifQuizLeft() {
      if (!localStorage.getItem("leftQuiz")) return;

      if (parseInt(localStorage.getItem("leftQuiz")) == this.lesson.id)
        this.handleQuizStart();

      localStorage.removeItem("leftQuiz");
    },
    handleCourseLessonErr(response) {
      this.loadingCourseLesson = false;
      if (response.status === 404) return (this.display404 = true);
      this.$displayError(response);
    },
    handleCourseModuleLessonsErr(response) {
      this.loadingCourseModuleLessons = false;
      if (response.status === 404) return (this.display404 = true);
      this.$displayError(response);
    },
    async saveVideoTimestamp(timestamp) {
      const data = {
        timestamp,
        updateLessonProgress:
          this.lesson.progress < MIN_PROGRESS_TO_ACCESS_QUIZ,
      };
      const response = await saveLessonVideoProgressService(
        this.courseId,
        this.lessonId,
        data
      );

      if (response.updatedLessonProgress) {
        this.lesson = {
          ...this.lesson,
          progress: response.updatedLessonProgress,
        };
        const modifiedLessonIndex = this.lessons.findIndex(
          (item) => item.id == this.lesson.id
        );

        this.lessons.splice(modifiedLessonIndex, 1, {
          ...this.lessons[modifiedLessonIndex],
          progress: response.updatedLessonProgress,
        });

        if (
          this.lessons.length - 1 > modifiedLessonIndex &&
          response.updatedLessonProgress == COMPLETED_PROGRESS
        )
          this.lessons.splice(modifiedLessonIndex + 1, 1, {
            ...this.lessons[modifiedLessonIndex + 1],
            available: true,
          });
      }
    },
    async onNotesUpdate(val) {
      this.notesSaving = true;
      const text = val;

      const response = await updateLessonNoteService(
        this.courseId,
        this.lessonId,
        { text }
      );
      this.notesSaving = false;

      if (response.error) return this.$displayError(response);

      this.lesson.notes_text = response.notes_text;
      this.lesson.notes_updated_at = response.notes_updated_at;
    },
    handleQuizStart() {
      this.pauseVideo();
      this.mode = "quiz";
      document.body.style.setProperty("overflow-y", "hidden");
    },
    handleQuizStop(bool) {
      this.quizClosePrompt = false;
      if (!bool) return;

      this.mode = "view";
      document.body.style.setProperty("overflow-y", "scroll");
    },
    openQuizClosePrompt() {
      if (this.isQuizInProgress) return (this.quizClosePrompt = true);

      this.handleQuizStop(true);
    },
    changeQuizInProgress(bool) {
      this.isQuizInProgress = bool;
    },
    handleExamStart() {
      if (!this.isExamReady) return;

      document.body.style.setProperty("overflow-y", "scroll");

      this.$router.push({
        name: "iu-module-quiz-attempt",
        params: {
          courseId: this.courseId,
          courseModuleId: this.lesson.course_module_id,
        },
      });
    },
    async handleEbookClick() {
      if (!this.lesson.has_purchased_ebook)
        return (this.showEbookPrompt = true);

      this.changeTab("ebook");
    },
    async handleAddToCart(data) {
      for (const item of data) {
        const parsed = { ...item, type: CART_EBOOK };
        this.$store.dispatch("cart/addItem", parsed);
      }
      this.showEbookPrompt = false;
    },
    async handleDismissEbookPrompt() {
      dismissLessonEbookService(this.courseId, this.lesson.id);
      this.closeEbookPrompt();
    },
    closeEbookPrompt() {
      this.showEbookPrompt = false;
    },
    setProcessing(value) {
      this.quizAssessing = value;
    },
    pauseVideo() {
      this.pauseVideoToggle = !this.pauseVideoToggle;
    },
    handlePurchaseEbook() {
      this.handleEbookClick();
      this.openQuizClosePrompt();
    },
    handleEbookError() {
      this.videoMode = !this.videoMode;
    },
    async handleLessonEbook() {
      this.videoLoader = false;
      this.pauseVideo();

      if (!this.hasEbookAccess || !this.lesson.has_purchased_ebook)
        return this.handleEbookClick();

      await this.$fetchApiData(this.ebookApi, () =>
        getLessonEbookService(
          this.$route.params.courseId,
          this.$route.params.lessonId
        )
      );

      this.videoMode = !this.videoMode;
    },
    closeEbookPreview() {
      this.videoLoader = true;
      this.videoMode = !this.videoMode;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.alert-container :deep(.modal-container) {
  background-color: $red !important;
  color: $static-white;
}

.left-part {
  flex: 0 0 auto;
  width: 72%;
}

.not-available-opacity {
  opacity: 0.2;
}

.right-part {
  flex: 0 0 auto;
  width: 28%;
}

.right-part-mob {
  flex: 0 0 auto;
  width: 100%;
  height: 250px;
}

.left-part-mob {
  flex: 0 0 auto;
  width: 100%;
}
.lesson-menu-mobile {
  height: 200px;
}

.final-test-btn {
  font-size: 12px;
}

.notes-icon {
  fill: $blue;
}

.notes-saving {
  height: 16px;
  width: 16px;
}

.my-notes-font-size {
  font-size: 18px;
}

.active {
  border-bottom: 6px solid $blue;
  cursor: not-allowed !important;
  pointer-events: none;
}

.bottom-border-gray {
  border-bottom: 1px solid #d1d5db;
}

.tabs-head {
  padding: 20px;
}

.bg-lightgray {
  background-color: $lightgray;
}

.bg-black-transparent {
  background-color: rgba(0, 0, 0, 0.8);
}

.spinner-position {
  top: 2px;
}

.ebook-button {
  font-size: 14px;
  float: right !important;
  &:hover {
    background-color: $blue;
    color: $static-white !important;
  }
}
</style>
