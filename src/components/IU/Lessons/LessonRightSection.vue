<template>
  <div class="lesson-right-section d-flex flex-column">
    <template v-if="!notesOpened">
      <div
        class="lesson-progress bg-white p-3 rounded-card d-flex flex-column justify-content-center align-items-center"
      >
        <div class="h6 mb-0">
          {{ $t("iu.lesson.progress") }}
        </div>
        <radial-progress-bar
          :diameter="155"
          :completed-steps="lesson.progress ? lesson.progress : 0"
          :total-steps="100"
          inner-stroke-color="#f2f4fb"
          start-color="#1982ef"
          stop-color="#1982ef"
          :is-clockwise="false"
          :stroke-width="$isMobile ? 11 : 16"
          :inner-stroke-width="$isMobile ? 11 : 16"
        >
          <span class="h4 m-0">
            {{ lesson.progress ? lesson.progress : 0 }}
            <span class="text-blue">%</span>
          </span>
          <div class="small">
            {{ $t("iu.course.completed") }}
          </div>
        </radial-progress-bar>
      </div>
      <div
        class="lesson-buttons bg-white px-1 rounded-card mt-3 py-4 d-flex flex-column justify-content-center"
      >
        <LessonButtons
          :progress="lesson.progress"
          :has-quiz="lesson.has_quiz"
          :course-id="courseId"
          :lesson="lesson"
          @on-notepad="onNotepad"
          @on-start-exam="onStartExam"
          @on-ebook="handleEbookClick"
        />
      </div>
      <div
        v-if="$isDesktop"
        class="overflow-hidden d-flex flex-column py-3 bg-white px-4 rounded-card mt-3 flex-grow-1"
      >
        <div class="h5">
          {{ $t("iu.lesson.description") }}
        </div>
        <div class="scrollbar-blue overflow-auto pe-2">
          {{ lesson.description }}
        </div>
      </div>
    </template>
    <div v-else class="h-100">
      <div class="bg-white rounded-card h-100 px-3 pt-3 pb-1 overflow-hidden">
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
          :initial-text="notesText"
          :height="NOTEPAD_FULL_HEIGHT"
          @note-input="onNotesUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script>
import RadialProgressBar from "vue-radial-progress";
import LessonButtons from "@/components/IU/Lessons/LessonButtons";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import CloseCircleOutline from "vue-material-design-icons/CloseCircleOutline";

import { FULL_HEIGHT as NOTEPAD_FULL_HEIGHT } from "@/dataObject/notepad/notepadModesData";

export default {
  name: "LessonRightSection",

  components: {
    RadialProgressBar,
    LessonButtons,
    CloseCircleOutline,
    NotesEditor: () =>
      import(
        /* webpackChunkName: "NotesEditorComponent" */ "@/components/IU/Lessons/NotesEditor"
      ),
  },

  mixins: [devicesMixin],

  props: {
    lesson: {
      type: Object,
      default: () => {},
    },
    courseId: {
      type: [Number, String],
    },
    notesText: {
      type: String,
      default: "",
    },
    notesSaving: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      notesOpened: false,
      NOTEPAD_FULL_HEIGHT,
    };
  },

  methods: {
    onNotesUpdate(text) {
      this.$emit("on-notes-update", text);
    },

    onNotepad() {
      this.notesOpened = true;
    },

    onStartExam() {
      this.$emit("on-start-exam");
    },

    handleEbookClick() {
      this.$emit("handle-ebook-click");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.lesson-right-section {
  width: 360px;
  position: sticky;
  top: 15px;
  height: calc((100vw - (610px + 3rem)) * 9 / 16 + 125px);
}

@media (max-width: $desktopWidth) {
  .lesson-right-section {
    .lesson-progress {
      height: 49%;
    }
    .lesson-buttons {
      height: 48%;
    }
  }
}

@media (max-width: $bigDesktopWidth) {
  .lesson-right-section {
    height: calc((100vw - (500px + 3rem)) * 9 / 16 + 141px);
  }
}

@media (max-width: 2045px) {
  .lesson-right-section {
    top: 80px;
  }
}
</style>
