<template>
  <div
    class="col-12 d-flex flex-column justify-content-between book-advert bg-white rounded-card p-3"
    :class="{ 'h-auto': $isPhone || $isTablet }"
  >
    <div class="row">
      <div class="col-12">
        <h2 class="font-weight-600 text-center h4 mb-0 mt-1 color-gray">
          {{ $t("iu.lesson.bookAdvert.level") }}
        </h2>

        <p class="font-weight-600 text-center text-blue mb-1">
          {{ $t("iu.lesson.bookAdvert.author") }}
        </p>
      </div>
    </div>

    <div class="row">
      <div class="col-12">
        <div class="col-lg-10 col-xl-9 col-xxl-8 mx-auto">
          <img class="w-100" src="/img/book-ad-placeholder.png" alt="" />
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-12 text-center">
        <router-link :to="{ name: 'iu-shop' }">
          <button
            class="btn blue-btn rounded-pill book-btn font-weight-600 text-uppercase my-2"
          >
            {{ $t("iu.lesson.bookAdvert.buy") }}
          </button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  mixins: [devicesMixin],
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

p {
  font-size: 18px;
}

.book-advert {
  height: 470px;
}

.book-btn {
  font-size: 12px;
}
</style>
