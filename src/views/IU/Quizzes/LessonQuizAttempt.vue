<template>
  <div class="mt-3 px-0">
    <div v-if="loading">
      <LoadingLessonQuizAttempt />
    </div>
    <div v-if="notFound">
      <NotFoundComponent />
    </div>
    <div v-else-if="processing">
      <LoadingComponentModal :loading-text="$t('iu.quiz.evaluatingQuiz')" />
    </div>
    <template v-if="!loading && !quizStarted && !processing">
      <div v-if="mode == 'previousAttempt'" class="mt-3">
        <PreviousLessonQuizAttempt
          :previous-attempt="previousAttempt"
          :hierarchy-tree="hierarchyTree"
          :entity="entity"
          :next-lesson="nextLesson"
          :is-exam-ready="isExamReady"
          :has-module-exam="hasModuleExam"
          :has-ebook="hasEbook"
          :has-purchased-ebook="hasPurchasedEbook"
          @take-quiz="startQuiz"
          @toggle-mode="toggleMode"
          @handle-exam-start="handleExamStart"
          @handle-purchase-ebook="handlePurchaseEbook"
        />
      </div>
      <div v-if="mode == 'instructions'" class="mt-3">
        <LessonQuizInstructions
          class="bg-white rounded-card px-4 py-3"
          :hierarchy-tree="hierarchyTree"
          :entity="entity"
          :quiz-preview="quizPreview"
          :previous-attempt="previousAttempt"
          @take-quiz="startQuiz"
          @toggle-mode="toggleMode"
        />
      </div>
    </template>

    <template v-if="quizStarted">
      <LessonQuiz @stop-quiz="stopQuiz" />
    </template>
  </div>
</template>

<script>
import PreviousLessonQuizAttempt from "@/components/IU/Quizzes/PreviousLessonQuizAttempt";
import NotFoundComponent from "@/components/Misc/NotFoundComponent";
import LessonQuizInstructions from "@/components/IU/Quizzes/LessonQuizInstructions";
import LoadingComponentModal from "@/components/Misc/LoadingComponentModal";
import LessonQuiz from "@/views/IU/Quizzes/LessonQuiz";
import LoadingLessonQuizAttempt from "@/components/IU/Quizzes/LoadingLessonQuizAttempt";

import {
  getPreviousLessonQuizService,
  submitLessonQuizService,
} from "@/services/IU/iuQuizService";

import quizPreviousViewMixin from "@/mixins/IU/quizPreviousViewMixin";

export default {
  components: {
    LoadingComponentModal,
    NotFoundComponent,
    PreviousLessonQuizAttempt,
    LessonQuizInstructions,
    LessonQuiz,
    LoadingLessonQuizAttempt,
  },
  mixins: [quizPreviousViewMixin],
  props: {
    nextLesson: { type: Object },
    isExamReady: { type: Boolean },
    hasModuleExam: { type: Boolean },
    hasEbook: { type: Boolean },
    hasPurchasedEbook: { type: Boolean },
  },
  data() {
    return {
      mode: null,
      quizStarted: false,
      entityName: "lessonId",
      getQuizPreviousService: getPreviousLessonQuizService,
      submitQuizService: submitLessonQuizService,
    };
  },
  computed: {
    isSelected() {
      return this.$route.params.lessonId == this.lesson.id;
    },
  },
  watch: {
    processing() {
      if (this.processing) this.$emit("set-processing", true);
      if (!this.processing) this.$emit("set-processing", false);
    },
  },
  async mounted() {
    await this.init();
    this.checkMode();
  },
  destroyed() {
    if (this.quizStarted) this.submitEmptyQuiz();
    this.stopQuiz(false);
  },
  methods: {
    async submitEmptyQuiz() {
      await this.submitQuizService(
        this.courseId,
        this.entityId,
        JSON.parse(localStorage.getItem("savedQuiz"))
      );
    },
    startQuiz() {
      this.quizStarted = true;
      this.$emit("change-quiz-in-progress", true);
    },
    stopQuiz(reinit = true) {
      this.quizStarted = false;
      this.$emit("change-quiz-in-progress", false);

      if (reinit) this.processing = true;
      this.mode = "previousAttempt";

      if (reinit)
        setTimeout(() => {
          this.init();
          this.$emit("reload-lessons");
        }, 5000);
    },
    checkMode() {
      this.mode = this.previousAttempt ? "previousAttempt" : "instructions";
    },
    toggleMode() {
      if (!this.previousAttempt) return;
      this.mode == "previousAttempt"
        ? (this.mode = "instructions")
        : (this.mode = "previousAttempt");
    },
    handleExamStart() {
      this.$emit("handle-exam-start");
    },
    handlePurchaseEbook() {
      this.$emit("handle-purchase-ebook");
    },
  },
};
</script>
