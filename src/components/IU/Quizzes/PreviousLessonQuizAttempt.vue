<template>
  <div
    class="bg-white font-montserrat text-dark-gray rounded-card position-relative p-4"
    :class="{ 'mob-specific-style': $isPhone }"
  >
    <div class="text-center mb-2" :class="{ 'mob-text-start': $isPhone }">
      <h3
        class="text-center font-weight-600 mt-2 mb-0"
        :class="{ 'mob-text-start': $isPhone }"
      >
        {{ entity.hierarchy_name }}
      </h3>
      <BreadCrumbs :crumbs="hierarchyTree" :color-hierarchy="true" />
    </div>
    <hr class="hidden" :class="{ 'mob-divider mb-4 mt-2': $isPhone }" />

    <div class="bg-light-gray pb-3 rounded-card">
      <div
        :class="[previousAttempt.has_passed ? 'bg-green' : 'bg-red']"
        class="rounded-card p-4 px-5"
      >
        <div class="d-flex flex-column">
          <h3
            :class="quizTitleStyle"
            class="text-white font-weight-700 text-center mb-0"
          >
            {{ quizTitle }}
          </h3>
          <hr class="mb-4 mt-2" />
          <ProgressBar
            :progress="previousAttempt.score"
            :very-big-bar="true"
            :color="previousAttempt.has_passed ? 'green' : 'red'"
            :white-bar="true"
          />
          <hr class="my-4" />
          <h3
            class="blessing text-white font-weight-400 text-center"
            v-html="encourageMessage"
          />
        </div>
      </div>
      <h5 class="text-center results-text mt-4 font-weight-400">
        <span
          :class="[previousAttempt.has_passed ? 'bold-green' : 'bold-red']"
          v-html="hasPassedText"
        />
        <span v-html="correctAnswersVariant" />
      </h5>
    </div>

    <div class="d-flex justify-content-center flex-column flex-md-row mt-3">
      <button
        class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-border-btn rounded-pill font-weight-500 text-uppercase"
        :class="{ 'instruction-btn-tab': $isTablet }"
        @click="$emit('toggle-mode')"
      >
        {{ $t("iu.quiz.instructionsBtn") }}
      </button>

      <button
        v-if="!previousAttempt.has_passed"
        class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-btn rounded-pill font-weight-500 text-uppercase"
        :class="{ 'instruction-btn-tab': $isTablet }"
        @click="$emit('take-quiz')"
      >
        {{ $t("iu.quiz.retake") }}
      </button>
      <button
        v-if="
          previousAttempt.has_passed &&
          nextLesson != null &&
          nextLesson.available == true &&
          nextLesson.published == 1
        "
        class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-btn rounded-pill font-weight-500 text-uppercase"
        :class="{ 'instruction-btn-tab': $isTablet }"
        @click="handleLessonChange"
      >
        {{ $t("iu.quiz.nextLessonBtn") }}
      </button>
      <button
        v-if="previousAttempt.has_passed && isExamReady && hasModuleExam"
        class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-btn rounded-pill font-weight-500 text-uppercase"
        :class="{ 'instruction-btn-tab': $isTablet }"
        @click="$emit('handle-exam-start')"
      >
        {{ $t("iu.quiz.takeModuleExam") }}
      </button>
    </div>

    <div
      v-if="hasEbook"
      class="ebook-notification p-3 text-white"
      :class="{
        'mob-ebook-notification': $isPhone,
        'tab-ebook-notification': $isTablet,
      }"
    >
      <BookOpenOutline class="ebook-icon me-2" />
      <span class="mt-1 ebook-font">{{ $t("iu.quiz.ebookEncourage") }}</span>
      <!-- <span
        v-if="!previousAttempt.has_passed && !hasPurchasedEbook"
        class="mt-1 text-dark-gray ebook-font text-white"
        @click="$emit('handle-purchase-ebook')"
      >
        <a class="link-style"> {{ $t("iu.course.ebookPurchase") }}</a>
      </span> -->
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/Misc/BreadCrumbs.vue";
import ProgressBar from "@/components/Misc/ProgressBar";

import { UTCtoLocalDateOnlyFormatted } from "@/utils/dateTimeUtils";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

import BookOpenOutline from "vue-material-design-icons/BookOpenBlankVariant";

export default {
  components: {
    BreadCrumbs,
    ProgressBar,
    BookOpenOutline,
  },
  mixins: [toastMixin, devicesMixin],
  props: {
    previousAttempt: {
      type: Object,
    },
    hierarchyTree: {
      type: Array,
    },
    entity: {
      type: Object,
    },
    nextLesson: {
      type: Object,
    },
    isExamReady: {
      type: Boolean,
    },
    hasModuleExam: {
      type: Boolean,
    },
    hasEbook: {
      type: Boolean,
    },
    hasPurchasedEbook: {
      type: Boolean,
    },
  },
  computed: {
    correctAnswers() {
      return parseInt(
        (this.previousAttempt.num_of_questions * this.previousAttempt.score) /
          100
      );
    },
    bgColorParent() {
      return this.previousAttempt.has_passed ? "bg-green" : "bg-red";
    },
    bgColorChild() {
      return this.previousAttempt.has_passed ? "bg-dark-green" : "bg-dark-red";
    },
    quizTitle() {
      return this.previousAttempt.has_passed
        ? this.$t("iu.quiz.congratulations")
        : this.$t("iu.quiz.unsuccessful");
    },
    hasPassedText() {
      return this.previousAttempt.has_passed
        ? this.$t("iu.quiz.passedTest")
        : this.$t("iu.quiz.notPassedTest");
    },
    encourageMessage() {
      return this.previousAttempt.has_passed
        ? this.$t("iu.quiz.passedTestEncourage")
        : this.$t("iu.quiz.failedTestEncourage");
    },
    updatedAt() {
      return UTCtoLocalDateOnlyFormatted(this.previousAttempt.updated_at);
    },
    correctAnswersVariant() {
      return this.previousAttempt.has_passed
        ? this.$t(`iu.quiz.correctAnswers`, {
            correctNum: this.correctAnswers,
            totalNum: this.previousAttempt.num_of_questions,
          })
        : this.$t(`iu.quiz.correctAnswersFailed`, {
            correctNum: this.correctAnswers,
            totalNum: this.previousAttempt.num_of_questions,
          });
    },
    quizTitleStyle() {
      if (this.$isPhone) {
        return this.previousAttempt.has_passed
          ? "mob-congratulations-title"
          : "mob-unsuccessful-title";
      } else if (this.$isTablet) {
        return this.previousAttempt.has_passed
          ? "tab-congratulations-title"
          : "tab-unsuccessful-title";
      } else
        return this.previousAttempt.has_passed
          ? "congratulations-title"
          : "unsuccessfull-title";
    },
  },
  methods: {
    handleLessonChange() {
      this.nextLesson.available
        ? this.$router.push({
            name: "iu-lesson",
            params: {
              courseId: this.$route.params.courseId,
              lessonId: this.nextLesson.id,
            },
          })
        : this.$displayErrorToast(this.$t("iu.lesson.errors.notAvailable"));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.bg-green {
  background-color: #53af52;
}
.bg-dark-green {
  background-color: #4b9d4a;
}
.bg-red {
  background-color: #e8505b;
}
.bg-dark-red {
  background-color: #d34a53;
}
.bg-light-gray {
  background-color: $lightgray;
}
.big-heading {
  font-size: 48px;
  color: $white;
}
.medium-heading {
  font-size: 28px;
  color: $white;
  margin-top: 2rem;
}
.quiz-attempt-summary {
  font-size: 18px;
  color: $white;
  font-weight: 400;
}
.btn-font {
  font-size: 14px;
}
hr {
  color: $white;
  opacity: 0.75;
}
.congratulations-title {
  font-size: 46px;
  letter-spacing: 2px;
}
.unsuccessful-title {
  font-size: 56px;
  letter-spacing: 5px;
}
.tab-congratulations-title {
  font-size: 36px;
  letter-spacing: 2px;
}
.tab-unsuccessful-title {
  font-size: 50px;
  letter-spacing: 5px;
}
.mob-congratulations-title {
  font-size: 16px;
  letter-spacing: 2px;
}
.mob-unsuccessful-title {
  font-size: 25px;
  letter-spacing: 4px;
}
.blessing {
  font-size: 20px;
  font-style: italic;
}
.results-text {
  font-size: 16px;
}
.percentage {
  color: $white;
}
.score {
  color: $white;
  font-size: 46px;
  letter-spacing: -3px;
}
.passed {
  color: $green;
}
.failed {
  color: $red;
}
.text-btn {
  font-size: 12px;
}
.ebook-font {
  font-size: 13px;
}
.white-btn--red {
  color: $red !important;
}
.white-btn--green {
  color: $green !important;
}
.bold-green :deep(b) {
  color: $green;
}
.bold-red :deep(b) {
  color: $red;
}
.ebook-icon {
  width: 30px;
  height: 30px;
}
.link-style {
  color: $white;
  text-decoration: underline;
  cursor: pointer;
  margin-left: 4px;
}
.ebook-notification {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  text-align: center;
  position: absolute;
  bottom: -50px;
}
.tab-ebook-notification {
  position: absolute;
  width: 90%;
  bottom: -54px;
}
.mob-ebook-notification {
  width: auto;
  position: relative;
  bottom: 0px;
  color: $black !important;
}
.mob-specific-style {
  max-height: 80vh;
  overflow-y: scroll;
}
.mob-text-start {
  text-align: start !important;
}
.mob-divider {
  color: $gray;
  opacity: 0.4;
}
.instruction-btn-tab {
  white-space: nowrap;
}
</style>
