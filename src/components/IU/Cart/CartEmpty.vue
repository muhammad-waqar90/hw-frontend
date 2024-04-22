<template>
  <div>
    <div class="rounded-card gray-container text-light-gray my-4 py-4">
      <div class="pb-2 mt-4 text-center">
        <svg-cart-store class="cart-icon" />
      </div>
      <h3 class="col-12 pb-1 my-4 text-center">
        {{ $t("iu.cart.empty") }}
      </h3>
    </div>
  </div>
</template>

<script>
import SvgCartStore from "@/assets/svg/cart-store.svg";
export default {
  components: {
    SvgCartStore,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.gray-container {
  background-color: $lightgray;
  color: $darkgray;
}
.cart-icon {
  width: 80px;
}
</style>
