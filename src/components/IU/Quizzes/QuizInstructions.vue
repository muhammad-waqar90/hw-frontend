<template>
  <div
    v-if="entity"
    class="bg-white text-dark-gray quiz-instructions-outer rounded-card p-3 p-lg-5"
  >
    <div class="text-center">
      <BreadCrumbs :crumbs="hierarchyTree" />
    </div>
    <h3 class="text-center text-capitalize mt-2">
      {{ $t("iu.quiz.instructions") }} - {{ entity.hierarchy_name }}
    </h3>
    <hr />
    <ul class="my-5 px-4 px-md-5">
      <li v-html="getTimeBullet">
        <!-- {{ $t('iu.quiz.instructionsBullets.bulletOne', { duration: quizPreview.duration / 60 }) }} -->
      </li>
      <li>
        <b>{{ translatedExamAccessEntity }}</b>
      </li>
      <li>
        {{
          $t("iu.quiz.instructionsBullets.bulletThree", {
            quizType: entity.type == "lesson" ? "quiz" : "exam",
          })
        }}
      </li>
      <li>
        {{ $t("iu.quiz.instructionsBullets.bulletFour") }}
      </li>
      <li>
        {{
          $t("iu.quiz.instructionsBullets.bulletFive", {
            quizType: entity.type == "lesson" ? "quiz" : "exam",
          })
        }}
      </li>
      <li>
        {{ $t("iu.quiz.instructionsBullets.bulletSix") }}
        <ul>
          <li>
            {{ $t("iu.quiz.instructionsBullets.bulletSixOne") }}
          </li>
          <li>
            {{ $t("iu.quiz.instructionsBullets.bulletSixTwo") }}
          </li>
          <li>
            {{ $t("iu.quiz.instructionsBullets.bulletSixThree") }}
          </li>
          <li>
            {{ $t("iu.quiz.instructionsBullets.bulletSixFour") }}
          </li>
        </ul>
      </li>
    </ul>
    <hr />
    <div class="text-center mt-4">
      <template v-if="canTakeQuiz">
        <TakeRetakeQuizButton
          :type="entity.type"
          :retake="previousAttempt"
          :remaining-attempts="remainingAttempts"
          @take-quiz="$emit('take-quiz')"
        />
      </template>
      <template v-else>
        <PurchaseExamButtons
          :exam-details="examDetails"
          @add-to-cart="addToCart"
        />
      </template>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/Misc/BreadCrumbs";
import TakeRetakeQuizButton from "@/components/IU/Quizzes/TakeRetakeQuizButton";
import PurchaseExamButtons from "@/components/IU/Quizzes/PurchaseExamButtons";

import { roundNumber } from "@/utils/generalUtils";

export default {
  components: {
    TakeRetakeQuizButton,
    BreadCrumbs,
    PurchaseExamButtons,
  },
  props: {
    duration: null,
    hierarchyTree: {
      type: Array,
    },
    entity: {
      type: Object,
    },
    quizPreview: {
      type: Object,
    },
    examDetails: {
      type: Object,
      default: null,
    },
    previousAttempt: null,
  },
  computed: {
    canTakeQuiz() {
      return !this.examDetails || this.examDetails.user_can_access_exam;
    },
    remainingAttempts() {
      return this.examDetails?.user_exam_attempts_left || 0;
    },
    translatedExamAccessEntity() {
      if (this.entity.type == "lesson")
        return this.$t("iu.quiz.instructionsBullets.bulletTwo.free", {
          quizType: "quiz",
        });
      return this.$t("iu.quiz.instructionsBullets.bulletTwo.paid");
    },
    roundNumber() {
      return roundNumber;
    },
    getMinutes() {
      return parseInt(this.quizPreview.duration / 60);
    },
    getSeconds() {
      return parseInt(this.quizPreview.duration - this.getMinutes * 60);
    },
    getTimeBullet() {
      if (this.getSeconds > 0)
        return this.$t("iu.quiz.instructionsBullets.bulletOneSeconds", {
          durationMinutes: this.getMinutes,
          durationSeconds: this.getSeconds,
          quizType: this.entity.type == "lesson" ? "quiz" : "exam",
        });
      else
        return this.$t("iu.quiz.instructionsBullets.bulletOne", {
          duration: this.getMinutes,
          quizType: this.entity.type == "lesson" ? "quiz" : "exam",
        });
    },
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.quiz-instructions-outer {
  position: relative;
}
</style>
