<template>
  <article class="font-montserrat rounded-card bg-white mt-3 p-4">
    <div
      class="d-flex justify-content-between"
      :class="$isPhone || $isTablet ? 'pb-2' : 'pb-4'"
    >
      <h4 class="text-dark-gray font-weight-600 mb-0">
        {{ $t("iu.webShop.availableBooks") }}
      </h4>
      <router-link
        v-if="books?.length"
        class="height-25"
        :to="{ name: 'iu-products-available' }"
      >
        <button
          class="btn blue-btn btn-font font-weight-600 rounded-card h-100 px-3 py-0 word-break-normal"
        >
          ALL
        </button>
      </router-link>
    </div>

    <div v-if="loading && books.length == 0" class="py-md-3 mr-1">
      <LoadingProduct />
    </div>

    <section
      v-else-if="books && books.length"
      class="row product-list position-relative scrollbar-blue overflow-auto px-4"
    >
      <div
        v-for="book in books"
        :key="book.id"
        class="px-0 d-flex"
        :class="{
          'col-12 pe-2 mt-2': $isPhone,
          'col-6 pe-3 mt-3': $isTablet,
          'pe-3 col-4 mt-4': !$isPhone && !$isTablet,
        }"
      >
        <ProductCard type="default" :book="book" @add-to-cart="addToCart" />
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="onScrollEnd"
        :custom-css="observerCustomCss"
      />
    </section>
    <section
      v-else-if="books && !books.length"
      class="d-flex flex-column justify-content-center align-items-center px-1 px-md-5 pt-3 pb-2 mb-2"
    >
      <img class="w-75 px-5" src="/img/online_presentation.png" alt="" />
      <h5 class="h5 mt-4 text-dark-gray text-center">
        {{ $t("iu.product.noAvailable") }}
      </h5>
    </section>
  </article>
</template>

<script>
import ProductCard from "@/components/IU/Products/ProductCard.vue";
import LoadingProduct from "@/components/IU/Products/LoadingProduct";
import Observer from "@/components/Misc/Observer";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    ProductCard,
    LoadingProduct,
    Observer,
  },
  mixins: [devicesMixin],
  props: {
    books: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },

  data() {
    return {
      showObserver: true,
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
    };
  },

  watch: {
    books() {
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
  },

  methods: {
    addToCart(book) {
      this.$emit("add-to-cart", book);
    },
    onScrollEnd() {
      this.$emit("on-scroll-end");
      this.showObserver = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.btn-font {
  font-size: 12px;
}
.product-list {
  overflow-y: auto;
  max-height: calc(100vh - 195px);
}
</style>
