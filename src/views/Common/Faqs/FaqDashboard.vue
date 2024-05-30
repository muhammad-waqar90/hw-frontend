<template>
  <div
    class="overflow-hidden position-relative pb-lg-0 faq-dashboard"
    :class="{
      'pb-1': $isPhone && mode != availableModes.INITIAL,
    }"
  >
    <div
      class="row search-root-categories"
      :class="{
        'search-root-categories--inactive': mode != availableModes.INITIAL,
      }"
    >
      <div class="col">
        <SearchWithoutButtons
          v-if="$isDesktop"
          :search-text-prop="searchText"
          :placeholder="$t('iu.faqs.faqSearch')"
          @on-search="handleOnSearch"
        />
        <SearchWithButton
          v-else
          :search-text-prop="searchText"
          :loading="faqListApi.loading"
          @on-search="handleOnSearch"
        />
      </div>
      <div
        class="col-auto flex-shrink-1 px-3 mt-3 mt-lg-0"
        :class="{ 'w-100': $isMobile }"
      >
        <router-link
          :to="{ name: ticketsLink }"
          class="subtle-link contact-support rounded-card px-5 py-2 py-lg-0 d-flex align-items-center cursor-pointer text-uppercase text-white"
        >
          <InformationOutlineIcon :size="25" />
          <span class="ms-2 w-100 text-center">
            {{ $t("iu.faqs.contactSupport") }}
          </span>
        </router-link>
      </div>
    </div>
    <div class="row mt-3 faq-dashboard-body">
      <div
        class="col-12 col-md-4 search-root-categories d-flex"
        :class="{
          'search-root-categories--inactive': mode != availableModes.INITIAL,
        }"
      >
        <FaqRootCategoryList
          :list="rootCategoriesListApi.data"
          :selected-root-category="selectedRootCategory"
          :loading="rootCategoriesListApi.loading"
          @item-selected="selectRootCategory"
        />
      </div>
      <div
        ref="faqResultsList"
        class="col-12 col-md-8 faq-results-outer pb-0"
        :class="{ 'faq-results-outer--active': mode != availableModes.INITIAL }"
      >
        <FaqResults
          :mode="mode"
          :root-category="selectedRootCategory"
          :sub-categories-list="subCategoriesListApi.data"
          :search-text="searchText"
          :faq-list="faqListApi.data"
          :loading-faq-list="faqListApi.loading"
          :loading-subcategories-list="subCategoriesListApi.loading"
          @load-more="handleLoadMore"
        />
      </div>
    </div>
    <template v-if="$isPhone && mode != availableModes.INITIAL && isActive">
      <MobileBackButton @on-back="handleOnBack" />
    </template>
  </div>
</template>

<script>
import MobileBackButton from "@/components/Misc/BackButtons/MobileBackButton";
import FaqResults from "@/components/Common/Faqs/Dashboard/FaqResults";
import FaqRootCategoryList from "@/components/Common/Faqs/Dashboard/FaqRootCategoryList";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton";
import SearchWithoutButtons from "@/components/Misc/Admin/SearchWithoutButtons";

import InformationOutlineIcon from "vue-material-design-icons/InformationOutline";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import userRoleMixin from "@/mixins/User/userRoleMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

import {
  getRootFaqCategoriesList as iuGetRootFaqCategoriesList,
  getSubFaqCategoryList as iuGetSubFaqCategoryList,
  getSearchFaqs as iuGetSearchFaqs,
} from "@/services/IU/iuFaqService";
import {
  getRootFaqCategoriesList as guGetRootFaqCategoriesList,
  getSubFaqCategoryList as guGetSubFaqCategoryList,
  getSearchFaqs as guGetSearchFaqs,
} from "@/services/GU/guFaqService";

import * as availableModes from "@/dataObject/faqs/iuFaqDashboardModes";

export default {
  name: "FaqDashboard",
  components: {
    SearchWithButton,
    SearchWithoutButtons,
    InformationOutlineIcon,
    FaqRootCategoryList,
    FaqResults,
    MobileBackButton,
  },
  mixins: [devicesMixin, userRoleMixin, apiMixin],
  data() {
    return {
      mode: availableModes.INITIAL,
      availableModes,
      selectedRootCategory: {},
      searchText: "",
      isActive: true,
      scrollTop: 0,
      rootCategoriesListApi: getApiState(),
      faqListApi: getApiState(),
      subCategoriesListApi: getApiState(),
    };
  },
  computed: {
    getRootFaqCategoriesList() {
      return this.$userIsGU
        ? guGetRootFaqCategoriesList
        : iuGetRootFaqCategoriesList;
    },
    getSubFaqCategoryList() {
      return this.$userIsGU ? guGetSubFaqCategoryList : iuGetSubFaqCategoryList;
    },
    getSearchFaqs() {
      return this.$userIsGU ? guGetSearchFaqs : iuGetSearchFaqs;
    },
    ticketsLink() {
      return this.$userIsGU ? "gu-tickets" : "iu-ticket-dashboard";
    },
  },
  mounted() {
    this.init();
    this.$refs.faqResultsList.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    this.$refs.faqResultsList.removeEventListener("scroll", this.handleScroll);
  },
  activated() {
    this.isActive = true;
    if (this.$isPhone) this.$refs.faqResultsList.scrollTop = this.scrollTop;

    this.checkPassedSearchParam();
  },
  deactivated() {
    this.isActive = false;
  },
  methods: {
    async init() {
      await this.$fetchApiData(
        this.rootCategoriesListApi,
        () => this.getRootFaqCategoriesList(),
        []
      );
    },
    selectRootCategory(item) {
      this.mode = availableModes.ROOT_CATEGORY;
      this.searchText = "";

      if (item.id == this.selectedRootCategory.id) return;

      this.selectedRootCategory = item;
      this.getSubCategories(item.id);
    },
    async getSubCategories(itemId) {
      this.resetData();
      this.searchText = "";

      await this.$fetchApiData(
        this.subCategoriesListApi,
        () => this.getSubFaqCategoryList(itemId),
        []
      );
    },
    handleOnSearch(searchText) {
      if (!searchText) {
        if (this.mode == availableModes.SEARCH)
          this.mode = availableModes.INITIAL;
        return (this.searchText = "");
      }

      this.searchText = searchText;
      this.mode = availableModes.SEARCH;
      this.searchFaqs();
    },
    async searchFaqs() {
      this.resetData();
      this.selectedRootCategory = {};

      await this.$fetchApiData(
        this.faqListApi,
        () => this.getSearchFaqs(this.searchText),
        []
      );
    },
    handleOnBack() {
      this.mode = availableModes.INITIAL;
      this.selectedRootCategory = {};
      this.resetData();
    },
    resetData() {
      this.subCategoriesListApi = getApiState();
      this.faqListApi = getApiState();
    },
    handleLoadMore() {
      if (this.mode == this.availableModes.ROOT_CATEGORY)
        return this.$fetchNextPageApi(this.subCategoriesListApi);
      if (this.mode == this.availableModes.SEARCH)
        return this.$fetchNextPageApi(this.faqListApi);
    },
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop;
    },
    checkPassedSearchParam() {
      if (this.$route.params.searchText == undefined) return;

      this.handleOnSearch(this.$route.params.searchText);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.faq-dashboard {
  padding-bottom: 4px !important;
  min-height: 100vh;
}
.faq-dashboard-body {
  min-height: 100vh;
}

.contact-support {
  background-color: $orange;
  display: inline-block;
  height: 100%;
}

@media (max-width: $tabletWidth) {
  .search-root-categories {
    transition: transition, 0.3s ease-in-out;
    &.search-root-categories--inactive {
      transform: translateX(-100vw);
      position: absolute;
    }
  }

  .faq-results-outer {
    position: absolute;
    top: 0;
    left: 0;
    transform: translateX(100vw);
    transition: transition, 0.3s ease-in-out;
    min-height: calc(100vh - 145px);
    padding-left: 0px;
    padding-right: 0px;
    &.faq-results-outer--active {
      transform: translateX(0);
    }
  }
}
</style>
