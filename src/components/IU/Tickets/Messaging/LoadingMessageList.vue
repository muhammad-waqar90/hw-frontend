<template>
  <div>
    <div v-for="index in numberOfItems" :key="index" class="row">
      <div class="col-7">
        <div
          class="mt-3 animated-loading-background w-100 p-3 item item-left"
        />
      </div>
      <div class="col-5" />
      <div class="col-5" />
      <div class="col-7">
        <div
          class="mt-3 animated-loading-background w-100 p-3 item item-right"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    numberOfItems: {
      type: Number,
      default: 3,
    },
  },
};
</script>

<style lang="scss" scoped>
.item {
  height: 56px;
}
.item-left {
  border-radius: 0px 20px 20px 20px;
}
.item-right {
  border-radius: 20px 0px 20px 20px;
}
</style>
