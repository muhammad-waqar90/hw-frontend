<template>
  <div class="container mt-3 px-0 px-sm-3">
    <PageBackButton v-if="!processing && !loading" @on-back="$router.go(-1)" />
    <div v-if="notFound">
      <NotFoundComponent />
    </div>
    <div
      v-else-if="processing"
      class="mt-5 text-center d-flex justify-content-center align-items-center"
    >
      <LoadingComponent :loading-text="$t('iu.quiz.evaluatingExam')" />
    </div>
    <template v-if="!loading">
      <div v-if="previousAttempt" class="mt-5">
        <PreviousQuizAttempt
          :previous-attempt="previousAttempt"
          :hierarchy-tree="hierarchyTree"
          :entity="entity"
          @take-quiz="startQuiz"
        />
      </div>
      <div v-if="!alreadyPassed" class="mt-5">
        <QuizInstructions
          :hierarchy-tree="hierarchyTree"
          :entity="entity"
          :quiz-preview="quizPreview"
          :previous-attempt="previousAttempt"
          :exam-details="examDetails"
          @take-quiz="startQuiz"
          @add-to-cart="handleOpenModal"
        />
      </div>
    </template>
    <PurchaseModuleExamBulk
      v-if="modalOpened"
      :course-id="courseId"
      :course-module-id="entityId"
      @close-modal="handleCloseModal"
    />
  </div>
</template>

<script>
import PreviousQuizAttempt from "@/components/IU/Quizzes/PreviousQuizAttempt";
import NotFoundComponent from "@/components/Misc/NotFoundComponent";
import QuizInstructions from "@/components/IU/Quizzes/QuizInstructions";
import LoadingComponent from "@/components/Misc/LoadingComponent.vue";

import { getPreviousModuleQuizService } from "@/services/IU/iuQuizService";

import quizPreviousViewMixin from "@/mixins/IU/quizPreviousViewMixin";
import PageBackButton from "@/components/Misc/BackButtons/PageBackButton";

export default {
  components: {
    LoadingComponent,
    NotFoundComponent,
    PreviousQuizAttempt,
    QuizInstructions,
    PageBackButton,
    PurchaseModuleExamBulk: () =>
      import(
        /* webpackChunkName: "PurchaseModuleExamBulkComponent" */ "@/components/IU/Cart/Exams/PurchaseModuleExamBulk"
      ),
  },
  mixins: [quizPreviousViewMixin],
  data() {
    return {
      entityName: "courseModuleId",
      getQuizPreviousService: getPreviousModuleQuizService,
      modalOpened: false,
      profileStatus: {},
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    startQuiz() {
      //TODO:
      // handleLastMomentExamReloading is used for handeling the quiz restart issue when user hit reload on last moment.
      // Need to seperate flow for GET quiz states and new quiz data.
      // handleLastMomentExamReloading is used in frontend to hold the new quiz data until the previous quiz is not closed.
      localStorage.setItem("handleLastMomentExamReloading", false);

      if (this.profileIncomplete)
        return this.$router.push({
          name: "iu-profile",
          query: { redirectType: "exam", redirectUrl: this.$route.fullPath },
        });

      this.$router.replace({
        name: "iu-module-quiz",
        params: { courseId: this.courseId, courseModuleId: this.entityId },
      });
    },
    handleOpenModal() {
      this.modalOpened = true;
    },
    handleCloseModal() {
      this.modalOpened = false;
    },
  },
};
</script>
