<template>
  <div class="pb-3">
    <div class="mx-1 my-3 row align-items-center p-2 color-gray">
      <div v-if="withRefund" class="text-center col-1 ps-1 pb-2 pb-sm-0" />
      <div
        title="Transaction ID"
        class="text-center text-sm-start col-1 pb-2 pb-sm-0"
      >
        {{ paymentText.transactionId }}
      </div>
      <div
        title="Transaction Item ID"
        class="text-center text-sm-start col-1 pb-2 pb-sm-0"
      >
        {{ paymentText.transactionItemId }}
      </div>
      <div
        class="text-center text-sm-start pb-2 pb-sm-0"
        :class="withRefund ? 'col-2' : 'col-3'"
      >
        {{ paymentText.name }}
      </div>
      <div class="text-center text-sm-center col-2 pb-2 pb-sm-0">
        {{ paymentText.type }}
      </div>
      <div
        class="col-1 text-sm-center text-start price"
        :class="withRefund ? 'col-1' : 'col-2'"
      >
        {{ paymentText.amount }}
      </div>
      <div
        :title="paymentText.paymentType"
        class="col-1 text-sm-center text-start price"
      >
        {{ paymentText.shortPaymentType }}
      </div>
      <div class="col-2 text-center text-sm-center date">
        {{ paymentText.date }}
      </div>
      <div v-if="withRefund" class="col-1 text-center">
        {{ paymentText.status }}
      </div>
    </div>
    <div>
      <div v-for="item in items" :key="item.id" class="mt-3 px-3">
        <PurchaseItem
          :item="item"
          :selected="isSelected(item)"
          :with-refund="withRefund"
          @on-change-item-selection="onChangeItemSelection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseItem from "@/components/AF/Purchases/PurchaseItem.vue";

import devicesMixin from "@/mixins/Misc/devicesMixin";

import { paymentText } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  components: {
    PurchaseItem,
  },
  mixins: [devicesMixin],
  props: {
    items: {
      type: Array,
    },
    selectedItemList: {
      type: Array,
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
        this.selectedItemList?.some(
          (selectedItem) => selectedItem.id === item.id
        );
    },
  },

  methods: {
    onChangeItemSelection(checked, item) {
      this.$emit("on-change-item-selection", checked, item);
    },
  },
};
</script>
