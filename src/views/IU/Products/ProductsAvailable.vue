<template>
  <section>
    <CommonProducts
      class="mb-4"
      :books="availableProductsApi.data"
      :loading="availableProductsApi.loading"
      title="available"
      @add-to-cart="onAddToCart"
      @on-scroll-end="loadMore"
    />
  </section>
</template>

<script>
import CommonProducts from "@/components/IU/Products/CommonProducts";

import { getAvailableProductsService } from "@/services/iuService";

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
      availableProductsApi: getApiState([]),

      addToCartBook: {},
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(
        this.availableProductsApi,
        () => getAvailableProductsService(),
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
      this.$fetchNextPageApi(this.availableProductsApi);
    },
  },
};
</script>
