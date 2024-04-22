<template>
  <div
    :class="[bgColor, { 'active-outline-btn': isSelected }]"
    class="full-rounded-card cursor-pointer align-items-center position-relative px-3 py-2 mb-2"
    @click.stop="handleLessonChange"
  >
    <div
      :class="[
        { disabled: lesson.available == false || lesson.published == 0 },
      ]"
      class="row lesson-menu-item align-items-center"
    >
      <div class="col-auto ps-2">
        <span class="font-weight-700 text-blue">{{ lessonId }}</span>
      </div>
      <div class="col ps-0">
        <span
          class="text-capitalize font-weight-600 title-font lesson-name text-dark-gray"
        >
          {{ lesson.name }}
        </span>
      </div>
      <div v-if="btnVisible" class="col-auto pe-2">
        <button
          :class="[btnColor]"
          :disabled="disabledLesson"
          class="btn btn-width rounded-btn font-weight-600 start-test-btn py-1 px-0"
          @click.stop="handleQuizStart"
          v-html="btnTextBreak"
        />
      </div>
      <div v-if="!btnVisible && lesson.has_quiz" class="col-auto pe-2">
        <button
          :class="[btnColor]"
          class="btn btn-width rounded-btn font-weight-600 start-test-btn py-1 px-0"
          @click.stop="handleQuizStart(true)"
          v-html="viewResultsText"
        />
      </div>
    </div>

    <portal to="out-of-app-content">
      <WarningModal
        v-if="warningModal"
        :with-confirmation-buttons="true"
        :only-confirm="true"
        @close-modal="warningModal = false"
        @on-confirm="closeWarningModal"
      >
        <span slot="body">
          {{ modalMessage }}
        </span>
      </WarningModal>
    </portal>
  </div>
</template>

<script>
import WarningModal from "@/components/Misc/WarningModal";

import {
  MIN_PROGRESS_TO_ACCESS_QUIZ,
  COMPLETED_PROGRESS,
} from "@/dataObject/userProgressData";

import toastMixin from "@/mixins/toastMixin";

export default {
  components: { WarningModal },
  mixins: [toastMixin],

  props: {
    lesson: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      warningModal: false,
    };
  },
  computed: {
    isSelected() {
      return this.$route.params.lessonId == this.lesson.id;
    },
    bgColor() {
      if (this.lesson.progress == COMPLETED_PROGRESS) return "bg-green";
      if (this.lesson.failed_quiz == true) return "bg-light-red";
      return "bg-gray";
    },
    lessonId() {
      return this.lesson.order_id < 10
        ? "0" + this.lesson.order_id
        : this.lesson.order_id;
    },
    btnTextBreak() {
      return this.lesson.failed_quiz == true
        ? this.$t("iu.lesson.retakeTest").replace(/\s/g, "<br>")
        : this.lesson.published == 0
        ? this.$t("iu.lesson.comingSoon").replace(/\s/g, "<br>")
        : this.$t("iu.lesson.startTest").replace(/\s/g, "<br>");
    },
    btnVisible() {
      return this.lesson.progress < COMPLETED_PROGRESS && this.lesson.has_quiz;
    },
    btnColor() {
      if (this.lesson.progress == COMPLETED_PROGRESS) return "green-btn";
      if (this.lesson.failed_quiz == true) return "red-btn";
      return this.lesson.progress < MIN_PROGRESS_TO_ACCESS_QUIZ
        ? "gray-btn"
        : "blue-btn";
    },
    isAbleToAttemptQuiz() {
      return this.lesson.progress >= MIN_PROGRESS_TO_ACCESS_QUIZ;
    },
    viewResultsText() {
      return this.$t("iu.lesson.passed").replace(/\s/g, "<br>");
    },
    modalMessage() {
      return this.lesson.published == 0
        ? this.$t("iu.lesson.errors.notPublished")
        : this.$t("iu.lesson.errors.notAvailable");
    },
    disabledLesson() {
      return this.lesson.available == false || this.lesson.published == 0
        ? true
        : false;
    },
  },

  methods: {
    handleLessonChange() {
      if (this.lesson.id == this.$route.params.lessonId) return;
      this.lesson.available && this.lesson.published == 1
        ? this.$router.replace({
            name: "iu-lesson",
            params: {
              courseId: this.$route.params.courseId,
              lessonId: this.lesson.id,
            },
          })
        : this.openWarningModal();
    },

    handleQuizStart(preview = false) {
      if (this.lesson.id != this.$route.params.lessonId)
        return this.handleLessonChange();

      this.isAbleToAttemptQuiz
        ? this.$emit("start-quiz", preview)
        : this.isSelected
        ? this.$displayErrorToast(this.$t("iu.lesson.errors.videoNotWatched"))
        : this.$displayErrorToast(this.$t("iu.lesson.errors.notAvailable"));
    },

    openWarningModal() {
      this.$emit("pause-video");
      this.warningModal = true;
    },
    closeWarningModal() {
      this.warningModal = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.full-rounded-card {
  border-radius: 50px;
}

.rounded-btn {
  border-radius: 14px;
}

.bg-blue {
  background-color: $blue;
}

.bg-green {
  background-color: $lightgreen;
}

.bg-gray {
  background-color: $lightgray;
}

.bg-red {
  background-color: $red;
  color: $static-white;
}

.bg-light-red {
  background-color: $lightred;
}

.disabled {
  opacity: 0.4;
  cursor: pointer !important;
}

.opacity-full {
  opacity: 1 !important;
}

.popup-position {
  top: -20px;
  right: 0;
  z-index: 9000;
}

.lesson-menu-item {
  min-height: 35px;
}

.btn-width {
  width: 60px;
}

.start-test-btn {
  font-size: 9px;
}

.title-font {
  font-size: 14px;
}

.white-text {
  color: $static-white;
}

.active-outline-btn {
  border: 2px solid $blue;
}

.icon-very-small {
  height: 1em;
  width: 1em;
}

.popup-font {
  font-size: 12px;
}
</style>
