<template>
  <div class="bg-blue rounded-card p-4">
    <div class="row">
      <div class="col">
        <input
          v-model="faqSearch"
          type="text"
          :placeholder="$t('iu.lesson.faqsPlaceholder')"
          class="faq-input"
          @keyup.enter="getFaqs"
        />
      </div>
      <div class="col-12 col-sm-auto">
        <button
          class="btn white-btn rounded-pill font-weight-600 text-uppercase w-100 mt-2 mt-sm-0 px-2 px-lg-4"
          @click="getFaqs"
        >
          {{ $t("iu.lesson.submit") }}
        </button>
      </div>
    </div>

    <div v-if="faqsLoading" class="row">
      <div class="col-12">
        <div
          class="faq-loading-item rounded-card animated-loading-background mt-3"
        />
      </div>
    </div>

    <div v-if="faqs" class="row">
      <div class="col-12">
        <div
          v-for="faq in faqs"
          :key="faq.id"
          class="bg-white color-gray rounded-card p-4 mt-3"
        >
          <div class="row">
            <div class="col-12">
              <p class="faq-category mb-1">
                {{ faq.categoryName }}
              </p>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <h5 class="text-blue">
                {{ faq.question }}
              </h5>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <p>{{ faq.short_answer }}</p>
              <router-link
                class="cursor-pointer subtle-link"
                :to="{ name: 'iu-faq', params: { id: faq.id } }"
              >
                <FullAnswer />
              </router-link>
            </div>
          </div>
        </div>

        <div class="bg-white color-gray rounded-card p-4 mt-3">
          <div class="row">
            <div class="col-12">
              <h5 class="text-blue">
                {{ $t("iu.lesson.faqsNotFound") }}
              </h5>
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <button
                class="btn blue-btn w-100 text-uppercase rounded-pill mt-3"
                @click="$router.push({ name: 'iu-ticket-dashboard' })"
              >
                {{ $t("iu.lesson.askSupport") }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FullAnswer from "@/components/Common/Faqs/Dashboard/FullAnswer";

import { getSearchFaqs } from "@/services/IU/iuFaqService";

export default {
  components: { FullAnswer },

  data() {
    return {
      faqs: null,
      faqSearch: null,
      faqsLoading: false,
    };
  },

  methods: {
    async getFaqs() {
      this.faqs = null;
      if (this.faqSearch == "") return;
      this.faqsLoading = true;

      const response = await getSearchFaqs(this.faqSearch);
      if (response.error) return this.handleLessonErr(response);

      this.faqs = response.data;

      this.faqsLoading = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.bg-blue {
  background-color: $blue;
  color: $white;
}

.faq-input {
  height: 38px;
  width: 100%;
  border-radius: 25px;
  background-color: $bg-darkgray;
  color: $white;
  border: 1px solid $white;
  padding: 0 25px;

  &:focus {
    outline: 0;
  }

  &::placeholder {
    color: $white;
  }

  &:-ms-input-placeholder {
    color: $white;
  }

  &::-ms-input-placeholder {
    color: $white;
  }
}

.faq-loading-item {
  height: 168px;
}

.faq-category {
  font-size: 11px;
}
</style>
