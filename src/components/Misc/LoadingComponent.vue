<template>
  <div class="container">
    <section
      class="loadingSection shadow col-12 mt-5 mb-0 mx-auto border bg-white row py-4 py-md-5 px-0 position-relative"
    >
      <div class="w-100">
        <div class="logoHolder w-100">
          <div
            class="d-flex flex-column justify-content-center mt-5 col-sm-8 col-md-6 mx-auto text-center"
          >
            <lottie-logo-loader
              path="anims/hw-loader.json"
              :width="150"
              :height="150"
            />
            <span class="h3 text-secondary w-100 mt-3 mt-md-2 text-uppercase">
              {{ loadingText }}
            </span>
          </div>
        </div>
        <div
          class="loadingSectionBottomGraphics"
          :class="{ mainBlueBackground: mode == 'checkout' }"
        >
          <div
            class="triangle-left"
            :class="{ triangleLeftBackground: mode == 'checkout' }"
          />
          <div
            class="triangle-middle"
            :class="{ triangleMiddleBackground: mode == 'checkout' }"
          />
          <CardIcon v-if="mode === 'checkout'" class="card-icon" :size="130" />
          <img
            v-if="mode === 'quiz'"
            class="cog-small"
            src="/img/cog-small.png"
            alt=""
          />
          <img
            v-if="mode === 'quiz'"
            class="cog-large"
            src="/img/cog-large.png"
            alt=""
          />
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import CardIcon from "vue-material-design-icons/CreditCardClock";
import LottieLogoLoader from "lottie-vuejs/src/LottieAnimation.vue";
export default {
  name: "Loading",
  components: {
    CardIcon,
    LottieLogoLoader,
  },
  props: {
    loadingText: {
      type: String,
      default: function () {
        this.$t("general.pageLoading");
      },
    },
    mode: {
      type: String,
      default: "quiz",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

section.loadingSection {
  border-radius: 20px;
  height: 620px;
  font-family: "Montserrat", sans-serif;
  overflow: hidden;
}

.contactPageLink {
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  &:hover {
    color: #313336;
  }
}

.logoHolder {
  height: 155px;
  .logo {
    width: 200px;
    height: auto;
  }
}

.h3 {
  font-weight: 500;
  text-align: center;
  line-height: inherit;
  white-space: nowrap;
}

.mainBlueBackground {
  background: $blue !important;
}

.triangleLeftBackground {
  border-top: 391px solid #1973db !important;
}

.triangleMiddleBackground {
  border-bottom: 178px solid #116fd1 !important;
}

.loadingSectionBottomGraphics {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 214px;
  background: $green;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  .triangle-left {
    z-index: 3;
    width: 0;
    height: 0;
    border-top: 391px solid #41a03f;
    border-right: 422px solid transparent;
    position: absolute;
    top: 0;
    left: 0;
  }

  .triangle-middle {
    width: 0;
    height: 0;
    border-left: 133px solid transparent;
    border-right: 177px solid transparent;
    border-bottom: 178px solid #3f8f3e;
    position: absolute;
    bottom: 0;
    left: 214px;
  }

  .person-image {
    position: absolute;
    left: 26px;
    width: 225px;
    bottom: -7px;
    z-index: 4;
  }

  .circle-image {
    position: absolute;
    left: -91px;
    bottom: -32px;
    z-index: 3;
    width: 410px;
  }

  .cog-large {
    position: absolute;
    right: 11px;
    width: 244px;
    bottom: 20px;
  }

  .cog-small {
    position: absolute;
    right: 196px;
    width: 121px;
    bottom: 20px;
  }

  .card-icon {
    position: absolute;
    right: 50px;
    bottom: 50px;
    color: white;
  }
}

button.resendLink {
  border-radius: 20px;
  font-size: 20px;
  font-weight: 600;
}

.resendLink {
  max-width: 773px;
}

@media (max-width: $tabletWidth) {
  section.loadingSection {
    height: 350px;
  }
  .h3 {
    font-size: 1.4rem;
  }
  .loadingSectionBottomGraphics {
    display: none;
  }
}
</style>
