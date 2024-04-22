<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Refunds</h3>
      </div>
      <div v-if="items">
        <table class="table border bg-white">
          <thead class="thead-light">
            <tr>
              <th scope="col">Transaction ID</th>
              <th scope="col">Transaction Item ID</th>
              <th scope="col">Amount</th>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Refunded By</th>
              <th scope="col">Date</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td>{{ item.purchase_item.purchase_history_id }}</td>
              <td>{{ item.purchase_item.id }}</td>
              <td class="price">
                £{{ getDecimalAmount(item.purchase_item.amount) }}
              </td>
              <td>{{ item.purchase_item.entity_name }}</td>
              <td>
                {{ `${paymentText.types[item.purchase_item.entity_type]}` }}
              </td>
              <td>{{ item.admin.name }} ({{ item.admin_profile.email }})</td>
              <td>{{ dateFormat(item.created_at) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
  </section>
</template>

<script>
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import { linksToPath } from "@/utils/urlUtils";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
import { getRefundedItemsList } from "@/services/AF/afRefundService";
import { paymentText } from "@/dataObject/AF/afStaticTextsData.js";
import { getDecimalAmount } from "@/utils/generalUtils";

import toastMixin from "@/mixins/toastMixin";

export default {
  name: "RefundsOverview",
  components: {
    PaginationButtons,
  },
  mixins: [toastMixin],
  data() {
    return {
      items: [],
      links: [],
      page: null,
      paymentText,
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
      this.page = this.$route.query.page;
      this.links = [];

      const response = await getRefundedItemsList(this.page);

      if (response.error) this.$displayError(response);

      this.items = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },
    getDecimalAmount(amount) {
      return getDecimalAmount(amount, 2);
    },
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.price {
  color: $blue;
  font-size: 16px;
  font-weight: bold;
}
</style>
