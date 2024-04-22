<template>
  <portal to="out-of-app-content">
    <div class="outer bg-white px-3">
      <div class="d-flex justify-content-between align-items-center">
        <div @click="onBack">
          <ChevronLeftIcon :size="55" />
        </div>
        <slot name="buttons" />
      </div>
    </div>
  </portal>
</template>

<script>
import ChevronLeftIcon from "vue-material-design-icons/ChevronLeft";

export default {
  components: {
    ChevronLeftIcon,
  },
  methods: {
    onBack() {
      this.$emit("on-back");
    },
  },
};
</script>

<style lang="scss" scoped>
.outer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 55px;
}
</style>
