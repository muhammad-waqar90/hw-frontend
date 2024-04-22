<template>
  <div
    class="alreadyRegistered h-100 px-5 d-flex overflow-hidden font-montserrat font-weight-400 flex-column position-relative"
  >
    <div class="triangle-top-left" />
    <div class="triangle-top-right z-index-2" />
    <div class="text-white position-relative z-index-2 mt-5">
      <img src="/img/enter-icon.png" width="70" alt="" class="ms-2 my-4" />
    </div>
    <div class="h3 mt-2 text-white z-index-2">
      {{ $t("auth.alreadyRegister") }}
    </div>
    <div class="text-white h2 z-index-2">
      {{ $t("auth.loginNow") }}
    </div>
    <router-link to="/login" class="signInButton btn btn-light px-5 py-2 mt-5">
      {{ $t("auth.login") }}
    </router-link>
    <div class="bottom-right-images">
      <img class="whiteRibbon" src="/img/whiteRibbon.png" width="60" alt="" />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.alreadyRegistered {
  border-radius: 20px 0 0 20px;
  overflow: hidden;
  background: $green;
  font-family: "Montserrat", sans-serif;
  .h3 {
    font-size: 2.8rem;
    font-weight: 600;
  }
  .h2 {
    font-weight: 600;
  }
  .signInButton {
    border-radius: 10px;
    font-size: 20px;
    width: 161px;
    white-space: nowrap;
    font-weight: 600;
    z-index: 9999;
  }
}

.triangle-top-left {
  width: 0;
  height: 0;
  border-top: 391px solid #408f3e;
  border-right: 422px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
}

.triangle-top-right {
  width: 0;
  height: 0;
  border-top: 321px solid #41a03f;
  border-left: 410px solid transparent;
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
.circleImg {
  position: absolute;
  right: 0;
  bottom: -51px;
  z-index: 1;
  transform: scale(2);
  width: 200px;
}

@media (max-width: $laptopWidth) {
  .alreadyRegistered {
    .h3 {
      font-size: 2.5rem;
    }
    .h2 {
      font-size: 23px;
    }
  }
}
</style>
