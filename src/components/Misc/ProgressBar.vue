<template>
  <div
    :class="[
      { 'very-big-progress': veryBigBar },
      { 'big-progress': bigBar && !veryBigBar },
    ]"
    class="progress position-relative bg-progress-dark-gray"
  >
    <div
      class="progress-bar rounded-card"
      :class="[
        whiteBar ? 'white-bar' : progress < 100 ? 'blue-bar' : 'green-bar',
      ]"
      role="progressbar"
      :style="{ width: progress + '%' }"
      :aria-valuenow="progress"
      aria-valuemin="0"
      aria-valuemax="100"
    >
      <span
        :class="[
          smallText ? 'small-text' : '',
          { 'text-green': color == 'green' },
          { 'text-red': color == 'red' },
          { 'text-white': color == null },
          { 'big-font': veryBigBar },
        ]"
        class="w-100 position-absolute"
      >
        {{ text }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    progress: 0,
    bigBar: false,
    veryBigBar: false,
    customText: { type: String, default: "" },
    smallText: false,
    color: null,
    whiteBar: false,
  },
  computed: {
    text() {
      let progressPercentage =
        (this.progress ? this.progress.toString() : "0") + "%";
      return this.customText + " " + progressPercentage;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.progress {
  height: 22px;
  border-radius: 20px;

  .progress-bar {
    font-size: 14px;
  }
}

.big-progress {
  height: 28px;
  border-radius: 20px;

  .progress-bar {
    font-size: 16px;
  }
}

.very-big-progress {
  height: 36px;
  border-radius: 20px;

  .progress-bar {
    font-size: 20px;
  }
}

.small-text {
  font-size: 12px;
}

.big-font {
  font-weight: 600;
}

.blue-bar {
  color: $blue;
}
.green-bar {
  background-color: $green;
}
.white-bar {
  background-color: $white;
}

.text-green {
  color: $green;
}

.text-red {
  color: $red;
}

.bg-progress-dark-gray {
  background-color: $static-gray;
}
</style>
