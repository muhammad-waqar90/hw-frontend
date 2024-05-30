<template>
  <div class="container bg-white rounded-card-top bottom-border-gray">
    <div class="row pt-3 pb-3">
      <div class="col-md-2" :class="{ 'px-3': !$isTablet }">
        <img
          :src="book.img ? book.img : getDefaultImage()"
          class="w-100 rounded-card cover-img"
          alt="book Preview Image"
          @error="handleImageError"
        />
      </div>

      <div class="col-md-10" :class="{ 'p-4': $isPhone }">
        <div class="h-100" :class="{ 'mob-product-title': $isPhone }">
          <div
            class="d-md-flex flex-md-column rounded-card justify-content-center h-100"
          >
            <h4
              class="col-lg-12 text-capitalize text-dark-gray text-start font-weight-600 text-gray"
              :class="{ 'fs-5': $isMobile && !$isPhone }"
            >
              {{ book.name }}
            </h4>
            <h4
              v-for="meta in book.productMetas"
              :key="meta.id"
              class="col-lg-12 mt-1 text-dark-gray text-start author-name"
            >
              <span class="text-blue font-weight-600">Author - </span
              ><span class="font-weight-500">{{ meta.meta_value }}</span>
            </h4>
            <div class="row mt-3">
              <span
                class="col-3 font-weight-600 h5 text-primary pt-2"
                :class="{ 'col-5': $isPhone, 'col-4': $isTablet }"
              >
                £{{ formattedPrice }}
              </span>
              <button
                class="col-5 btn blue-btn rounded-pill text-uppercase font-weight-600 mb-2"
                :class="{ 'col-5': $isPhone }"
                @click="onAddToCart(book)"
              >
                Add to cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row px-4">
      <div class="col-auto cursor-pointer text-start px-0 me-5 active">
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
  aspect-ratio: 1;
}
.mob-product-title {
  padding-right: 0px !important;
}
</style>
