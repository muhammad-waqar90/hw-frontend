<template>
  <div>
    <div
      v-for="index in numberOfItems"
      :key="index"
      class="mt-3 text-center item rounded-card cursor-pointer mx-2 my-3 px-3 py-4 animated-loading-background"
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
  height: 134px;
}
</style>
