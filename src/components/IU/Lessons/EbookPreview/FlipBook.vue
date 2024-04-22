<template>
  <flipbook
    v-if="flipbookPaths.length > 1"
    v-slot="flipbook"
    class="flipbook"
    :pages="flipbookPaths"
    :zooms="[1, 2, 3]"
  >
    <div v-if="showflipbookConrols" class="row justify-content-center">
      <div class="button-container">
        <a
          class="pageflip-button"
          :class="{ 'disabled-link': !flipbook.canFlipLeft }"
        >
          <ChevronLeftCircle
            class="svg-arrow-icons-white"
            :size="20"
            @click="flipbook.flipLeft"
          />
        </a>
        <a
          class="zoom-button"
          :class="{ 'disabled-link': !flipbook.canZoomOut }"
        >
          <MinusCircle
            class="svg-arrow-icons-white"
            :size="20"
            @click="flipbook.zoomOut"
          />
        </a>
        <span class="flipbook-page-controller">
          {{
            $t("iu.lesson.ebookPage", {
              currentPage: flipbook.page,
              totalPages: flipbook.numPages ? flipbook.numPages : "∞",
            })
          }}
        </span>
        <a
          class="zoom-button"
          :class="{ 'disabled-link': !flipbook.canZoomIn }"
        >
          <PlusCircle
            class="svg-arrow-icons-white"
            :size="20"
            @click="flipbook.zoomIn"
          />
        </a>
        <a
          class="pageflip-button"
          :class="{ 'disabled-link': !flipbook.canFlipRight }"
        >
          <ChevronRightCircle
            class="svg-arrow-icons-white"
            :size="20"
            @click="flipbook.flipRight"
          />
        </a>
      </div>
    </div>
  </flipbook>
  <div v-else>
    <div class="d-flex justify-content-center align-items-center h-85">
      <div class="logo-loader">
        <lottie-logo-loader
          class="logo-loader-opacity py-4"
          path="anims/hw-loader.json"
          :width="180"
          :height="180"
        />
      </div>
    </div>
  </div>
</template>
<script>
import Flipbook from "flipbook-vue/vue2";
import ChevronRightCircle from "vue-material-design-icons/ChevronRightCircle";
import ChevronLeftCircle from "vue-material-design-icons/ChevronLeftCircle";
import PlusCircle from "vue-material-design-icons/PlusCircle";
import MinusCircle from "vue-material-design-icons/MinusCircle";
import LottieLogoLoader from "lottie-vuejs/src/LottieAnimation.vue";

export default {
  name: "FlipBook",
  components: {
    Flipbook,
    ChevronRightCircle,
    ChevronLeftCircle,
    PlusCircle,
    MinusCircle,
    LottieLogoLoader,
  },
  props: {
    flipbookData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      showflipbookConrols: true,
      flipbookPaths: [null],
    };
  },
  mounted() {
    if (this.flipbookData?.path)
      this.flipbookPaths = [...this.flipbookPaths, ...this.flipbookData.path];
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.flipbook {
  width: 92vw;
  height: 86vh;
  max-height: 100%;
  max-width: 100%;
  overflow: hidden;
}
::v-deep .bounding-box {
  box-shadow: 0 0 20px #000;
}
// ::v-deep .click-to-flip {
//   display: none !important;
// }
.button-container {
  position: absolute;
  z-index: 99999;
  bottom: 0%;
  margin: auto;
  background: rgba(50, 142, 236, 0.8);
  border-radius: 16px;
  width: fit-content;
  text-align: center;
  padding: 10px;
  opacity: 1;
  color: $static-white;
}
.pageflip-button {
  margin: auto;
  padding: 0px 5px;
}
.zoom-button {
  margin: auto;
  padding: 0px 5px;
}
.flipbook-page-controller {
  padding: 0px 6px 3px 6px;
  border-radius: 8px;
  display: inline-block;
  color: $blue;
  background: $static-white;
  margin: 1px 4px;
}
.h-85 {
  height: 85vh !important;
}
.logo-loader {
  aspect-ratio: 16 / 7.75;
  align-items: center;
  display: flex;
}
.logo-loader-opacity {
  opacity: 0.7;
}
</style>
