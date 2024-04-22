<template>
  <div
    class="faq-list pb-lg-0"
    :class="{
      'pb-1': $isPhone,
    }"
  >
    <div v-if="display404">
      <SomethingWrong />
    </div>
    <div
      v-else
      class="qa-list pb-lg-3"
      :class="{
        'pb-1': $isPhone,
      }"
    >
      <div
        v-if="item.id"
        class="rounded-card pt-3 pb-5 bg-white text-dark-gray px-4"
      >
        <h4>
          {{ $t("iu.faqs.frequentlyAskedQuestions") }}
        </h4>
        <hr />
        <div class="question">
          {{ item.question }}
        </div>
        <div class="mt-3" v-html="item.answer" />
      </div>
      <div v-else>
        <LoadingSpecificFaq />
      </div>
    </div>
  </div>
</template>

<script>
import LoadingSpecificFaq from "@/components/Common/Faqs/Dashboard/LoadingSpecificFaq";
import SomethingWrong from "@/views/SomethingWrong";

import { getFaq as iuGetFaq } from "@/services/IU/iuFaqService";
import { getFaq as guGetFaq } from "@/services/GU/guFaqService";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import userRoleMixin from "@/mixins/User/userRoleMixin";
import metaTagsUpdateMixin from "@/mixins/Misc/metaTagsUpdateMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";

export default {
  name: "Faq",
  components: {
    SomethingWrong,
    LoadingSpecificFaq,
  },
  mixins: [devicesMixin, userRoleMixin, metaTagsUpdateMixin, backButtonMixin],
  data() {
    return {
      item: {},
      display404: false,
    };
  },
  computed: {
    getFaq() {
      return this.$userIsGU ? guGetFaq : iuGetFaq;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const response = await this.getFaq(this.$route.params.id);
      if (response.status === 404) return (this.display404 = true);

      this.item = response;
      this.$updateMeta(this.item.question);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.faq-list {
  padding-bottom: 3px;
}
.qa-list {
  padding-bottom: 5px;
}
.question {
  color: $blue;
  font-size: 16px;
  font-weight: 600;
}
</style>
