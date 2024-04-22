<template>
  <article class="font-montserrat rounded-card bg-white py-3">
    <div class="d-flex justify-content-between pt-3 pb-md-2 mb-2">
      <h4 class="text-dark-gray font-weight-600 mb-0 px-3 px-md-4">
        {{ $t("iu.webShop.topBooks") }}
      </h4>
      <router-link v-if="books?.length" :to="{ name: 'iu-products-top' }">
        <button
          class="btn blue-btn btn-font font-weight-600 rounded-card h-100 px-3 py-0 mx-4"
        >
          ALL
        </button>
      </router-link>
    </div>
    <section class="position-relative pt-md-2 pb-2 py-2">
      <div v-if="loading" class="px-3">
        <LoadingAvailableBooks :number-of-items="$isMobile ? 1 : 3" />
      </div>
      <Carousel
        v-else-if="books && books.length"
        :items="$isMobile ? 1 : 3"
        :stage-padding="25"
        :dots="false"
        :nav="false"
        :mouse-drag="false"
        class="px-2"
      >
        <template slot="prev">
          <div class="nav-btn shadow-sm prev">
            <ChevronLeftIcon :size="35" />
          </div>
        </template>

        <div v-for="book in books" :key="book.id" class="pe-3">
          <ProductCard type="default" :book="book" @add-to-cart="addToCart" />
        </div>
        <template slot="next">
          <div v-if="books.length > 3" class="nav-btn shadow-sm next">
            <ChevronRightIcon :size="35" />
          </div>
        </template>
      </Carousel>
      <div
        v-else-if="books && !books.length"
        class="d-flex flex-column justify-content-center align-items-center px-1 px-md-5 mb-2"
      >
        <img class="w-75 px-5" src="/img/online_presentation.png" alt="" />
        <h5 class="h5 mt-4 text-dark-gray text-center">
          No top books available yet
        </h5>
      </div>
    </section>
  </article>
</template>

<script>
import ProductCard from "@/components/IU/Products/ProductCard.vue";
import Carousel from "vue-owl-carousel";
import ChevronRightIcon from "vue-material-design-icons/ChevronRight";
import ChevronLeftIcon from "vue-material-design-icons/ChevronLeft";
import LoadingAvailableBooks from "@/components/IU/Products/LoadingAvailableBooks";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "TopBooks",

  components: {
    ProductCard,
    Carousel,
    ChevronRightIcon,
    ChevronLeftIcon,
    LoadingAvailableBooks,
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
  methods: {
    addToCart(book) {
      this.$emit("add-to-cart", book);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.nav-btn {
  position: absolute;
  z-index: 100;
  background-color: $orange;
  color: $static-white;
  border-radius: 10px;
  cursor: pointer;
}

.btn-font {
  font-size: 12px;
}

.prev {
  top: 40%;
  left: 10px;
}

.next {
  top: 40%;
  right: 10px;
}

.inner-shadow-right {
  box-shadow: inset -40px 0 40px $black;
}
</style>
