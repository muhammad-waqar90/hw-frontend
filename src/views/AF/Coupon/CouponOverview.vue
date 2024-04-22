<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Coupons</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by code'"
            @on-search="handleSearch"
          />
        </div>
        <RouteLinkButton to="af-coupons-create" lable="Create" />
      </div>
      <div v-if="couponApi.data">
        <CouponTable :items="couponApi.data" />
      </div>
      <div v-if="couponApi.meta?.links">
        <PaginationButtons :links="couponApi.meta.links" />
      </div>
    </article>
  </section>
</template>

<script>
import CouponTable from "@/components/AF/Coupon/CouponTable.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import RouteLinkButton from "@/components/Misc/Buttons/RouteLinkButton.vue";
import toastMixin from "@/mixins/toastMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

import { getCouponList } from "@/services/AF/afCouponService";

export default {
  name: "CouponOverview",
  components: {
    CouponTable,
    SearchWithButton,
    PaginationButtons,
    RouteLinkButton,
  },
  mixins: [toastMixin, apiMixin],

  data() {
    return {
      page: null,
      searchText: "",
      couponApi: getApiState(),
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.page = this.$route.query.page ? this.$route.query.page : null;
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";

      await this.$fetchApiData(this.couponApi, () =>
        getCouponList(this.searchText, this.page)
      );
    },
    handleSearch(searchText) {
      if (searchText == this.searchText) return;
      this.searchText = searchText;
      this.handleRouteChange();
    },
    async handleRouteChange() {
      const query = {};
      if (this.searchText) query.searchText = this.searchText;

      this.$router.replace({
        query,
      });
    },
  },
};
</script>
