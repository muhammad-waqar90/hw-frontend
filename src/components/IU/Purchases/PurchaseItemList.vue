<template>
  <div>
    <div
      class="bg-blue row g-0 px-4 header-font font-weight-600 align-items-center text-white"
      :class="$isPhone ? ' py-1' : 'py-2'"
    >
      <div class="text-start col-2">
        {{ $t("iu.payment.transactionItemId") }}
      </div>
      <div class="text-start col-4">
        {{ $t("iu.payment.name") }}
      </div>
      <div class="text-start col-2">
        {{ $t("iu.payment.type") }}
      </div>
      <div class="col-2 text-start price">
        {{ $t("iu.payment.amount") }}
      </div>
      <div class="col-2 text-center date ps-4">
        {{ $t("iu.payment.status") }}
      </div>
    </div>
    <div>
      <div
        v-for="item in items.purchaseItems"
        :key="item.id"
        class="mt-4 mb-3 px-3"
      >
        <PurchaseItem
          :item="item"
          :transaction-id="item.id"
          :shipping-details="items.shippingDetails"
          :currency-symbol="currencySymbol"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseItem from "@/components/IU/Purchases/PurchaseItem.vue";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    PurchaseItem,
  },
  mixins: [devicesMixin],
  data() {
    return {
      list: [],
    };
  },
  props: {
    items: {
      type: Object,
    },
    currencySymbol: {
      type: String,
      default: "",
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.bg-blue {
  background-color: $blue;
}
.header-font {
  font-size: 14px;
}
</style>
