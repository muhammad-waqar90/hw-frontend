<template>
  <div class="pb-3">
    <hr />
    <template v-if="list.length">
      <div
        v-for="(item, index) in list"
        :key="item.id"
        class="pl-3"
        :class="{ 'ps-3': $isPhone }"
      >
        <div class="title text-capitalize">
          {{ item.question }}
        </div>
        <div class="answer mt-2">
          {{ item.short_answer }}
        </div>
        <div class="mt-3">
          <router-link
            class="cursor-pointer subtle-link d-flex"
            :to="{ name: faqLink, params: { id: item.id } }"
          >
            <FullAnswer />
          </router-link>
        </div>
        <hr v-if="showHr(index)" />
      </div>
    </template>
    <template v-else>
      <div
        class="mt-2 px-2 d-flex align-items-center justify-content-center h-100"
      >
        <div class="text-center">
          <svg-faq-empty class="empty-faq-icon mb-4" />
          <h4 class="empty-faq-item">
            {{ $t("iu.faqs.noFaqFound") }}
          </h4>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import FullAnswer from "@/components/Common/Faqs/Dashboard/FullAnswer";

import userRoleMixin from "@/mixins/User/userRoleMixin";
import SvgFaqEmpty from "@/assets/svg/faq-empty.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    FullAnswer,
    SvgFaqEmpty,
  },
  mixins: [userRoleMixin, devicesMixin],
  props: {
    list: {
      type: Array,
    },
  },
  computed: {
    faqLink() {
      return this.$userIsGU ? "gu-faq" : "iu-faq";
    },
  },
  methods: {
    showHr(index) {
      return index !== this.list.length - 1;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.title {
  color: $blue;
  font-size: 16px;
  font-weight: 600;
}
.answer {
  font-size: 14px;
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
.pl-3 {
  padding-left: 3rem;
}
</style>
