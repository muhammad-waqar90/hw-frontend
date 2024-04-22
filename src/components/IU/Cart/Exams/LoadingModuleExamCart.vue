<template>
  <div class="row">
    <div class="col-6">
      <div class="d-flex align-items-center justify-content-center h-100">
        <div class="w-100 item rounded-card py-2 animated-loading-background" />
      </div>
    </div>
    <div class="col-6">
      <div
        v-for="index in numberOfItems"
        :key="index"
        class="mt-3 text-center item rounded-card cursor-pointer py-2 animated-loading-background"
      />
    </div>
    <div class="col-12 mt-5">
      <div
        class="w-50 mx-auto item rounded-card cursor-pointer py-2 animated-loading-background"
      />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    numberOfItems: {
      type: Number,
      default: 6,
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  height: 40px;
}
</style>
