<template>
  <article class="font-montserrat rounded-card bg-white mt-3 p-4">
    <div class="pt-4 px-1">
      <h4 class="font-weight-600 text-dark-gray">
        {{ fullTitle }}
      </h4>
    </div>

    <div v-if="loading && books.length == 0" class="py-md-3">
      <LoadingAvailableBooks :number-of-items="$isMobile ? 1 : 3" />
    </div>

    <section
      v-else-if="books && books.length"
      class="row product-list position-relative scrollbar-blue overflow-auto px-3"
    >
      <div
        v-for="book in books"
        :key="book.id"
        class="col-4 px-0 pe-3 d-flex mt-4"
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
    <div v-if="loading && books.length" class="py-md-3">
      <LoadingAvailableBooks :number-of-items="$isMobile ? 1 : 3" />
    </div>
  </article>
</template>

<script>
import ProductCard from "@/components/IU/Products/ProductCard";
import LoadingAvailableBooks from "@/components/IU/Products/LoadingAvailableBooks";
import Observer from "@/components/Misc/Observer";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    ProductCard,
    LoadingAvailableBooks,
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
    title: {
      type: String,
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

  computed: {
    fullTitle() {
      if (this.title == "available")
        return this.$t("iu.webShop.availableBooks");
      if (this.title == "top") return this.$t("iu.webShop.topBooks");
      return "Courses";
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

.product-list {
  overflow-y: auto;
  height: calc(100vh - 200px);
}
.grid {
  display: grid;
  grid-template-columns: 33.333% 33.333% 33.333%;
  grid-auto-rows: 320px;
  grid-row-gap: 15px;
}
</style>
