<template>
  <div>
    <div
      :class="{
        'purchase-container scrollbar-blue-white-bg': $isPhone,
      }"
    >
      <div
        class="container font-montserrat"
        :class="{ 'purchase-body': $isPhone }"
      >
        <div class="bg-white rounded-card-top p-4">
          <h5 class="font-weight-600 title ms-2">
            {{ $t("iu.payment.purchases") }}
          </h5>
        </div>
        <!-- <div v-if="(links.length || loading) && list.length" class="mb-3 align-items-center">
      <PaginationButtons :loading="loading" :links="links" />
    </div> -->
        <PurchaseHistoryList :list="list" :loading="loading" />
        <div
          v-if="(links.length || loading) && list.length && !$isPhone"
          class="mb-3 align-items-center"
        >
          <PaginationButtons :loading="loading" :links="links" />
        </div>
      </div>
    </div>
    <div
      v-if="(links.length || loading) && list.length && $isPhone"
      class="mb-3 align-items-center"
    >
      <PaginationButtons :loading="loading" :links="links" />
    </div>
  </div>
</template>

<script>
import PurchaseHistoryList from "@/components/IU/Purchases/PurchaseHistoryList";
import PaginationButtons from "@/components/Misc/PaginationButtons";

import { linksToPath } from "@/utils/urlUtils";
import { getPurchaseHistory } from "@/services/IU/iuPurchaseService";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    PurchaseHistoryList,
    PaginationButtons,
  },
  mixins: [toastMixin, devicesMixin],
  data() {
    return {
      page: null,
      list: [],
      links: [],
      loading: true,
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
      this.loading = true;
      this.page = this.$route.query.page ? this.$route.query.page : null;
      this.list = [];
      const response = await getPurchaseHistory(this.page);

      if (response.error) return this.$displayServerResponse(response);

      this.list = response.data;
      this.links = linksToPath(this.$route.path, response.links);
      this.loading = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.title {
  font-size: 20px;
  color: $darkgray;
}
.purchase-container {
  padding: 0px;
  overflow-x: scroll;
}
.purchase-body {
  width: max-content;
  min-width: 830px;
  margin-bottom: 5px;
  padding: unset;
}
</style>
