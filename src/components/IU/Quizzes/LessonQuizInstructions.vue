<template>
  <div class="py-4" :class="{ 'mob-specific-style': $isPhone }">
    <h3 class="text-dark-gray text-capitalize mt-2 px-4">
      {{ $t("iu.quiz.instructions") }} - {{ entity.hierarchy_name }}
    </h3>
    <div class="px-4 breadcrumbs-font">
      <BreadCrumbs :crumbs="hierarchyTree" :color-hierarchy="true" />
    </div>
    <hr class="mx-4" />
    <ul class="px-4 text-dark-gray no-dots-list">
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
    <hr class="mx-4" />
    <div class="d-flex flex-column flex-md-row justify-content-end mt-4 px-3">
      <template v-if="previousAttempt != null">
        <button
          class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-border-btn rounded-pill font-weight-500 text-uppercase"
          @click="$emit('toggle-mode')"
        >
          {{ $t("iu.quiz.lastAttempt") }}
        </button>
      </template>
      <template v-if="canTakeQuiz">
        <TakeRetakeQuizButton
          class="mx-2"
          :type="entity.type"
          :retake="previousAttempt"
          :remaining-attempts="remainingAttempts"
          @take-quiz="$emit('take-quiz')"
        />
      </template>
      <template v-else>
        <PurchaseExamButtons
          v-if="examDetails"
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
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    TakeRetakeQuizButton,
    BreadCrumbs,
    PurchaseExamButtons,
  },
  mixins: [devicesMixin],
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
      return (
        (!this.examDetails || this.examDetails.user_can_access_exam) &&
        (!this.previousAttempt || !this.previousAttempt?.has_passed)
      );
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
.btn-font {
  font-size: 14px;
}
.breadcrumbs-font {
  font-size: 20px;
}
.no-dots-list {
  list-style-type: none;
}
ul > li {
  margin-bottom: 5px;
}
.mob-specific-style {
  max-height: 80vh;
  overflow-y: scroll;
}
</style>
