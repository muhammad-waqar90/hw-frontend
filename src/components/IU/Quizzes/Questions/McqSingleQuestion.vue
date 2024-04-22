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
      <!-- <label
        v-for="option in question.options"
        :key="option.id"
        class="radio-container"
      >{{ option.value }}
        <input
          :id="option.id"
          v-model="answer"
          class="form-check-input"
          type="radio"
          :name="option.value"
          :value="option"
          checked="checked"
          @change="handleChange(option.id)"
        >
        <span class="checkmark" />
      </label> -->
      <div
        v-for="(option, i) in question.options"
        :id="option.id"
        :key="option.id"
        class="bg-lightgray question-font font-weight-600 full-rounded cursor-pointer px-4 py-3 m-2"
        :class="[{ selected: answer && option.id == answer.id }]"
        @click="handleSelect(option)"
      >
        <span class="font-weight-700 color-blue me-3">{{
          getCharPrefix(i)
        }}</span>
        <span>{{ option.value }}</span>
      </div>
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
      answer: null,
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
      this.answer = null;
    },
  },
  methods: {
    handleSelect(value) {
      this.answer = value;
      this.$emit("on-answer-change", value.id.toString());
    },
    getCharPrefix(i) {
      if (i == 0) return "A";
      if (i == 1) return "B";
      if (i == 2) return "C";
      if (i == 3) return "D";
      return "";
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
        .map((option, index) => `${this.getCharPrefix(index)}: ${option.value}`)
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
  input[type="radio"] {
    transform: scale(1.2);
  }
}

.quiz-question {
  font-size: 24px;
}
.question-font {
  font-size: 14px;
}
.selected {
  border: 2px solid $blue;
}
.full-rounded {
  border-radius: 30px;
}

.bg-lightgray {
  background-color: $lightgray;
}

.color-blue {
  color: $blue;
}

.radio-container {
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
  }
  .checkmark {
    position: absolute;
    top: -3px;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: rgb(224 235 248 / 80%);
    border-radius: 50%;
    &:hover input ~ .checkmark {
      background-color: #ccc;
    }
  }
  input:checked ~ .checkmark {
    background-color: $blue;
  }
  input:checked ~ .checkmark:after {
    display: block;
  }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  .checkmark:after {
    top: 9px;
    left: 9px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: white;
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
