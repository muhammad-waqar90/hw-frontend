<template>
  <div class="row">
    <div
      v-if="!displayMini"
      class="col-4 text-dark-gray text-center text-height"
    >
      {{ leftModeText }}
    </div>
    <div
      :class="[displayMini ? 'col-12' : 'col-4 px-0']"
      :style="btnStyle"
      class="cursor-pointer"
      @click="handleToggle"
    >
      <div class="toggle-wrapper position-relative d-flex transition-1">
        <div
          :class="[toggle ? 'toggle-left' : 'toggle-right']"
          class="toggle-circle transition-time"
        />
      </div>
    </div>
    <div
      v-if="!displayMini"
      class="col-4 text-dark-gray text-center text-height"
    >
      {{ rightModeText }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    displayMini: {
      type: Boolean,
    },
    btnStyle: {
      type: Object,
    },
    toggle: {
      type: Boolean,
    },
    leftModeText: {
      type: String,
    },
    rightModeText: {
      type: String,
    },
  },

  methods: {
    handleToggle() {
      this.$emit("toggle");
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.toggle-wrapper {
  height: 1.5rem;
  background-color: $lightgray;
  border-radius: 15px;
  padding: 0.225rem 0;
}

.toggle-circle {
  width: 16px;
  height: 16px;
  border-radius: 100%;
  background-color: $blue;
}

.transition-time {
  transition: 0.5s;
}

.toggle-left {
  position: absolute;
  left: 0.25rem;
}
.toggle-right {
  position: absolute;
  left: calc(100% - 1.25rem);
}
.text-height {
  height: 24px;
}
</style>
