<template>
  <div
    class="rounded-card text-dark-gray py-4 bg-white px-4 w-100 faq-results-list"
  >
    <div>
      <h4 class="color-gray">
        {{ $t("iu.faqs.frequentlyAskedQuestions") }}
      </h4>
      <hr />
    </div>
    <div ref="faqResultsList">
      <template v-if="mode == availableModes.INITIAL">
        {{ $t("iu.faqs.initialDesc") }}
      </template>
      <template v-if="mode == availableModes.ROOT_CATEGORY">
        <h5 class="root-category-name text-capitalize">
          {{ rootCategory.name }}
        </h5>
        <div>
          <SubCategoriesList
            :list="subCategoriesList"
            :loading="loadingSubcategoriesList"
            @load-more="loadMore"
          />
        </div>
      </template>
      <template v-if="mode == availableModes.SEARCH">
        <h5>
          {{ $t("iu.faqs.resultsForKeyword") }}:
          <span class="keyword"> {{ searchText }}</span>
        </h5>
        <FaqList
          :list="faqList"
          :loading="loadingFaqList"
          @load-more="loadMore"
        />
      </template>
    </div>
  </div>
</template>

<script>
import FaqList from "@/components/Common/Faqs/Dashboard/FaqList";
import SubCategoriesList from "@/components/Common/Faqs/Dashboard/SubCategoriesList";
import * as availableModes from "@/dataObject/faqs/iuFaqDashboardModes";

export default {
  components: {
    SubCategoriesList,
    FaqList,
  },
  props: {
    mode: {
      type: String,
    },
    rootCategory: {
      type: Object,
    },
    subCategoriesList: {
      type: Array,
    },
    searchText: {
      type: String,
    },
    faqList: {
      type: Array,
    },
    loadingFaqList: {
      type: Boolean,
    },
    loadingSubcategoriesList: {
      type: Boolean,
    },
  },
  data() {
    return {
      availableModes,
      scrollTop: 0,
    };
  },
  mounted() {
    this.init();
  },
  activated() {
    this.$refs.faqResultsList.scrollTop = this.scrollTop;
  },
  beforeDestroy() {
    this.$refs.faqResultsList.removeEventListener("scroll", this.handleScroll);
  },
  methods: {
    init() {
      this.$refs.faqResultsList.addEventListener("scroll", this.handleScroll);
    },
    loadMore() {
      this.$emit("load-more");
    },
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.root-category-name,
.keyword {
  color: $blue;
}
.faq-results-list {
  min-height: 100vh;
}
</style>
