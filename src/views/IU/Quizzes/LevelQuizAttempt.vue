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
      <LoadingComponent :loading-text="$t('iu.quiz.evaluatingQuiz')" />
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
          :exam-details="examDetails"
          :previous-attempt="previousAttempt"
          @take-quiz="startQuiz"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </template>
  </div>
</template>

<script>
import PageBackButton from "@/components/Misc/BackButtons/PageBackButton";
import PreviousQuizAttempt from "@/components/IU/Quizzes/PreviousQuizAttempt";
import LoadingComponent from "@/components/Misc/LoadingComponent.vue";
import NotFoundComponent from "@/components/Misc/NotFoundComponent";
import QuizInstructions from "@/components/IU/Quizzes/QuizInstructions";

import { getPreviousLevelQuizService } from "@/services/IU/iuQuizService";

import quizPreviousViewMixin from "@/mixins/IU/quizPreviousViewMixin";

import { CART_EXAM } from "@/dataObject/cart/cartItemTypeData";

export default {
  components: {
    LoadingComponent,
    NotFoundComponent,
    PreviousQuizAttempt,
    QuizInstructions,
    PageBackButton,
  },
  mixins: [quizPreviousViewMixin],
  data() {
    return {
      entityName: "courseLevelId",
      getQuizPreviousService: getPreviousLevelQuizService,
      hasProfileCompleted: false,
      profileStatus: {},
    };
  },
  async mounted() {
    this.init();
  },
  methods: {
    startQuiz() {
      if (this.profileIncomplete)
        return this.$router.push({
          name: "iu-profile",
          query: { redirectType: "exam", redirectUrl: this.$route.fullPath },
        });

      this.$router.replace({
        name: "iu-level-quiz",
        params: { courseId: this.courseId, courseLevelId: this.entityId },
      });
    },
    handleAddToCart() {
      const data = {
        id: this.quizPreview.id,
        name: `${this.entity.parent.hierarchy_name} -  ${this.entity.hierarchy_name}`,
        price: this.examDetails.price,
        type: CART_EXAM,
      };
      this.$store.dispatch("cart/addItem", data);
      this.$store.dispatch("cart/addRedirectToExamId", {
        courseId: this.courseId,
        courseLevelId: this.entityId,
      });
    },
  },
};
</script>
