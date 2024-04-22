<template>
  <div
    class="pb-3 d-flex flex-column scrollbar-blue overflow-y-auto outer flex-grow-1 pe-1"
  >
    <template v-if="list?.length == 0 && !loading">
      <div
        class="mt-2 px-2 d-flex align-items-center justify-content-center flex-grow-1"
      >
        <div class="text-center">
          <svg-faq-empty class="empty-faq-icon mb-4" />
          <h4 class="empty-faq-item">
            {{ $t("iu.faqs.noFaqFound") }}
          </h4>
        </div>
      </div>
    </template>
    <template v-else>
      <div
        v-for="item in list"
        :key="item.id"
        class="ps-5 pe-4 mt-3 item rounded-card py-4"
      >
        <div>
          <span class="fw-bold text-capitalize">
            {{ item.category_name }}
          </span>
        </div>

        <span class="fw-bold">
          <span class="question text-capitalize"> {{ item.question }} </span>
        </span>
        <div class="answer mt-2">
          {{ item.short_answer }}
        </div>
        <div class="mt-4">
          <router-link
            class="cursor-pointer subtle-link"
            :to="{ name: faqLink, params: { id: item.id } }"
          >
            <FullAnswer />
          </router-link>
        </div>
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="loadMore"
        :custom-css="observerCustomCss"
      />
      <LoadingFaq v-if="loading" :number-of-items="6" />
    </template>
  </div>
</template>

<script>
import FullAnswer from "@/components/Common/Faqs/Dashboard/FullAnswer";
import LoadingFaq from "@/components/Common/Faqs/Dashboard/LoadingFaq";
import Observer from "@/components/Misc/Observer";
import SvgFaqEmpty from "@/assets/svg/faq-empty.svg";

import userRoleMixin from "@/mixins/User/userRoleMixin";

export default {
  components: {
    FullAnswer,
    Observer,
    LoadingFaq,
    SvgFaqEmpty,
  },
  mixins: [userRoleMixin],
  props: {
    list: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      showObserver: true,
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
    };
  },
  computed: {
    faqLink() {
      return this.$userIsGU ? "gu-faq" : "iu-faq";
    },
  },
  watch: {
    list() {
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
  },
  methods: {
    loadMore() {
      this.showObserver = false;
      this.$emit("load-more");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.question {
  color: $blue;
}

.item {
  background: $lightgray;
}

.answer {
  font-size: 14px;
}

.outer {
  height: calc(100vh - 369px);
}

.empty-faq-icon {
  width: 120px;
  height: 120px;
  pointer-events: none;
}

.empty-faq-item {
  font-weight: 600;
  color: $gray;
}
</style>
