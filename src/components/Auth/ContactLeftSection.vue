<template>
  <div
    class="contactLeftSection h-100 py-5 px-5 d-none d-md-flex justify-content-center flex-column position-relative"
  >
    <div class="triangle-top-left" />
    <div class="triangle-top-right z-index-2" />
    <div class="text-white position-relative z-index-2">
      <img
        src="/img/icon-info.png"
        width="110"
        alt=""
        class="mb-1 contact-icon"
      />
    </div>
    <div class="h3 mt-2 text-white fw-bold z-index-2">
      {{ $t("contact.needHelp") }}
    </div>
    <div class="text-white h4 fw-bold z-index-2">
      {{ $t("contact.contactUs") }}
    </div>
    <div class="bottom-right-images">
      <img class="whiteRibbon" src="/img/whiteRibbon.png" width="60" alt="" />
    </div>
  </div>
</template>

<script>
export default {
  name: "ContactLeft",
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.contactLeftSection {
  border-radius: 20px 0 0 20px;
  overflow: hidden;
  background: #2b82ef;
  font-family: "Montserrat", sans-serif;
  .h3 {
    font-size: 55px;
    letter-spacing: 1px;
  }
  .h4 {
    font-size: 39px;
  }
  .signInButton {
    border-radius: 20px;
    font-size: 20px;
    width: 161px;
    white-space: nowrap;
  }
}

.triangle-top-left {
  width: 0;
  height: 0;
  border-top: 321px solid #2471c8;
  border-right: 347px solid transparent;
  position: absolute;
  top: 0;
  left: 0;
}

.triangle-top-right {
  width: 0;
  height: 0;
  border-top: 321px solid #2778dd;
  border-left: 410px solid transparent;
  position: absolute;
  top: 0;
  right: 0;
}

.whiteRibbon {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 200px;
  z-index: 2;
}

.z-index-2 {
  z-index: 2;
}

.bottom-right-images {
  position: absolute;
  right: 0;
  bottom: 0;
}

.cogsImg {
  position: absolute;
  right: 42px;
  bottom: 68px;
  width: 180px;
  z-index: 2;
}

.circleImg {
  position: absolute;
  right: 142px;
  bottom: -35px;
  z-index: 1;
  transform: scale(2);
  width: 355px;
}

.contact-icon {
  margin-left: -30px;
}

@media (max-width: $desktopWidth) {
  .whiteRibbon {
    width: 160px;
  }
}

@media (max-width: $laptopWidth) {
  .contactLeftSection {
    .h3 {
      font-size: 2.3rem;
    }
    .h4 {
      font-size: 23px;
    }
  }

  .whiteRibbon {
    width: 130px;
  }
}
</style>
