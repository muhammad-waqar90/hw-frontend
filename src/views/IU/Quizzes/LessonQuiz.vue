<template>
  <section>
    <template v-if="display404">
      <SomethingWrong />
    </template>
    <div v-if="loading">
      <LoadingLessonQuizAttempt />
    </div>
    <template v-else-if="!loading">
      <Quiz
        :questions="questions"
        :duration="duration"
        :started-at="startedAt"
        :num-of-questions="numOfQuestions"
        :entity-id="entityId"
        :course-id="courseId"
        :entity="entity"
        :hierarchy-tree="hierarchyTree"
        :uuid="uuid"
        @on-time-expired="handleSubmit"
        @on-submit="handleSubmit"
      />
    </template>
  </section>
</template>

<script>
import Quiz from "@/components/IU/Quizzes/Quiz.vue";
import LoadingLessonQuizAttempt from "@/components/IU/Quizzes/LoadingLessonQuizAttempt.vue";
import SomethingWrong from "@/views/SomethingWrong.vue";
import quizViewMixin from "@/mixins/IU/quizViewMixin";
import {
  getLessonQuizService,
  submitLessonQuizService,
} from "@/services/IU/iuQuizService";

export default {
  name: "LessonQuiz",
  components: {
    SomethingWrong,
    Quiz,
    LoadingLessonQuizAttempt,
  },
  mixins: [quizViewMixin],
  data() {
    return {
      entityName: "lessonId",
      entityRoute: "iu-lesson",
      previousQuizAttemptRoute: "iu-lesson-quiz-attempt",
      getQuizService: getLessonQuizService,
      submitQuizService: submitLessonQuizService,
    };
  },
  mounted() {
    this.init();
    window.addEventListener("beforeunload", this.leaving);
  },
  destroyed() {
    window.removeEventListener("beforeunload", this.leaving);
  },

  methods: {
    handleSubmit(answers) {
      this.submitQuiz(answers, false);
    },
    leaving: function () {
      localStorage.setItem("leftQuiz", this.entityId);
    },
  },
};
</script>
