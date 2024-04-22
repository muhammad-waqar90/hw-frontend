<template>
  <div>
    <div
      v-for="index in numberOfItems"
      :key="index"
      class="mt-3 text-center item rounded-card cursor-pointer py-2 animated-loading-background"
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
.item {
  height: 42px;
}
</style>
