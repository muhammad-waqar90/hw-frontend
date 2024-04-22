<template>
  <div class="bg-blue rounded-card p-4">
    <div class="row">
      <div class="col">
        <input
          v-model="faqSearch"
          type="text"
          :placeholder="$t('iu.lesson.faqsPlaceholder')"
          class="faq-input"
        />
      </div>
      <div class="col-12 col-sm-auto">
        <button
          class="btn white-btn rounded-pill font-weight-600 text-uppercase w-100 mt-2 mt-sm-0 px-2 px-lg-4"
          @click="
            $router.push({
              name: 'iu-faq-dashboard',
              params: { searchText: faqSearch },
            })
          "
        >
          {{ $t("iu.lesson.submit") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      faqSearch: "",
    };
  },

  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.bg-blue {
  background-color: $blue;
  color: $static-white;
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
