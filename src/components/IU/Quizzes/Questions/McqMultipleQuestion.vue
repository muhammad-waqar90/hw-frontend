<template>
  <section class="form-group my-3">
    <div class="text-to-speech-player">
      <h4 class="h4 text-blue font-weight-600">{{ $t("iu.quiz.question") }}</h4>
      <SpeechSynthesizer
        v-if="enableSpeechSynthesizer"
        :class="{ 'disable-text-to-speech': questionTextToSpeech }"
        :speech-text="question.question"
        @onHide="hideSpeechSynthesizer"
        @onPlay="disableAnswerTextToSpeech"
      />
    </div>
    <h6 class="h6 quiz-question font-weight-600">
      {{ question.question }}
    </h6>
    <div class="text-to-speech-player">
      <h4 class="h4 text-blue font-weight-600">{{ $t("iu.quiz.options") }}</h4>
      <SpeechSynthesizer
        v-if="enableSpeechSynthesizer"
        :class="{ 'disable-text-to-speech': answerTextToSpeech }"
        :speech-text="joinedAnswerOptions"
        @onHide="hideSpeechSynthesizer"
        @onPlay="disableQuestionTextToSpeech"
      />
    </div>
    <div class="answersContainer mt-2 mt-md-3">
      <label
        v-for="option in question.options"
        :key="option.id"
        class="checkbox-container font-answers font-weight-600"
        >{{ option.value }}
        <input
          :id="option.id"
          v-model="answer"
          class="form-check-input"
          type="checkbox"
          :name="option.value"
          :value="option.id.toString()"
          checked="checked"
          @change="handleChange"
        />
        <span class="checkmark" />
      </label>
    </div>
  </section>
</template>

<script>
import SpeechSynthesizer from "@/components/IU/TextToSpeech/SpeechSynthesizer.vue";
export default {
  components: {
    SpeechSynthesizer,
  },
  props: { question: Object },
  data() {
    return {
      answer: [],
      enableSpeechSynthesizer: true,
      joinedAnswerOptions: "",
      questionTextToSpeech: false,
      answerTextToSpeech: false,
    };
  },
  mounted() {
    if (this.question) {
      this.joinAnswerOptions();
    }
  },
  watch: {
    question() {
      this.answer = [];
    },
  },
  methods: {
    handleChange(e) {
      if (this.answer.length > this.question.maxChoices) {
        this.answer = this.answer.filter((item) => item != e.target.value);
        return (e.target.checked = false);
      }
      this.$emit("on-answer-change", this.answer);
    },
    hideSpeechSynthesizer(value) {
      this.enableSpeechSynthesizer = !value;
    },
    disableAnswerTextToSpeech(value) {
      this.answerTextToSpeech = value;
    },
    disableQuestionTextToSpeech(value) {
      this.questionTextToSpeech = value;
    },
    joinAnswerOptions() {
      this.joinedAnswerOptions = this.question.options
        .map((option) => `${option.value}`)
        .join(", ");
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.answersContainer {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  width: 100%;
  input[type="radio"] {
    transform: scale(1.2);
  }
}

.quiz-question {
  font-size: 24px;
}

.font-answers {
  font-size: 14px;
}

.checkbox-container {
  display: block;
  position: relative;
  padding-left: 35px;
  margin-bottom: 12px;
  width: fit-content;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: #eee;
    border-radius: 2px;
  }

  &:hover input ~ .checkmark {
    background-color: #ccc;
  }

  input:checked ~ .checkmark {
    background-color: $blue;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  input:checked ~ .checkmark:after {
    display: block;
  }

  .checkmark:after {
    left: 9px;
    top: 5px;
    width: 8px;
    height: 13px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }
}
.text-to-speech-player {
  display: flex;
  align-items: flex-start;
}
.disable-text-to-speech {
  pointer-events: none;
  opacity: 0.5;
}

@media (max-width: $tabletWidth) {
  .answersContainer {
    grid-template-columns: repeat(1, 1fr);
    label {
      white-space: normal;
    }
  }
  .h6 {
    white-space: initial;
  }
}
</style>
