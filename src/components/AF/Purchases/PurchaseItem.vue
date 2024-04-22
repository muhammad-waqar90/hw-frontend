<template>
  <section>
    <div
      class="rounded-card outer p-3"
      :class="checked && 'bg-primary text-white'"
    >
      <div class="row">
        <div v-if="withRefund" class="col-1 text-center pb-2 pb-sm-0">
          <span class="py-3 pe-4 separator">
            <input
              v-model="checked"
              type="checkbox"
              :class="cursor"
              :title="checkboxTitle"
              class="mx-2"
              :disabled="!canRefund"
              @change="onChangeItemSelection(item)"
            />
          </span>
        </div>
        <div class="text-center text-sm-start col-1 pb-2 pb-sm-0">
          {{ item.purchase_history_id }}
        </div>
        <div class="text-center text-sm-start col-1 pb-2 pb-sm-0">
          {{ item.id }}
        </div>
        <div
          class="text-center text-sm-start pb-2 pb-sm-0"
          :class="withRefund ? 'col-2' : 'col-3'"
        >
          {{ item.name }}
        </div>
        <div
          v-if="showExamAttempts"
          class="text-center col-2 text-sm-center pb-2 pb-sm-0"
        >
          {{ `${paymentText.types[item.type]}` }}
          <p>
            ( attempts: {{ examAttempts }}/{{ item.exam_total_attempts }}
            <span :class="examStatusColor"> {{ examStatus }}</span> )
          </p>
        </div>
        <div v-else class="text-center col-2 text-sm-center pb-2 pb-sm-0">
          {{ `${paymentText.types[item.type]}` }}
        </div>
        <div
          class="text-center text-sm-center price pb-2 pb-sm-0 pm-sm-0 ps-3"
          :class="withRefund ? 'col-1' : 'col-2'"
        >
          <s
            class="font-size-14"
            :class="checked ? 'text-white' : 'text-muted'"
            v-if="item.summary"
          >
            {{ item.currency_symbol }}{{ getDecimalPrice }}
            <br />
          </s>
          {{ item.currency_symbol }}{{ getDecimalAmount }}
        </div>
        <div class="col-1 text-center text-sm-center pb-2 pb-sm-0">
          {{ item.entity_type }}
        </div>
        <div class="col-2 text-center text-sm-center pb-2 pb-sm-0">
          {{ formattedDate }}
        </div>
        <div
          v-if="withRefund"
          class="col-1 text-center"
          :class="`${!checked && statusColor}`"
        >
          {{ `${paymentText.statuses[item.status]}` }}
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { STRIPE } from "@/dataObject/paymentGatewayData.js";
import * as availableStatuses from "@/dataObject/purchases/purchaseItemStatusData";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
import * as availablePurchaseItemStatuses from "@/dataObject/purchases/purchaseItemStatusData";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import { getDecimalAmount } from "@/utils/generalUtils";

import { paymentText } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  mixins: [devicesMixin],

  props: {
    item: {
      type: Object,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    withRefund: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      checked: this.selected,
      paymentText,
    };
  },

  computed: {
    statusColor() {
      if (this.item.status === availableStatuses.PAID) return "text-blue";
      return "text-danger";
    },
    examStatusColor() {
      if (this.item.exam_status === "Pass") return "text-success";
      return "text-danger";
    },
    canRefund() {
      return (
        this.withRefund &&
        this.item.status === availableStatuses.PAID &&
        this.item.entity_type === STRIPE
      );
    },
    formattedDate() {
      return UTCtoLocalDateFormatted(this.item.updated_at);
    },
    cursor() {
      return !this.canRefund ? "cursor-not-allowed" : "cursor-pointer";
    },
    getDecimalAmount() {
      return getDecimalAmount(this.item.amount, 2);
    },
    getDecimalPrice() {
      return (
        this.item.summary?.discount &&
        getDecimalAmount(this.item.summary?.price, 2)
      );
    },
    examStatus() {
      if (this.item.attempts_left === this.item.exam_total_attempts) return "";
      return this.item.exam_status;
    },
    examAttempts() {
      return this.item.exam_total_attempts - this.item.attempts_left;
    },
    showExamAttempts() {
      return (
        this.item.status != availablePurchaseItemStatuses.REFUNDED &&
        this.item.exam_status != null
      );
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
    onChangeItemSelection(item) {
      this.$emit("on-change-item-selection", this.checked, item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.outer {
  background: $lightgray;
}

.separator {
  border-right: 1px dotted #808080;
}

.font-size-14 {
  font-size: 14px !important;
}
</style>
