<template>
  <div
    class="navigation-button cursor-pointer text-white rounded-circle position-relative d-flex justify-content-center align-items-center cart-button"
    @click="toggleCart"
  >
    <span>
      <svg-cart class="icon-small text-white" />
    </span>
    <span v-if="cartCount" class="count">
      {{ cartCount }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import SvgCart from "@/assets/svg/cart.svg";

export default {
  components: {
    SvgCart,
  },
  computed: {
    ...mapGetters({
      cartCount: "cart/getNumberOfItems",
      cartActive: "ui/getCartActive",
    }),
  },
  methods: {
    toggleCart() {
      setTimeout(() => {
        this.$store.dispatch("ui/setCartActive", !this.cartActive);
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/shared/navButtons.scss";

.cart-button {
  background: $green;
  line-height: 0;
  .count {
    background-color: #e8505b;
  }
}
</style>
