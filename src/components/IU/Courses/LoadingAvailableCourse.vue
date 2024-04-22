<template>
  <div class="row mx-2">
    <div
      v-for="index in numberOfItems"
      :key="index"
      class="item col rounded-card animated-loading-background d-flex justify-content-center mb-2 mx-2"
    />
  </div>
</template>

<script>
export default {
  props: {
    numberOfItems: {
      type: Number,
      default: 10,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item {
  height: 350px;
}

@media (max-width: $tabletWidth) {
  .item {
    height: 473px;
  }
}
</style>
