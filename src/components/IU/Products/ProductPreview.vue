<template>
  <section id="product-preview">
    <ProductHead :book="book" />
    <section>
      <AboutContent v-if="mode == 'about'" :prod-desc="book.description" />
    </section>
  </section>
</template>

<script>
import ProductHead from "@/components/IU/Products/ProductHead.vue";
import AboutContent from "@/components/IU/Products/AboutContent.vue";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "ProductPreview",
  components: {
    ProductHead,
    AboutContent,
  },

  mixins: [devicesMixin, toastMixin],

  props: {
    book: {
      type: Object,
    },
  },
  data() {
    return {
      showAddToCartModal: false,
      mode: "about",
    };
  },
  methods: {
    changeMode(mode) {
      this.mode = mode;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/_variables.scss";
#product-preview {
  font-family: "Montserrat", sans-serif;

  .play-circle-outline-icon {
    position: absolute;
    z-index: 100;
    color: $static-white;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .top-90 {
    top: 90px;
  }
}
</style>
