<template>
  <div class="progress position-relative bg-progress-dark-gray">
    <div
      class="progress-bar rounded-card"
      :class="[barColor]"
      role="progressbar"
      :style="{ width: progress + '%' }"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span class="w-100 position-absolute text-white font-weight-600">
        {{ finishedLessons }}/{{ maxLessons }}
        <span
          class="text-uppercase"
          :class="{ 'd-inline d-lg-none d-xl-inline': hasModuleExam }"
          >Passed</span
        >
      </span>
    </div>
  </div>
</template>

<script>
import { COMPLETED_PROGRESS } from "@/dataObject/userProgressData";

export default {
  props: {
    finishedLessons: 0,
    maxLessons: 0,
    hasModuleExam: Boolean,
  },

  computed: {
    progress() {
      return (100 / this.maxLessons) * this.finishedLessons;
    },
    barColor() {
      return this.progress == COMPLETED_PROGRESS ? "green-bar" : "blue-bar";
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.progress {
  height: 32px;
  border-radius: 20px;

  .progress-bar {
    font-size: 14px;
  }
}

.blue-bar {
  background-color: $blue;
}

.green-bar {
  background-color: $green;
}

.bg-progress-dark-gray {
  background-color: $static-gray;
}
</style>
