<template>
  <div>
    <div class="row gap-5">
      <div class="col-12">
        <div class="mt-3 animated-loading-background w-100 p-3 item item-top" />
      </div>
      <div class="col-12">
        <div
          class="mt-3 animated-loading-background w-100 p-3 item item-bottom"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingTicketCreate",
};
</script>

<style lang="scss" scoped>
.item-top {
  border-radius: 25px 25px 25px 25px;
  height: 46px;
}
.item-bottom {
  border-radius: 20px 20px 20px 20px;
  height: 140px;
}
</style>
