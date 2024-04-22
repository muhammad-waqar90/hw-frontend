<template>
  <ModalTransparent
    :close-on-click-outside="false"
    :hide-header="true"
    :hide-footer="true"
    :hide-close-button="true"
  >
    <div slot="body" class="d-flex">
      <lottie-logo-loader
        path="anims/hw-loader.json"
        :width="150"
        :height="150"
      />
      <div
        v-if="!$isPhone && !$isTablet"
        class="d-flex flex-column justify-content-center align-items-center"
      >
        <h2
          class="text-white font-montserrat text-uppercase font-weight-700 loading-font mb-0"
        >
          {{ loadingText }}
        </h2>
        <hr class="hr-white w-100 mt-0" />
      </div>
    </div>
  </ModalTransparent>
</template>

<script>
import ModalTransparent from "@/components/Misc/ModalTransparent";
import LottieLogoLoader from "lottie-vuejs/src/LottieAnimation.vue";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "LoadingAnimation",
  mixins: [devicesMixin],
  components: {
    ModalTransparent,
    LottieLogoLoader,
  },
  props: {
    loadingText: {
      type: String,
      default: function () {
        this.$t("general.pageLoading");
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.loading-font {
  font-size: 90px;
  letter-spacing: 5px;
}
.hr-white {
  color: $static-white;
  border-width: 2px;
  opacity: 1;
}
</style>
