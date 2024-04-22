<template>
  <div class="forgotUsernameRightSection h-100 pb-5 px-5 position-relative">
    <div class="triangle-top-left z-index-2" />
    <div class="triangle-top-right" />
    <div class="text-white position-relative z-index-999">
      <div class="text-white position-relative">
        <img src="/img/avatar_logo.png" width="60" alt="" />
      </div>
      <div class="rememberedUsername ms-2 mt-4 text-white">
        {{ $t("auth.rememberedUsername") }}
      </div>
      <router-link
        to="/login"
        class="goToLogginButton btn btn-light ms-2 px-3 py-2 mt-3 mt-lg-5"
      >
        {{ $t("auth.goToLogin") }}
      </router-link>
    </div>
    <div class="bottom-right-images">
      <img class="whiteRibbon" src="/img/whiteRibbon.png" width="60" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ForgotUsernameRightSection",
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.forgotUsernameRightSection {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding-top: 70px;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
  background: $orange;
  font-family: "Montserrat", sans-serif;

  .rememberedUsername {
    font-size: 3rem;
    line-height: 60px;
    font-weight: 600;
  }
  .goToLogginButton {
    border-radius: 10px;
    font-size: 19px;
    font-weight: 600;
    width: 236px;
    white-space: nowrap;
  }
}

.triangle-top-left {
  width: 0;
  height: 0;
  border-top: 391px solid #e59200;
  border-right: 422px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
}

.triangle-top-right {
  width: 0;
  height: 0;
  border-top: 220px solid #d58400;
  border-left: 220px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.z-index-2 {
  z-index: 2;
}

.z-index-999 {
  z-index: 999;
}

.bottom-right-images {
  position: absolute;
  right: 0;
  bottom: 0;
}

.whiteRibbon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 200px;
  z-index: 2;
}

@media (max-width: $tabletWidth) {
  .forgotUsernameRightSection {
    display: none;
    .rememberedUsername {
      font-size: 2.5rem;
    }
  }
}

@media (max-width: $desktopWidth) {
  .forgotUsernameRightSection {
    .rememberedUsername {
      font-size: 2.3rem;
      margin: 10px 0 !important;
    }
  }
}
</style>
