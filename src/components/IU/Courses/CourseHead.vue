<template>
  <div class="container bg-white rounded-card-top bottom-border-gray">
    <div
      v-if="videoOptionsExist"
      class="row rounded-card-top position-relative overflow-hidden"
    >
      <video-player
        :options="videoOptions"
        :rounded="roundedTop"
        :custom-controls="true"
      />

      <div
        class="col-12 z-index-1 position-absolute bottom-0 start-0 background-gradient"
        :class="{
          'px-3': $isPhone,
          'p-2': !$isPhone,
        }"
      >
        <div
          class="d-lg-flex flex-lg-column rounded-card h-100"
          :class="{
            'h6 pe-2 mb-0': $isPhone,
            'px-2 pb-lg-0 mt-lg-0': !$isPhone,
          }"
        >
          <div class="row justify-content-between">
            <h4
              class="col-lg-12 text-capitalize text-white text-lg-start"
              :class="{
                'h6 mb-0 font-weight-600': $isPhone,
                'my-lg-auto mt-3 font-weight-700': !$isPhone,
              }"
            >
              {{ course.name }}
              <!-- <hr v-if="!isPreview" class="mb-0 mt-2" /> -->
            </h4>
          </div>
          <div v-if="isPreview" class="mt-2">
            <s
              v-if="showStrikeThroughPrice"
              class="text-white"
              :class="{
                'mt-1': $isPhone,
                'mt-2': !$isPhone,
              }"
            >
              £{{ formattedPrice }}
            </s>
            <div class="row">
              <span
                v-if="!course.is_discounted"
                class="font-weight-600 h5 text-primary"
                :class="{
                  'col-sm-3 col-4': $isPhone,
                  'col-2': !$isPhone,
                }"
                >£{{ formattedPrice }}
              </span>
              <span
                v-else
                class="font-weight-600 h4 text-primary pt-2"
                :class="{
                  'col-sm-3 col-4': $isPhone,
                  'col-2': !$isPhone,
                }"
              >
                £{{ formattedAmount }}
              </span>
              <button
                class="btn blue-btn h4 rounded-pill text-uppercase font-weight-600"
                :class="{
                  'col-sm-5 col-6': $isPhone,
                  'col-3': !$isPhone,
                }"
                @click="onAddToCart"
              >
                {{ $t("iu.course.enrollNow") }}
              </button>
            </div>
          </div>
          <div
            v-else
            class=""
            :class="{
              'my-1': $isPhone,
              'my-2': !$isPhone,
            }"
          >
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

    <div v-else class="row pt-3 pb-3">
      <div class="col-md-2" :class="{ 'px-3': !$isTablet }">
        <img
          :src="course.img ? course.img : getDefaultImage()"
          class="w-100 rounded-card cover-img"
          alt="Course Preview Image"
          @error="handleImageError"
        />
      </div>

      <div class="col-md-10" :class="{ 'p-4': $isPhone }">
        <div
          class="d-md-flex flex-md-column rounded-card justify-content-center h-100"
        >
          <div class="row justify-content-between">
            <h4
              class="col-lg-12 text-capitalize text-dark-gray text-start font-weight-700 text-gray"
              :class="{ 'fs-6': $isMobile && !$isPhone, 'mb-4': isPreview }"
            >
              {{ course.name }}
              <hr v-if="!isPreview" class="my-3" />
            </h4>
          </div>
          <div v-if="isPreview">
            <s v-if="showStrikeThroughPrice" class="text-muted mt-4">
              £{{ formattedPrice }}
            </s>
            <div class="row">
              <span
                v-if="!course.is_discounted"
                class="col-3 font-weight-600 h5 text-primary pt-2"
                :class="{ 'col-5': $isPhone, 'col-4': $isTablet }"
                >£{{ formattedPrice }}
              </span>
              <span
                v-else
                class="col-3 font-weight-600 h5 text-primary pt-2"
                :class="{ 'col-5': $isPhone, 'col-4': $isTablet }"
              >
                £{{ formattedAmount }}
              </span>
              <button
                class="col-4 btn blue-btn btn-font rounded-pill text-uppercase font-weight-600"
                :class="{ 'col-5': $isPhone }"
                @click="onAddToCart"
              >
                {{ $t("iu.course.enrollNow") }}
              </button>
            </div>
          </div>
          <div v-else>
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
      :class="$isPhone ? 'd-flex overflow-auto pb-2 mt-2' : 'row mt-3 '"
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
import VideoPlayer from "@/components/Common/VideoPlayer/VideoJs/VideoPlayer.vue";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import { getDecimalAmount } from "@/utils/generalUtils";
import { calculateSalaryScaleDiscount } from "@/utils/courseUtils";
import { mapGetters } from "vuex";

import { CART_COURSE, CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";
// import { FULL_ROUNDED as fullRounded } from "@/dataObject/video/videoRoundedData";
import { TOP_ROUNDED as roundedTop } from "@/dataObject/video/videoRoundedData";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { checkLink, getFileExtension } from "@/utils/urlUtils.js";
export default {
  components: {
    ProgressBar,
    Modal,
    AddEbooksToCart,
    VideoPlayer,
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
      // fullRounded,
      roundedTop,
      showAddToCartModal: false,
      addToCartCourse: {},
      videoPreview: this.course?.video_preview
        ? this.course?.video_preview
        : "",
      videoOptions: {
        autoplay: true,
        controls: true,
        fluid: true,
        aspectRatio: "16:9",
        controlBar: false,
        bigPlayButton: false,
        userActions: {
          doubleClick: false,
        },
        sources: [],
      },
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
    videoOptionsExist() {
      return this.videoPreview && this.videoOptions?.sources[0]?.src;
    },
  },
  created() {
    this.videoPreview && this.checkSrc();
  },
  methods: {
    async checkSrc() {
      const srcValid = await checkLink(this.videoPreview);
      const videoType = getFileExtension(this.videoPreview);
      if ((videoType == "mp4" || videoType == "m3u8") && srcValid) {
        this.videoOptions.sources = [
          {
            withCredentials: true,
            src: this.videoPreview,
            type: `${
              videoType == "mp4"
                ? `video/${videoType}`
                : `application/x-mpegURL`
            }`,
          },
        ];
      } else this.videoPreview = "";
    },
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
  aspect-ratio: 1;
}
.btn-font {
  font-size: 13px;
}
.z-index-1 {
  z-index: 1;
}
.background-gradient {
  background-image: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0),
    rgba(4, 4, 4, 1)
  );
}
</style>
