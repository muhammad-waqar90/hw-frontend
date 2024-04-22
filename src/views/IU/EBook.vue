<template>
  <div class="container mt-3 px-3">
    <div v-if="!$isPhone && loadedNotes" class="row justify-content-end">
      <div class="col text-end">
        <button
          class="btn rounded-pill px-3 text-white"
          :class="[notesOpened ? 'orange-btn' : 'blue-btn']"
          @click="toggleNotes"
        >
          <div>
            <BookOpenOutline class="align-text-bottom" :size="16" />
            <span>
              {{
                notesOpened
                  ? $t("iu.lesson.hideNotepad")
                  : $t("iu.lesson.showNotepad")
              }}
            </span>
          </div>
        </button>
      </div>
    </div>
    <div class="row mt-3">
      <div :class="[notesOpened ? 'col-12 col-md-8' : 'col-12']">
        <div class="d-flex flex-column bg-white rounded-card p-4 text-gray">
          <h4 class="fw-bold text-uppercase">
            {{ $t("iu.lesson.ebook") }}
          </h4>
          <div v-if="loadedEbook">
            <h4>
              {{ hierarchy.hierarchy_name }}
            </h4>
            <h5 class="text-light-gray font-weight-400">
              <BreadCrumbs :crumbs="hierarchyTree" />
            </h5>
            <hr />
            <div
              class="select-disabled overflow-auto scrollbar-blue px-2 content-height"
              v-html="ebook.content"
            />
          </div>
          <LoadingEBook v-else />
        </div>
      </div>

      <div v-show="notesOpened && !$isPhone" class="col-4 notepad-height">
        <div class="bg-white rounded-card overflow-hidden h-100 px-3 pt-3 pb-1">
          <div class="d-flex justify-content-between">
            <h5 class="mb-1 mb-md-3">
              {{ $t("iu.lesson.notepad") }}
              <img
                v-if="notesSaving"
                class="align-top pt-1"
                src="/img/small-loading.gif"
              />
            </h5>
            <CloseCircleOutline
              :size="26"
              class="cursor-pointer"
              @click="notesOpened = false"
            />
          </div>
          <NotesEditor
            v-if="loadedNotes"
            :initial-text="notesText"
            :height="NOTEPAD_FULL_HEIGHT"
            @note-input="onNotesUpdate"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/Misc/BreadCrumbs";

import BookOpenOutline from "vue-material-design-icons/BookOpenOutline";
import CloseCircleOutline from "vue-material-design-icons/CloseCircleOutline";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { FULL_HEIGHT as NOTEPAD_FULL_HEIGHT } from "@/dataObject/notepad/notepadModesData";
import LoadingEBook from "@/components/IU/EBook/LoadingEBook.vue";

import { generateEntityParentTree } from "@/utils/courseUtils";

import {
  getLessonEbookService,
  updateLessonNoteService,
  getLessonNoteService,
} from "@/services/iuService";

export default {
  name: "EBook",

  components: {
    CloseCircleOutline,
    BookOpenOutline,
    BreadCrumbs,
    NotesEditor: () =>
      import(
        /* webpackChunkName: "NotesEditorComponent" */ "@/components/IU/Lessons/NotesEditor"
      ),
    LoadingEBook,
  },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      notesOpened: false,
      notesText: "",
      ebook: {},
      showEditor: false,
      hierarchy: {},
      hierarchyTree: null,
      loadedNotes: false,
      notesSaving: false,
      courseId: null,
      lessonId: null,
      NOTEPAD_FULL_HEIGHT,
      loadedEbook: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    toggleNotes() {
      this.notesOpened = !this.notesOpened;
    },

    async init() {
      this.courseId = this.$route.params.courseId;
      this.lessonId = this.$route.params.lessonId;

      await this.getNotes();
      await this.getEbook();
    },

    async getEbook() {
      const response = await getLessonEbookService(
        this.courseId,
        this.lessonId
      );

      if (response.error) return this.handleResponseError(response);

      this.ebook = response.ebook;
      this.hierarchy = response.hierarchy;
      this.hierarchyTree = generateEntityParentTree(response.hierarchy);
      this.showEditor = true;
      this.loadedEbook = true;
    },

    async getNotes() {
      const response = await getLessonNoteService(this.courseId, this.lessonId);
      if (response.error) return this.handleResponseError(response);

      this.notesText = response.content;
      this.loadedNotes = true;
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
    handleResponseError(response) {
      if (response.status === 404 || response.status == 403)
        return this.$router.replace({ name: "pageNotFound" });
      this.$displayServerResponse(response);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.select-disabled {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
p {
  font-family: "Montserrat", sans-serif;
}
.content-height {
  height: calc(100vh - 412px);
}
.notepad-height {
  height: calc(100vh - 235px);
}
@media (max-width: $tabletWidth) {
  .content-height {
    height: 100%;
  }
}
</style>
