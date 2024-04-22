<template>
  <section class="container mt-3 px-0 px-sm-3">
    <template v-if="display404">
      <SomethingWrong />
    </template>
    <portal to="out-of-app-content" v-else-if="!loading">
      <ExamModal
        :hide-footer="true"
        :hide-header="true"
        :close-on-click-outside="false"
        :hide-close-button="true"
      >
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
/* import LoadingComponent from "@/components/Misc/LoadingComponent.vue"; */
import quizViewMixin from "@/mixins/IU/quizViewMixin";
import {
  getLevelQuizService,
  submitLevelQuizService,
} from "@/services/IU/iuQuizService";
import ExamModal from "@/components/Misc/ExamModal";

export default {
  name: "CourseLevelQuiz",
  components: {
    /* LoadingComponent, */
    SomethingWrong,
    Quiz,
    ExamModal,
  },
  mixins: [quizViewMixin],
  data() {
    return {
      entityName: "courseLevelId",
      entityRoute: "iu-level-quiz",
      previousQuizAttemptRoute: "iu-level-quiz-attempt",
      getQuizService: getLevelQuizService,
      submitQuizService: submitLevelQuizService,
    };
  },
  mounted() {
    this.init();
  },
};
</script>
