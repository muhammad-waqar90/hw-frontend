<template>
  <section class="container mt-3 px-0 px-sm-3">
    <template v-if="display404">
      <SomethingWrong />
    </template>
    <portal to="out-of-app-content" v-else-if="!loading">
      <ExamModal>
        <template slot="body">
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
            @on-time-expired="handleExpiredTime"
            @on-submit="submitQuiz"
          />
        </template>
      </ExamModal>
    </portal>
  </section>
</template>

<script>
import Quiz from "@/components/IU/Quizzes/Quiz.vue";
import SomethingWrong from "@/views/SomethingWrong.vue";
import quizViewMixin from "@/mixins/IU/quizViewMixin";
import ExamModal from "@/components/Misc/ExamModal";
import {
  getModuleQuizService,
  submitModuleQuizService,
} from "@/services/IU/iuQuizService";

export default {
  name: "CourseModuleQuiz",
  components: {
    SomethingWrong,
    Quiz,
    ExamModal,
  },
  mixins: [quizViewMixin],
  data() {
    return {
      entityName: "courseModuleId",
      entityRoute: "iu-module-quiz",
      previousQuizAttemptRoute: "iu-module-quiz-attempt",
      getQuizService: getModuleQuizService,
      submitQuizService: submitModuleQuizService,
    };
  },
  mounted() {
    this.init();
  },
};
</script>
