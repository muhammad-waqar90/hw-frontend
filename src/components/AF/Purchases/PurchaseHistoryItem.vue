<template>
  <div class="mx-1 rounded-card shadow-sm item pt-3">
    <div
      class="mx-1 row align-items-center p-2 color-gray"
      :class="checked && 'bg-primary text-white rounded-card'"
    >
      <div class="text-start text-sm-start col-1 pb-2 pb-sm-0">
        <span class="pe-3 separator">
          <input
            v-model="checked"
            type="checkbox"
            :class="cursor"
            class="cursor-pointer"
            :title="checkboxTitle"
            :disabled="!canRefund"
            :value="item.id"
            @change="onChangeParentItemSelection(item)"
          />
        </span>
        <span
          v-if="hasPurchaseItems"
          class="cursor-pointer pe-2"
          @click="toggleExpanded"
        >
          <template v-if="!expanded">
            <ChevronRightIcon :size="25" />
          </template>
          <template v-else>
            <ChevronDownIcon :size="25" />
          </template>
        </span>
      </div>
      <div class="text-center text-sm-start col-1 pb-2 pb-sm-0">
        {{ item.id }}
      </div>
      <div class="text-center text-sm-start col-5 pb-2 pb-sm-0">
        {{ item.name }}
      </div>
      <div class="text-center text-sm-start col-1 pb-2 pb-sm-0">
        {{ item.currency_symbol }}{{ getDecimalAmount(item.amount) }}
      </div>
      <!-- <div class="text-center text-sm-center col-2 pb-2 pb-sm-0">
        £{{ getDecimalAmount(item.totalAmount) }}
      </div> -->
      <div class="text-center text-sm-center col-2 pb-2 pb-sm-0">
        {{ item.entity_type }}
      </div>
      <div class="text-center text-sm-center col-2 pb-2 pb-sm-0">
        {{ purchaseItemsCount }}
      </div>
    </div>
    <div v-show="expanded">
      <hr />
      <div class="px-3">
        <PurchaseItemList
          :items="item.purchaseItems"
          :selected-item-list="selectedItemList"
          :with-refund="withRefund"
          @on-change-item-selection="onChangeItemSelection"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseItemList from "@/components/AF/Purchases/PurchaseItemList.vue";
import { STRIPE } from "@/dataObject/paymentGatewayData.js";
import * as availableStatuses from "@/dataObject/purchases/purchaseItemStatusData";

import ChevronRightIcon from "vue-material-design-icons/ChevronRight";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";

import { paymentText } from "@/dataObject/AF/afStaticTextsData.js";
import { getDecimalAmount } from "@/utils/generalUtils";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    PurchaseItemList,
    ChevronRightIcon,
    ChevronDownIcon,
  },
  mixins: [devicesMixin],
  props: {
    item: Object,
    selected: {
      type: Boolean,
      default: false,
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
      expanded: false,
      paymentText,
      checked: this.selected,
    };
  },

  computed: {
    canRefund() {
      return (
        this.withRefund &&
        this.item.status === availableStatuses.PAID &&
        this.item.entity_type === STRIPE
      );
    },
    cursor() {
      return !this.canRefund ? "cursor-not-allowed" : "cursor-pointer";
    },
    hasPurchaseItems() {
      return this.item.purchaseItems.length > 0;
    },
    purchaseItemsCount() {
      return this.item.purchaseItems.length + 1;
    },
    checkboxTitle() {
      return this.canRefund
        ? ""
        : this.item.entity_type !== STRIPE
        ? "Items purchased by InApp are refundable through Apple store only"
        : "Action disabled as item is already refunded";
    },
  },

  watch: {
    selected() {
      this.checked = this.selected;
    },
  },

  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    onChangeItemSelection(checked, item) {
      this.$emit("on-change-item-selection", checked, item);
    },
    onChangeParentItemSelection(item) {
      this.$emit("on-change-parent-item-selection", this.checked, item);
    },
    getDecimalAmount(amount) {
      return getDecimalAmount(amount, 2);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.item {
  background-color: #fff;
  min-height: 70px;
  font-family: "Montserrat";
  color: $darkgray;
}
.price {
  color: $blue;
  font-size: 16px;
}
.date {
  font-size: 16px;
}
.separator {
  border-right: 1px dotted #808080;
}
.expand {
  background: #e4e5e9;
  color: $gray;
}
@media (max-width: $bigPhoneWidth) {
  .price {
    font-size: 14px;
  }
  .date {
    font-size: 14px;
  }
}
</style>
