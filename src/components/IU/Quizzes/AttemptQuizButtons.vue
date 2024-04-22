<template>
  <!-- type == 'module' && !$isPhone ? 'btn-module' : '', -->
  <button
    class="btn text-uppercase truncate font-weight-600"
    :class="[
      btnColor,
      halfRounded === true ? 'half-rounded-pill' : 'rounded-pill',
    ]"
    :disabled="!showStartQuiz"
    @click="onStartQuiz"
  >
    {{ startExamText ? startExamText : $t("iu.lesson.startExam") }}
  </button>
</template>

<script>
import { MIN_PROGRESS_TO_ACCESS_QUIZ } from "@/dataObject/userProgressData";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  mixins: [devicesMixin],
  props: {
    progress: {
      type: Number,
    },
    entityId: {
      type: Number,
    },
    startExamText: null,
    type: null,
    color: null,
    halfRounded: false,
  },
  computed: {
    showStartQuiz() {
      return this.progress >= MIN_PROGRESS_TO_ACCESS_QUIZ;
    },
    btnColor() {
      if (this.color == "green") return "green-btn";
      if (this.color == "blue") return "blue-btn";
      if (this.color == "red") return "red-btn";
      if (this.color == "orange") return "orange-btn";
      if (this.color == "gray") return "gray-btn";
      if (this.color == "light-gray") return "light-gray-btn";

      return "blue-btn";
    },
  },

  methods: {
    onStartQuiz() {
      this.$emit("on-start-quiz", this.entityId);
    },
  },
};
</script>

<style scoped lang="scss">
.half-rounded-pill {
  border-radius: 15px;
}
.btn-module {
  padding: 4px 8px; //TEMPORARY
  margin: 0 !important; //TEMPORARY
  font-size: 0.7rem;
  height: 25px;
}
</style>
