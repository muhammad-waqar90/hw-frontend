<template>
  <section>
    <CommonProducts
      class="mb-4"
      :books="topProductsApi.data"
      :loading="topProductsApi.loading"
      title="top"
      @add-to-cart="onAddToCart"
      @on-scroll-end="loadMore"
    />
  </section>
</template>

<script>
import CommonProducts from "@/components/IU/Products/CommonProducts";

import { getTopProductsService } from "@/services/iuService";

import apiMixin, { getApiState } from "@/mixins/apiMixin";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";

import { PHYSICAL_PRODUCT } from "@/dataObject/cart/cartItemTypeData";

export default {
  name: "ProductsAvailable",

  components: {
    CommonProducts,
  },

  mixins: [toastMixin, devicesMixin, apiMixin, backButtonMixin],

  data() {
    return {
      topProductsApi: getApiState([]),

      addToCartBook: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(
        this.topProductsApi,
        () => getTopProductsService(),
        []
      );
    },
    onAddToCart(data) {
      this.addToCartBook = data;
      this.handleAddToCart(data);
    },
    handleAddToCart(book) {
      const data = { ...book, type: PHYSICAL_PRODUCT };

      this.$store.dispatch("cart/addItem", data);

      this.addToCartBook = {};
    },
    loadMore() {
      this.$fetchNextPageApi(this.topProductsApi);
    },
  },
};
</script>
