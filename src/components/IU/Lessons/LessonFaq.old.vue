<template>
  <div
    class="faqs scrollbar-blue mt-3 px-3 px-lg-0"
    :class="faqs ? '' : 'text-center'"
  >
    <span v-if="faqs != null" v-html="faqs" />
    <span v-else class="font-weight-600 color-gray">{{
      $t("iu.lesson.noFaqs")
    }}</span>

    <div class="mt-4 text-center">
      <h4 class="message font-weight-600">
        <span>{{ helpMessage }}</span>
      </h4>
      <router-link :to="{ name: 'iu-faq-dashboard' }">
        <button
          class="btn blue-btn rounded-pill text-uppercase font-weight-600 px-4"
        >
          {{ $t("iu.faqs.contactSupport") }}
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonFaq",
  props: {
    faqs: {
      type: String,
      default: null,
    },
  },
  computed: {
    helpMessage() {
      return this.faqs === null
        ? this.$t("iu.lesson.needHelp")
        : this.$t("iu.lesson.moreHelp");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.faqs {
  font-family: "Montserrat";
  height: 200px;
  overflow-y: auto;
}
@media (max-width: $laptopWidth) {
  .faqs {
    height: auto;
  }
}
.message {
  font-size: 18px;
  color: $blue;
}
</style>
