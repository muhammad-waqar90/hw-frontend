<template>
  <div class="container bg-white rounded-card-top bottom-border-gray">
    <div class="row pt-3">
      <div class="col-lg-3 px-4 pt-1">
        <img
          :src="book.img ? book.img : getDefaultImage()"
          :class="[$isMobile ? '' : 'cover-img']"
          class="w-100 h-100 rounded-card"
          alt="book Preview Image"
          @error="handleImageError"
        />
      </div>

      <div class="col-lg-9 mb-3 mb-lg-0 g-lg-0">
        <div
          class="d-lg-flex flex-lg-column justify-content-between rounded-card pt-3 pb-5 ps-2 pe-4 mt-3 mt-lg-0 ms-lg-2 h-100"
          :class="{ 'mob-product-title': $isPhone }"
        >
          <div class="row justify-content-between">
            <h4
              class="mt-3 col-lg-9 my-lg-auto text-center text-capitalize text-dark-gray text-lg-start font-weight-600 text-gray"
            >
              {{ book.name }}
            </h4>
            <h4
              v-for="meta in book.productMetas"
              :key="meta.id"
              class="col-lg-12 mt-1 text-center text-dark-gray text-lg-start author-name"
            >
              <span class="text-blue font-weight-600">Author - </span
              ><span class="font-weight-500">{{ meta.meta_value }}</span>
            </h4>
            <div class="row mt-4">
              <span
                class="col-2 font-weight-600 h5 text-primary pt-2"
                :class="{ 'col-6': $isPhone }"
              >
                £{{ formattedPrice }}
              </span>
              <button
                class="col-4 btn blue-btn rounded-pill text-uppercase font-weight-600 mb-2"
                :class="{ 'col-6': $isPhone }"
                @click="onAddToCart(book)"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row mt-5 px-4">
      <div class="col-auto cursor-pointer text-center px-0 me-5 active">
        <h5 class="font-weight-600 mb-1 text-dark-gray">Description</h5>
      </div>
    </div>
  </div>
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";

import { PHYSICAL_PRODUCT } from "@/dataObject/cart/cartItemTypeData";
import { FULL_ROUNDED as fullRounded } from "@/dataObject/video/videoRoundedData";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { getDecimalAmount } from "@/utils/generalUtils";
export default {
  mixins: [devicesMixin, toastMixin],

  props: {
    book: {
      type: Object,
    },
  },
  data() {
    return {
      fullRounded,
      showAddToCartModal: false,
      addToCartBook: {},
    };
  },
  computed: {
    formattedPrice() {
      return getDecimalAmount(this.book?.price, 2);
    },
  },
  methods: {
    onAddToCart(data) {
      this.addToCartBook = data;
      this.showAddToCartModal = true;
      this.handleAddToCart(this.addToCartBook);
    },
    handleAddToCart(book) {
      this.showAddToCartModal = false;

      const data = { ...book, type: PHYSICAL_PRODUCT };

      this.$store.dispatch("cart/addItem", data);

      this.addToCartBook = {};
    },
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.active {
  border-bottom: 6px solid $blue;
}

.bottom-border-gray {
  border-bottom: 1px solid #d1d5db;
}

.author-name {
  font-size: 16px;
}
.cover-img {
  object-fit: cover;
  height: 120px;
}
.mob-product-title {
  padding-right: 0px !important;
}
</style>
