<template>
  <div
    class="signupFormSection h-100 px-5 d-flex justify-content-center overflow-hidden font-montserrat font-weight-400 flex-column position-relative"
  >
    <div class="triangle-top-left z-index-2" />
    <div class="triangle-top-right" />
    <div class="text-white position-relative z-index-2">
      <img src="/img/avatar_logo.png" width="60" alt="" />
    </div>
    <div class="newHere font-weight-600 z-index-2 mt-2 text-white">
      {{ $t("auth.registerNow") }}
    </div>
    <div class="text-white z-index-2 h2 font-weight-600">
      {{ $t("auth.signUpFor") }}
      <span class="text-warning z-index-2">
        {{ $t("auth.free") }}
      </span>
    </div>
    <router-link
      to="/register"
      class="signupButton btn btn-light rounded-card font-weight-600 py-1 mt-5 d-flex justify-content-center"
    >
      {{ $t("auth.signUp") }}
    </router-link>
    <div class="bottom-right-images">
      <img class="whiteRibbon" src="/img/whiteRibbon.png" width="60" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginRightSection",
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.signupFormSection {
  border-radius: 0 20px 20px 0;
  background: #2b82ef;

  .newHere {
    font-size: 3.5rem;
  }
  .signupButton {
    font-size: 20px;
    width: 161px;
    border-radius: 10px;
  }
}

.triangle-top-left {
  width: 0;
  height: 0;
  border-top: 391px solid #2778dd;
  border-right: 422px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
}

.triangle-top-right {
  width: 0;
  height: 0;
  border-top: 220px solid #2471c8;
  border-left: 220px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.z-index-2 {
  z-index: 2;
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

@media (max-width: $laptopWidth) {
  .signupFormSection {
    .newHere {
      font-size: 2.5rem;
    }
    .h2 {
      font-size: 23px !important;
    }
  }
}
</style>
