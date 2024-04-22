<template>
  <div class="container bg-white rounded-card-top bottom-border-gray pt-3">
    <div class="row">
      <div class="col-lg-3 px-4 pt-1">
        <img
          :src="course.img ? course.img : getDefaultImage()"
          class="w-100 rounded-card cover-img"
          alt="Course Preview Image"
          @error="handleImageError"
        />
      </div>

      <div class="col-lg-9 mb-3 mb-lg-0 g-lg-0">
        <div
          class="d-lg-flex flex-lg-column rounded-card pt-3 pb-3 ps-2 pb-lg-0 pe-4 mt-3 mt-lg-0 ms-lg-2 h-100"
        >
          <div class="row justify-content-between">
            <h4
              class="mt-3 col-lg-12 my-lg-auto text-capitalize text-dark-gray text-lg-start font-weight-700 text-gray"
              :class="{ 'text-center': !$isPhone }"
            >
              {{ course.name }}
              <hr v-if="!isPreview" class="mb-0 mt-2" />
            </h4>
          </div>
          <div v-if="isPreview" class="mt-4">
            <s v-if="showStrikeThroughPrice" class="text-muted mt-4">
              £{{ formattedPrice }}
            </s>
            <div class="row">
              <span
                v-if="!course.is_discounted"
                class="col-2 font-weight-600 h5 text-primary pt-2"
                :class="{ 'col-6': $isPhone }"
                >£{{ formattedPrice }}
              </span>
              <span
                v-else
                class="col-2 font-weight-600 h5 text-primary pt-2"
                :class="{ 'col-6': $isPhone }"
              >
                £{{ formattedAmount }}
              </span>
              <button
                class="col-3 btn blue-btn btn-font rounded-pill text-uppercase font-weight-600"
                :class="{ 'col-6': $isPhone }"
                @click="onAddToCart"
              >
                {{ $t("iu.course.enrollNow") }}
              </button>
            </div>
          </div>
          <div v-else class="mt-4">
            <ProgressBar
              :progress="progress"
              :big-bar="true"
              :custom-text="$t('iu.course.progressBarText')"
              :small-text="$isPhone ? true : false"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="px-4"
      :class="$isPhone ? 'd-flex overflow-auto pb-2 mt-2' : 'row mt-5 '"
    >
      <div
        v-if="isPreview"
        class="col-auto cursor-pointer text-center px-0 me-5"
        :class="{ active: mode == 'about' }"
        @click="handleModeChange('about')"
      >
        <h5 class="font-weight-600 mb-1 text-dark-gray">
          {{ $t("iu.course.about") }}
        </h5>
      </div>
      <div
        v-if="isPreview"
        class="col-auto cursor-pointer text-center px-0 me-5"
        :class="{ active: mode == 'content' }"
        @click="handleModeChange('content')"
      >
        <h5 class="font-weight-600 mb-1 text-dark-gray">
          {{ $t("iu.course.courseOverview") }}
        </h5>
      </div>

      <div
        v-if="!isPreview"
        class="col-auto cursor-pointer text-center px-0 me-5"
        :class="{ active: mode == 'content' }"
        @click="handleModeChange('content')"
      >
        <h5 class="font-weight-600 mb-1 text-dark-gray">
          {{ $t("iu.course.courseOverview") }}
        </h5>
      </div>
      <div
        v-if="!isPreview"
        class="col-auto cursor-pointer text-center px-0 me-5"
        :class="{ active: mode == 'about' }"
        @click="handleModeChange('about')"
      >
        <h5 class="font-weight-600 mb-1 text-dark-gray">
          {{ $t("iu.course.about") }}
        </h5>
      </div>
      <div
        v-if="course.has_level_1_ebook"
        class="col-auto cursor-pointer text-center px-0"
        :class="{ active: mode == 'ebook' }"
        @click="handleModeChange('ebook')"
      >
        <h5 class="font-weight-600 mb-1 text-dark-gray">
          {{ $t("iu.course.ebook") }}
        </h5>
      </div>
    </div>

    <portal to="out-of-app-content">
      <Modal
        v-if="showAddToCartModal"
        :hide-footer="true"
        :hide-header="true"
        :close-on-click-outside="false"
        @close-modal="handleAddToCart(addToCartCourse)"
      >
        <template slot="body">
          <AddEbooksToCart
            :level-value="1"
            :course-id="addToCartCourse.id"
            :select-all="true"
            @on-added="(e) => handleAddToCart(addToCartCourse, e)"
            @on-cancel="handleAddToCart(addToCartCourse)"
          />
        </template>
      </Modal>
    </portal>
  </div>
</template>

<script>
import ProgressBar from "@/components/Misc/ProgressBar";
import Modal from "@/components/Misc/Modal";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import { getDecimalAmount } from "@/utils/generalUtils";
import { calculateSalaryScaleDiscount } from "@/utils/courseUtils";
import { mapGetters } from "vuex";

import { CART_COURSE, CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";
import { FULL_ROUNDED as fullRounded } from "@/dataObject/video/videoRoundedData";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
export default {
  components: {
    ProgressBar,
    Modal,
    AddEbooksToCart,
  },

  mixins: [devicesMixin, toastMixin],

  props: {
    course: {
      type: Object,
    },

    progress: {
      type: Number,
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    mode: {
      type: String,
    },
  },
  data() {
    return {
      fullRounded,
      showAddToCartModal: false,
      addToCartCourse: {},
    };
  },
  computed: {
    formattedPrice() {
      return getDecimalAmount(this.course?.price, 2);
    },
    formattedAmount() {
      return getDecimalAmount(this.calculateDiscount, 2);
    },
    showStrikeThroughPrice() {
      return (
        this.course?.is_discounted &&
        this.discountPercentage &&
        this.course?.price !== 0
      );
    },
    ...mapGetters({
      discountPercentage: "user/getDiscountPercentage",
    }),
    calculateDiscount() {
      return calculateSalaryScaleDiscount(
        this.course?.price,
        this.discountPercentage
      );
    },
  },
  methods: {
    onAddToCart() {
      if (!this.course.has_level_1_ebook)
        return this.handleAddToCart(this.course);

      this.addToCartCourse = this.course;
      this.showAddToCartModal = true;
    },
    handleAddToCart(course, ebooks = null) {
      this.showAddToCartModal = false;

      const data = { ...course, type: CART_COURSE };
      if (ebooks)
        data.items = ebooks.map((item) => {
          item.type = CART_EBOOK;
          return item;
        });

      this.$store.dispatch("cart/addItem", data);

      this.addToCartCourse = {};
    },
    handleModeChange(mode) {
      this.$emit("change-mode", mode);
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

.cover-img {
  object-fit: cover;
  height: 120px;
}

.btn-font {
  font-size: 13px;
}
</style>
