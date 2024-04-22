<template>
  <div class="rounded-card w-100 py-4 bg-white text-dark-gray px-4">
    <div>
      <h4 class="color-gray">
        {{ $t("iu.faqs.faqCategories") }}
      </h4>
      <hr />
    </div>
    <div
      v-if="!loading && list && list.length"
      class="mt-2 px-2 category-list scrollbar-blue"
    >
      <div
        v-for="item in list"
        :key="item.id"
        class="mt-3 color-gray text-center item rounded-card cursor-pointer py-2 px-3 text-capitalize"
        :class="{
          'item--active':
            selectedRootCategory && item.id == selectedRootCategory.id,
        }"
        @click="onItemSelect(item)"
      >
        {{ item.name }}
      </div>
    </div>
    <div
      v-else-if="!loading && list && !list.length"
      class="mt-2 px-2 d-flex align-items-center justify-content-center h-100 pb-5"
    >
      <div class="text-center">
        <svg-faq-empty class="empty-faq-icon mb-4" />
        <h4 class="empty-faq-item">
          {{ $t("iu.faqs.noFaqFound") }}
        </h4>
      </div>
    </div>
    <LoadingCategories v-else-if="loading" class="mt-3 py-1 px-2" />
  </div>
</template>

<script>
import LoadingCategories from "@/components/Common/Faqs/Dashboard/LoadingCategories.vue";
import SvgFaqEmpty from "@/assets/svg/faq-empty.svg";
export default {
  components: {
    LoadingCategories,
    SvgFaqEmpty,
  },
  props: {
    list: {
      type: Array,
    },
    selectedRootCategory: {
      type: Object,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onItemSelect(item) {
      this.$emit("item-selected", item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item {
  background: $lightgray;
  font-size: 18px;
  font-weight: 600;
  &.item--active {
    background: $blue;
    color: $static-white;
  }
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

@media (min-width: $tabletWidth) {
  .category-list {
    overflow-y: auto;
    max-height: calc(100vh - 377px);
  }
}

@media (min-width: $laptopWidth) {
  .category-list {
    overflow-y: auto;
    max-height: calc(100vh - 350px);
  }
}
</style>
