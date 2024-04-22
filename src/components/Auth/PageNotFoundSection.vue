<template>
  <!--   <div class="w-100">
    <div class="logoHolder w-100 ">
      <div class="d-flex justify-content-center">
        <img
          class="logo"
          src="/img/logo.png"
          alt=""
        >
      </div>
      <div class="d-flex justify-content-center mt-5 position-relative">
        <span class="h1 text-secondary">
          {{ $t("auth.pageNotFound") }}
        </span>
        <span class="notFoundUnderline" />
      </div>
    </div>
    <div class="pageNotFoundBottomGraphics">
      <div class="triangle-left" />
      <div class="triangle-middle" />
      <img
        class="person-image"
        src="/img/person-confused.png"
        alt=""
      >
      <img
        class="plant-image graphics"
        src="/img/plant.png"
        alt=""
      >
      <img
        class="pin-image graphics"
        src="/img/pin.png"
        alt=""
      >
      <img
        class="obstacle-image graphics"
        src="/img/obstacle.png"
        alt=""
      >
    </div>
  </div> -->

  <div class="w-100 height-content">
    <div class="logoHolder w-100">
      <div class="d-flex justify-content-center my-2 my-md-4">
        <img
          class="logo"
          :src="darkMode ? '/img/dark-logo.png' : '/img/logo.png'"
          alt=""
        />
      </div>
    </div>

    <div class="d-flex justify-content-center">
      <span class="h3 p-4 rounded-card text-center color-gray font-weight-700">
        {{ $t("auth.pageNotFound") }}
      </span>
    </div>
    <div class="registerBottomGraphics">
      <div class="triangle-left" />
      <div class="triangle-middle" />
      <img class="half-star" src="/img/halfStar.png" alt="" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "PageNotFoundSection",
  computed: {
    darkMode() {
      return this.theme == "night-mode" ? true : false;
    },
    ...mapGetters({
      theme: "theme/getThemeMode",
    }),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.logoHolder {
  .logo {
    width: 200px;
    height: auto;
  }
}

.height-content {
  height: 50vh;
}

.registerBottomGraphics {
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  background: #f2a000;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;

  .triangle-left {
    z-index: 3;
    width: 0;
    height: 0;
    border-top: 391px solid #e59200;
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
    border-bottom: 178px solid #d48300;
    position: absolute;
    bottom: 0;
    left: 214px;
  }

  .half-star {
    position: absolute;
    left: calc(50% - 150px);
    width: 300px;
    bottom: 0;
    z-index: 4;
  }
}
</style>
