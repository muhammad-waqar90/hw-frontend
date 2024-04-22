<template>
  <section class="background-texture--gradient">
    <div class="background-texture app-content">
      <Cart v-if="renderCart" />
      <div
        id="gu-layout"
        :class="{
          'container mt-3 px-3': !$route.meta.independentLayout,
          'container-fluid px-0': $route.meta.independentLayout,
        }"
      >
        <slot />
      </div>
    </div>
  </section>
</template>

<script>
import Cart from "@/components/IU/Cart/Cart.vue";

import { mapGetters } from "vuex";

export default {
  name: "GuLayout",
  components: {
    Cart,
  },
  data() {
    return {
      renderCart: false,
      closingCart: null,
    };
  },
  computed: {
    ...mapGetters({
      cartActive: "ui/getCartActive",
    }),
  },
  watch: {
    cartActive(newVal) {
      if (this.closingCart) clearTimeout(this.closingCart);

      if (newVal) return (this.renderCart = newVal);

      this.closingCart = setTimeout(() => {
        this.renderCart = newVal;
      }, 1000);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.checkCart();
      this.saveGuestCart();
    },
    checkCart() {
      const cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart || !cart.timestamp) return;

      const diffInHours = (new Date().getTime() - cart.timestamp) / 3600000;
      if (diffInHours > 2) return localStorage.removeItem("cart");

      this.$store.dispatch("cart/setList", cart.items);
    },
    saveGuestCart() {
      if (this.$route.query.cartId) {
        localStorage.setItem("guestCartId", this.$route.query.cartId);
      }
    },
  },
};
</script>
