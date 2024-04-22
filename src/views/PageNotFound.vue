<template>
  <div class="container px-0 font-montserrat margin-top-60">
    <div
      class="bg-white rounded-card d-flex justify-content-center align-items-center flex-column px-5 pt-5"
    >
      <h1 class="text-404">404</h1>
      <hr class="w-50 mt-0 mb-5" />
      <h2 class="color-blue font-weight-600">PAGE NOT FOUND</h2>
      <p class="mb-0">
        We're sorry, The Page you requested could not be found.
      </p>
      <p>Go back to home page</p>
      <router-link :to="{ name: 'iu-dashboard' }">
        <button class="btn blue-btn rounded-card btn-text font-weight-600 px-4">
          Go to Home
        </button>
      </router-link>
      <svg-bottom-hijaz-logo class="bottom-svg mt-4" />
    </div>
  </div>
</template>

<script>
import SvgBottomHijazLogo from "@/assets/svg/bottomHijazLogo.svg";
export default {
  name: "PageNotFound",
  components: {
    SvgBottomHijazLogo,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
p {
  font-size: 24;
  font-weight: 600;
  color: #bac7d9;
}
.text-404 {
  font-size: 160px;
  font-weight: 700;
  color: #bac7d9;
}

.color-blue {
  color: $blue;
}

.bottom-svg {
  width: 100%;
  height: 270px;
}

.btn-text {
  font-size: 12px;
}

.margin-top-60 {
  margin-top: 60px;
}
</style>
