<template>
  <div class="pb-4 light-bg rounded-card-bottom">
    <div
      v-if="!list.length && !loading"
      class="rounded-card gray-container text-light-gray py-4"
    >
      <div class="pb-2 mt-4 text-center">
        <CreditCardClockOutline :size="100" />
      </div>
      <h3 class="col-12 pb-1 my-4 text-center">
        {{ $t("iu.payment.noPurchases") }}
      </h3>
    </div>
    <template v-if="list.length">
      <div class="row g-0 align-items-center p-2 px-4 bg-blue text-white">
        <div class="text-center col-2">
          <h5 class="mb-0 header-font font-weight-600">
            {{ $t("iu.payment.transactionId") }}
          </h5>
        </div>
        <div class="text-center text-sm-center col-2">
          <h5 class="mb-0 header-font font-weight-600">
            {{ $t("iu.payment.numOfItems") }}
          </h5>
        </div>
        <div class="col-2 text-center price">
          <h5 class="mb-0 header-font font-weight-600">
            {{ $t("iu.payment.amount") }}
          </h5>
        </div>
        <div class="col-2 text-center price">
          <h5 class="mb-0 header-font font-weight-600">
            {{ $t("iu.payment.paymentType") }}
          </h5>
        </div>
        <div class="col-2 text-center date">
          <h5 class="mb-0 header-font font-weight-600">
            {{ $t("iu.payment.date") }}
          </h5>
        </div>
      </div>
      <div v-for="item in list" :key="item.id" class="mt-4 px-4">
        <PurchaseHistoryItem :item="item" />
      </div>
    </template>
    <template v-if="loading">
      <LoadingPurchaseHistory />
    </template>
  </div>
</template>

<script>
import LoadingPurchaseHistory from "@/components/IU/Purchases/LoadingPurchaseHistory";
import PurchaseHistoryItem from "@/components/IU/Purchases/PurchaseHistoryItem.vue";

import CreditCardClockOutline from "vue-material-design-icons/CreditCardClockOutline";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    LoadingPurchaseHistory,
    PurchaseHistoryItem,
    CreditCardClockOutline,
  },
  mixins: [devicesMixin],
  props: {
    list: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.light-bg {
  background-color: $lightgray;
}

.bg-blue {
  background-color: $blue;
}

.header-font {
  font-size: 14px;
}
</style>
