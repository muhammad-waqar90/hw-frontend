<template>
  <div
    :class="[isInQuiz ? 'bg-light-gray h-100' : 'bg-white rounded-card']"
    class="text-center font-montserrat p-3"
  >
    <h3 class="font-weight-600 h4 mb-0 mt-1 color-gray">
      {{ $t("iu.lesson.bookAdvert.level") }}
    </h3>
    <p class="font-weight-600 text-blue mb-1">
      {{ $t("iu.lesson.bookAdvert.author") }}
    </p>
    <img
      :class="[isInQuiz ? 'quiz-max-width' : '']"
      class="col-12"
      src="/img/book-ad-placeholder.png"
      alt=""
    />
    <router-link :to="{ name: 'iu-shop' }">
      <button
        class="btn blue-btn rounded-pill font-weight-600 small-font px-4 my-2"
      >
        {{ $t("iu.lesson.bookAdvert.buy") }}
      </button>
    </router-link>
  </div>
</template>

<script>
export default {
  // todo: need to check that property is required or not.
  props: {
    isInQuiz: false,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.small-font {
  font-size: 12px;
}

.bg-light-gray {
  background-color: $lightgray;
}

.quiz-max-width {
  max-width: 200px;
}
</style>
