<template>
  <div class="pt-2 pb-3">
    <div
      v-if="!list.length && !loading"
      class="rounded-card gray-container text-light-gray py-4"
    >
      <div class="pb-2 mt-4 text-center">
        <CreditCardClockOutline :size="100" />
      </div>
      <h3 class="col-12 pb-1 my-4 text-center">
        {{ paymentText.noPurchases }}
      </h3>
    </div>
    <template v-if="list.length">
      <div class="mx-1 row align-items-center p-2 color-gray">
        <div class="col-1" />
        <div
          title="Transaction Item ID"
          class="text-center text-sm-start col-1 pb-2 pb-sm-0"
        >
          <h5>{{ paymentText.transactionItemId }}</h5>
        </div>
        <div class="text-center text-sm-start col-5 pb-2 pb-sm-0">
          <h5>{{ paymentText.courseName }}</h5>
        </div>
        <div class="text-center text-sm-start col-1 pb-2 pb-sm-0">
          <h5>{{ paymentText.amount }}</h5>
        </div>
        <div class="text-center text-sm-center col-2 pb-2 pb-sm-0">
          <h5>{{ paymentText.paymentType }}</h5>
        </div>
        <!-- <div class="text-center text-sm-center col-2 pb-2 pb-sm-0">
          <h5>{{ paymentText.totalAmount }}</h5>
        </div> -->
        <div class="text-center text-sm-center col-2 pb-2 pb-sm-0">
          <h5>{{ paymentText.numOfPurchases }}</h5>
        </div>
      </div>
      <div v-for="item in list" :key="item.id" class="mt-3">
        <PurchaseHistoryItem
          :item="item"
          :selected-item-list="selectedItemList"
          :selected="isSelected(item)"
          :selected-parent-item-list="selectedParentItemList"
          :with-refund="withRefund"
          @on-change-item-selection="onChangeItemSelection"
          @on-change-parent-item-selection="onChangeParentItemSelection"
        />
      </div>
    </template>
    <template v-if="loading">
      <LoadingPurchaseHistory />
    </template>
  </div>
</template>

<script>
import LoadingPurchaseHistory from "@/components/AF/Purchases/LoadingPurchaseHistory.vue";
import PurchaseHistoryItem from "@/components/AF/Purchases/PurchaseHistoryItem.vue";

import CreditCardClockOutline from "vue-material-design-icons/CreditCardClockOutline";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import { paymentText } from "@/dataObject/AF/afStaticTextsData.js";

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
    selectedItemList: {
      type: Array,
    },
    selectedParentItemList: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
    withRefund: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      paymentText,
    };
  },

  computed: {
    isSelected() {
      return (item) =>
        this.selectedParentItemList?.some(
          (selectedItem) => selectedItem.id === item.id
        );
    },
  },

  methods: {
    onChangeItemSelection(checked, item) {
      this.$emit("on-change-item-selection", checked, item);
    },
    onChangeParentItemSelection(checked, item) {
      this.$emit("on-change-parent-item-selection", checked, item);
    },
  },
};
</script>
