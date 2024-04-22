<template>
  <div class="d-flex flex-column lessonButtonsContainer">
    <div
      class="d-flex flex-row flex-md-column justify-content-center align-items-center"
      :class="{
        'justify-content-between': showStartQuiz,
        'justify-content-center': !showStartQuiz,
      }"
    >
      <button
        v-if="lesson.has_ebook"
        class="btn btn-green btn-ebook action-button text-white position-relative text-uppercase"
        @click="onEbook"
      >
        {{ $t("iu.lesson.ebook") }}
        <BookOpenOutline class="lesson-button-icon" :size="20" />
      </button>
      <button
        class="btn btn-orange d-none d-md-block action-button my-2 text-white position-relative text-uppercase"
        @click="onNotepad"
      >
        {{ $t("iu.lesson.notepad") }}
        <Note class="lesson-button-icon" :size="20" />
      </button>
      <router-link
        v-if="lesson.has_quiz"
        :to="{
          name: 'iu-lesson-quiz-attempt',
          params: { courseId: courseId, lessonId: lesson.id },
        }"
        class="btn btn-blue action-button text-white position-relative text-uppercase"
        :disabled="!quizButtonEnabled"
        :class="{ disabled: !quizButtonEnabled }"
      >
        {{ $t("iu.lesson.startExam") }}
        <School class="lesson-button-icon" :size="20" />
      </router-link>
    </div>
  </div>
</template>

<script>
import { MIN_PROGRESS_TO_ACCESS_QUIZ } from "@/dataObject/userProgressData";
import BookOpenOutline from "vue-material-design-icons/BookOpenBlankVariant";
import Note from "vue-material-design-icons/Note";
import School from "vue-material-design-icons/School";

export default {
  name: "LessonButtons",
  components: {
    BookOpenOutline,
    Note,
    School,
  },
  props: {
    progress: { type: Number },
    hasQuiz: { type: Boolean },
    courseId: { type: [Number, String] },
    lesson: { type: Object },
  },
  computed: {
    showStartQuiz() {
      return this.hasQuiz;
    },
    quizButtonEnabled() {
      return this.progress >= MIN_PROGRESS_TO_ACCESS_QUIZ;
    },
  },
  methods: {
    onNotepad() {
      this.$emit("on-notepad");
    },
    onEbook() {
      this.$emit("on-ebook");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.action-button {
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  width: 60%;
}

.btn-green {
  background-color: $green;
  border-color: $green;
}

.btn-orange {
  background-color: $orange;
  border-color: $orange;
}

.btn-blue {
  background-color: $blue;
  border-color: $blue;
}

.lesson-button-icon {
  position: absolute;
  right: 15px;
  top: 4px;
}

@media (max-width: $laptopWidth) {
  .lessonButtonsContainer {
    width: 80%;
    margin: auto;
  }
  .action-button {
    width: 125px;
    padding: 8px 12px;
    margin: 0 10px;
  }
}
</style>
