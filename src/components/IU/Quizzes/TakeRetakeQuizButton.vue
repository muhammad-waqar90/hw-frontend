<template>
  <button
    v-if="retake"
    class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-btn rounded-pill font-weight-500 text-uppercase"
    @click="$emit('take-quiz')"
  >
    {{ $t("iu.quiz.retake") }} {{ translatedEntity }}
    {{
      type == "lesson" || remainingAttempts == 0
        ? ""
        : `[${$t("iu.quiz.remainingAttempts")} ${remainingAttempts}]`
    }}
  </button>
  <button
    v-else-if="type == 'lesson'"
    class="btn btn-font px-5 py-1 my-2 my-lg-0 mx-2 blue-btn rounded-pill font-weight-500 text-uppercase"
    @click="$emit('take-quiz')"
  >
    {{ $t("iu.quiz.take") }} {{ translatedEntity }}
  </button>
  <button
    v-else
    class="btn blue-btn text-white rounded-pill px-5 text-uppercase"
    @click="$emit('take-quiz')"
  >
    {{ $t("iu.quiz.take") }} {{ translatedEntity }}
    {{
      remainingAttempts == 0
        ? ""
        : `[${$t("iu.quiz.remainingAttempts")} ${remainingAttempts}]`
    }}
  </button>
</template>

<script>
export default {
  props: {
    type: String,
    retake: false,
    remainingAttempts: Number,
  },
  computed: {
    translatedEntity() {
      if (this.type == "lesson") return this.$t("iu.quiz.quiz");
      if (this.type == "course_module") return this.$t("iu.quiz.moduleExam");
      return this.$t("iu.quiz.levelExam");
    },
  },
};
</script>

<style lang="scss" scoped>
.btn-font {
  font-size: 14px;
}
</style>
