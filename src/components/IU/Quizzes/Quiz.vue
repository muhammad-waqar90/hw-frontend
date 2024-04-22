<template>
  <div
    class="quizWrapper font-montserrat text-dark-gray"
    :class="{ 'w-100': $isPhone }"
  >
    <DisplayTimeLeft
      :display-time-left="displayTimeLeft"
      :timer-style="timerStyle"
    />
    <section
      class="p-5 mt-4 bg-white quiz-container"
      :class="{ 'mob-quiz-container': $isPhone }"
    >
      <div class="quiz-ms-title">
        <div class="scrollbar-blue border-bottom pb-2 quiz-header">
          <div
            class="fw-bold lesson-title mb-2"
            :class="{ 'mob-lesson-title': $isPhone }"
          >
            {{ entity.hierarchy_name }}
          </div>
          <div
            class="module-title d-flex justify-content-between mb-3"
            :class="{ 'flex-column mob-module-title': $isPhone }"
          >
            <BreadCrumbs
              class="col-9"
              :crumbs="hierarchyTree"
              :color-hierarchy="true"
            />

            <div
              class="col-3 px-2 question-title"
              :class="{ 'mob-question-title': $isPhone }"
            >
              {{ $t("iu.quiz.shortQuestion") }}: {{ displayQuestionStep }}
            </div>
          </div>
        </div>

        <div class="mt-4 mb-3">
          <progress-bar :very-big-bar="true" :progress="displayProgress" />
        </div>
      </div>
      <div v-if="questions.length" :key="currentStep" class="mt-4 mt-lg-5">
        <McqSingleQuestion
          v-if="currentQuestion.type === 'mcqSingle'"
          :question="currentQuestion"
          class="quiz-body scrollbar-blue"
          @on-answer-change="handleAnswerChange"
        />
        <McqMultipleQuestion
          v-if="currentQuestion.type === 'mcqMultiple'"
          :question="currentQuestion"
          class="quiz-body scrollbar-blue"
          @on-answer-change="handleAnswerChange"
        />
        <MissingWordQuestion
          v-if="currentQuestion.type === 'missingWord'"
          :question="currentQuestion"
          @on-answer-change="handleAnswerChange"
        />
        <LinkingQuestion
          v-if="currentQuestion.type === 'linking'"
          :question="currentQuestion"
          @on-answer-change="handleAnswerChange"
        />

        <div
          class="quiz-actions d-flex mt-3 pt-4 border-top"
          :class="{ 'mob-quiz-actions': $isPhone }"
        >
          <button
            v-if="!quizSubmited"
            class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-border-btn rounded-pill font-weight-600 text-uppercase"
            :class="{ 'mob-btn-padding': $isPhone }"
            :disabled="quizSubmited"
            @click.prevent="onNextStep"
          >
            {{ $t("iu.quiz.skip") }}
          </button>

          <template v-if="currentAnswer">
            <button
              class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-btn rounded-pill font-weight-600 text-uppercase"
              :class="{ 'mob-btn-padding': $isPhone }"
              :disabled="quizSubmited"
              @click="commitAnswer"
            >
              {{ $t("iu.quiz.submitAnswer") }}
            </button>
          </template>
        </div>
      </div>
    </section>
    <OnBlurAlert v-if="entity.type != 'lesson'" :text="$t('iu.quiz.warning')" />
  </div>
</template>

<script>
import ProgressBar from "@/components/Misc/ProgressBar";
import McqMultipleQuestion from "@/components/IU/Quizzes/Questions/McqMultipleQuestion";
import McqSingleQuestion from "@/components/IU/Quizzes/Questions/McqSingleQuestion";
import MissingWordQuestion from "@/components/IU/Quizzes/Questions/MissingWordQuestion";
import LinkingQuestion from "@/components/IU/Quizzes/Questions/LinkingQuestion";
import DisplayTimeLeft from "./DisplayTimeLeft";
import BreadCrumbs from "@/components/Misc/BreadCrumbs.vue";
import OnBlurAlert from "@/components/Misc/OnBlurAlert";

import { UTCtoLocalDate } from "@/utils/dateTimeUtils";
import { roundNumber } from "@/utils/generalUtils";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    ProgressBar,
    McqMultipleQuestion,
    McqSingleQuestion,
    MissingWordQuestion,
    LinkingQuestion,
    DisplayTimeLeft,
    BreadCrumbs,
    OnBlurAlert,
  },
  mixins: [devicesMixin],
  props: {
    questions: { type: Array },
    duration: { type: Number },
    startedAt: { type: String },
    numOfQuestions: { type: Number },
    entityId: "",
    courseId: "",
    hierarchyTree: "",
    entity: "",
    uuid: null,
  },
  data() {
    return {
      timeLeft: null,
      quizEndTime: null,
      timeInterval: "",
      currentStep: 0,
      answers: {},
      currentAnswer: null,
      quizSubmited: false,
    };
  },
  computed: {
    displayTimeLeft() {
      return (
        this.strPadLeft(Math.floor(this.timeLeft / 60), "0", 2) +
        ":" +
        this.strPadLeft(
          Math.floor(this.timeLeft - Math.floor(this.timeLeft / 60) * 60),
          "0",
          2
        )
      );
    },
    isFinalQuestion() {
      return this.currentStep + 1 === this.numOfQuestions;
    },
    currentQuestion() {
      return this.questions[this.currentStep];
    },
    displayQuestionStep() {
      return this.currentStep + 1 + " / " + this.numOfQuestions;
    },
    displayProgress() {
      return roundNumber((this.currentStep / this.numOfQuestions) * 100, 0);
    },
    timerStyle() {
      if (this.timeLeft === null) return "background: #1982ef";
      if (this.timeLeft <= 10) return "background: #e8505b";
      if (this.timeLeft <= 60) return "background: #f2a000";
      return "background: #1982ef";
    },
  },
  mounted() {
    this.init();
  },
  destroyed() {
    clearInterval(this.timeInterval);
  },
  methods: {
    init() {
      this.quizSubmited = false;
      this.initAnswers();
      this.initTimeLeft();
      this.startTimer();
      this.loadSavedAnswers();
    },
    initAnswers() {
      for (const q of this.questions) {
        const key = q.id;
        if (q.type === "mcqSingle" || q.type === "missingWord") {
          this.answers[key] = { answerId: "" };
        } else if (q.type === "mcqMultiple") {
          this.answers[key] = { answerId: [] };
        } else if (q.type === "linking") {
          this.answers[key] = { answerId: {} };
        }
      }
    },
    initTimeLeft() {
      const currentTime = new Date().getTime() / 1000;
      const startedAt = UTCtoLocalDate(this.startedAt).getTime() / 1000;
      this.quizEndTime = startedAt + this.duration;

      const timeLeft = Math.round(this.quizEndTime - currentTime);
      this.timeLeft = timeLeft > 0 ? timeLeft : 0;
    },
    startTimer() {
      this.timeInterval = setInterval(() => {
        const currentTime = new Date().getTime() / 1000;
        const timeLeft = Math.round(this.quizEndTime - currentTime);
        if (timeLeft < 10 && this.entity?.type == "course_module") {
          localStorage.setItem("handleLastMomentExamReloading", true);
        }
        if (timeLeft < 0) {
          clearInterval(this.timeInterval);
          this.$emit("on-time-expired", this.answers);
        } else {
          this.timeLeft = timeLeft;
        }
      }, 1000);
    },
    loadSavedAnswers() {
      if (!localStorage.getItem("savedQuiz")) return this.saveLocalAnswers();

      let savedQuiz = JSON.parse(localStorage.getItem("savedQuiz"));
      if (savedQuiz.uuid !== this.uuid) return this.saveLocalAnswers();

      this.currentStep = savedQuiz.currentStep;
      this.answers = savedQuiz.answers;
    },
    saveLocalAnswers() {
      let savedQuiz = {
        currentStep: this.currentStep,
        answers: this.answers,
        uuid: this.uuid,
      };

      localStorage.setItem("savedQuiz", JSON.stringify(savedQuiz));
    },
    onNextStep() {
      this.currentAnswer = null;

      if (this.isFinalQuestion) {
        this.quizSubmited = true;
        if (this.entity?.type == "course_module") {
          localStorage.setItem("handleLastMomentExamReloading", true);
        }
        return this.$emit("on-submit", this.answers);
      }

      this.currentStep += 1;
      this.saveLocalAnswers();
    },
    handleAnswerChange(data) {
      this.currentAnswer = data;
    },
    commitAnswer() {
      this.answers[this.currentQuestion.id].answerId = this.currentAnswer;
      this.onNextStep();
    },
    strPadLeft(string, pad, length) {
      return (new Array(length + 1).join(pad) + string).slice(-length);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.quizWrapper {
  .quiz-container {
    border-radius: 2rem;

    .quiz-ms-title {
      .module-title {
        font-size: 1.1rem;
        width: 100%;
        background: -webkit-linear-gradient(0deg, $darkgray 90%, $white);
        -webkit-background-clip: text;
      }
      .lesson-title {
        font-size: 1.4rem;
        color: $darkgray;
      }

      .question-title {
        font-size: 1.1rem;
        color: $blue;
        font-weight: 600;
        text-align: right;
      }
    }
    .quiz-actions {
      justify-content: right;
      .skipButton {
        background: $orange;
      }
      .submitButton {
        background: $green;
      }
    }
  }
}
.quiz-header {
  overflow-y: auto;
  max-height: 95px;
}
.quiz-body {
  max-height: calc(40vh - 6rem);
  overflow-y: auto;
}

.btn-font {
  font-size: 14px;
}

@media (max-width: $laptopWidth) {
  .quizWrapper {
    .quiz-container {
      .quiz-actions {
        justify-content: space-between;
      }
    }
  }
}

@media (max-width: $tabletWidth) {
  .quizWrapper {
    .quiz-container {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .quiz-ms-title {
        .module-title {
          font-size: 0.9rem;
        }
      }
    }
  }
}
.mob-quiz-container {
  padding: 1rem !important;
  white-space: normal !important;
}
.mob-module-title {
  font-size: 0.5rem;
}
.mob-lesson-title {
  font-size: 0.9rem;
}
.mob-question-title {
  font-size: 1.1rem !important;
  width: 100% !important;
  text-align: left !important;
}

.mob-quiz-actions {
  justify-content: right !important;
}

.mob-btn-padding {
  padding-right: 1rem !important;
  padding-left: 1rem !important;
}
.quiz-header {
  max-height: calc(15vh - 3rem);
  overflow-y: auto;
}
</style>
