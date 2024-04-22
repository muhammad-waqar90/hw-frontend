<template>
  <div class="position-relative pb-3 pe-2">
    <div
      v-for="index in numberOfItems"
      :key="index"
      class="mt-3 p-3 text-center item rounded-card cursor-pointer animated-loading-background"
    />
  </div>
</template>

<script>
export default {
  props: {
    numberOfItems: {
      type: Number,
      default: 5,
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  height: 112px;
}
</style>
