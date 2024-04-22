<template>
  <div
    class="bg-white text-dark-gray previous-attempt-outer rounded-card p-3 p-lg-4"
  >
    <div class="text-center">
      <BreadCrumbs :crumbs="hierarchyTree" />
    </div>
    <h3 class="text-center mt-2">
      {{ $t(`iu.quiz.entityTypeQuizLabel.${entity.type}`) }} -
      {{ entity.hierarchy_name }}
    </h3>
    <hr />
    <div class="d-flex justify-content-center px-4">
      <RadialProgressBar
        :diameter="300"
        :completed-steps="previousAttempt.score"
        :total-steps="100"
        :inner-stroke-color="colors.lightGray"
        start-color="#1982ef"
        stop-color="#1982ef"
        :stroke-width="32"
        :inner-stroke-width="32"
      >
        <h1 class="m-0 mt-2 pt-2 score">
          <span>{{ previousAttempt.score }}</span
          ><span class="percentage">%</span>
        </h1>
        <div class="small">
          {{ updatedAt }}
        </div>
        <div class="small text-uppercase fw-bold">
          {{ correctAnswers }}/{{ previousAttempt.num_of_questions }}
          {{ $t("iu.quiz.correct") }}
        </div>
        <div
          v-if="previousAttempt.has_passed"
          class="passed fw-bold text-uppercase pass-fail"
        >
          {{ $t("iu.quiz.pass") }}
        </div>
        <div v-else class="failed fw-bold text-uppercase pass-fail">
          {{ $t("iu.quiz.fail") }}
        </div>
      </RadialProgressBar>
    </div>
    <hr />
    <div
      v-if="!previousAttempt.has_passed"
      class="d-flex justify-content-center eBookNotification px-4"
    >
      <BookOpenOutline class="me-2 text-success" />
      <span class="mt-1 text-dark-gray font-weight-600">{{
        $t("iu.quiz.ebookEncourage")
      }}</span>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/Misc/BreadCrumbs.vue";
import RadialProgressBar from "vue-radial-progress";
import BookOpenOutline from "vue-material-design-icons/BookOpenBlankVariant";
import { UTCtoLocalDateOnlyFormatted } from "@/utils/dateTimeUtils";

import { mapGetters } from "vuex";

export default {
  components: {
    RadialProgressBar,
    BreadCrumbs,
    BookOpenOutline,
  },
  props: {
    previousAttempt: {
      type: Object,
    },
    hierarchyTree: {
      type: Array,
    },
    entity: {
      type: Object,
    },
  },
  computed: {
    correctAnswers() {
      return parseInt(
        (this.previousAttempt.num_of_questions * this.previousAttempt.score) /
          100
      );
    },
    updatedAt() {
      return UTCtoLocalDateOnlyFormatted(this.previousAttempt.updated_at);
    },
    ...mapGetters({
      colors: "theme/getColors",
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.previous-attempt-outer {
  position: relative;
}
.close-button {
  position: absolute;
  right: 15px;
  top: 15px;
}
.percentage {
  color: $blue;
}
.score {
  font-size: 50px;
}
.pass-fail {
  font-size: 24px;
}
.passed {
  color: $green;
}
.failed {
  color: $red;
}

@media (max-width: $laptopWidth) {
  .eBookNotification {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }
}
</style>
