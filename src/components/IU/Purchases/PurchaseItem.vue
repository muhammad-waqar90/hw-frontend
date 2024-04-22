<template>
  <div
    class="rounded-card outer font-weight-600 py-2 px-3 cursor-pointer"
    @click="openModal"
  >
    <div class="row align-items-center">
      <div class="text-start col-2 ps-3">
        {{ item.id }}
      </div>
      <div
        class="text-start text-capitalize col-4 ps-0"
        :class="{ 'fw-bold': $isPhone }"
      >
        {{ item.name }}
      </div>
      <div class="text-start col-2 ps-0">
        {{ $t(`iu.payment.types.${item.type}`) }}
      </div>
      <div class="text-start col ps-0 d-flex flex-column">
        <s class="text-muted font-size-14" v-if="item.summary">
          {{ currencySymbol }}{{ formattedPrice }}
        </s>
        {{ currencySymbol }}{{ formattedAmount }}
      </div>
      <div class="text-center col-auto pe-1">
        <div
          :class="statusColor"
          class="button-like btn-font rounded-card text-uppercase font-weight-600 py-1 btn-padding-x"
        >
          {{ $t(`iu.payment.statuses.${item.status}`) }}
        </div>
      </div>
    </div>
    <Modal
      v-if="modalMode == 'view'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <template slot="header">
        <div
          class="rounded-card col-12 col-md-12 p-3 d-flex justify-content-between font-weight-600"
        >
          <div class="header-id">Item ID {{ transactionId }}</div>
          <div class="header-date d-flex align-items-center">
            {{ dateFormat(item.created_at) }}
          </div>
        </div>
      </template>
      <template slot="body">
        <div
          class="rounded-card col-12 col-md-12 p-3 d-flex justify-content-between font-weight-600"
        >
          <div class="body-id">Name</div>
          <div class="body-detail d-flex align-items-center">
            {{ item.name }}
          </div>
        </div>
        <div
          class="rounded-card col-12 col-md-12 p-3 d-flex justify-content-between font-weight-600"
        >
          <div class="body-id">Type</div>
          <div class="body-detail d-flex align-items-center">
            {{ $t(`iu.payment.types.${item.type}`) }}
          </div>
        </div>
        <div
          class="rounded-card col-12 col-md-12 p-3 d-flex justify-content-between align-items-center font-weight-600"
        >
          <div class="body-id">Amount</div>
          <div class="body-detail d-flex align-items-center">
            <div v-for="(item, index) in discounts" :key="index">
              <span class="badge bg-info me-2">
                {{ formattedDicountItem(item) }}
              </span>
            </div>
            <div class="d-flex flex-column">
              <s class="text-muted font-size-14" v-if="item.summary?.discount">
                {{ currencySymbol }}{{ formattedPrice }}
              </s>
              {{ currencySymbol }}{{ formattedAmount }}
            </div>
          </div>
        </div>
        <div
          class="rounded-card col-12 col-md-12 p-3 d-flex justify-content-between font-weight-600"
          v-for="shippingDetail in shippingDetails"
          :key="shippingDetail.id"
        >
          <div class="body-id">Shipping address</div>
          <div class="body-detail d-flex align-items-center">
            {{ shippingDetailFormat(shippingDetail) }}
          </div>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>
import * as availableStatuses from "@/dataObject/purchases/purchaseItemStatusData";

import Modal from "@/components/Misc/Modal.vue";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import { getDecimalAmount } from "@/utils/generalUtils";
import { UTCtoLocalDateOnlyFormatted } from "@/utils/dateTimeUtils";
import {
  DISCOUNT_VALUE_TYPES,
  DISCOUNT_TYPES,
} from "@/dataObject/discountTypeData";

export default {
  mixins: [devicesMixin],
  components: {
    Modal,
  },
  data() {
    return {
      modalMode: "",
      list: [],
    };
  },
  props: {
    item: {
      type: Object,
    },
    currencySymbol: {
      type: String,
      default: "",
    },
    shippingDetails: {
      type: Array,
    },
    transactionId: {
      type: Number,
    },
  },
  computed: {
    statusColor() {
      if (this.item.status === availableStatuses.PAID) return "green-button";
      return "orange-button";
    },
    formattedPrice() {
      return (
        this.item.summary?.discount &&
        getDecimalAmount(this.item.summary?.price, 2)
      );
    },
    formattedAmount() {
      return getDecimalAmount(this.item.amount, 2);
    },
    discounts() {
      return this.item.summary?.discount ? this.item.summary.discount : [];
    },
  },
  methods: {
    openModal() {
      this.modalMode = "view";
    },
    closeModal() {
      this.modalMode = "";
    },
    dateFormat(date) {
      return UTCtoLocalDateOnlyFormatted(new Date(date));
    },
    shippingDetailFormat(shippingDetail) {
      return (
        shippingDetail.address +
        " " +
        shippingDetail.city +
        " " +
        shippingDetail.country +
        " " +
        shippingDetail.postal_code
      );
    },
    formattedDicountItem(item) {
      return (
        DISCOUNT_TYPES[item.type] +
        " (" +
        item.value +
        DISCOUNT_VALUE_TYPES[item.value_type] +
        ")"
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.button-like {
  display: inline-block;
}
.green-button {
  background-color: $green;
  border-color: $green;
  box-shadow: none;
  color: $static-white;
}
.orange-button {
  background-color: $orange;
  border-color: $orange;
  box-shadow: none;
  color: $static-white;
}

.outer {
  background: $lightgray;
}
.btn-font {
  font-size: 10px;
}
.btn-padding-x {
  padding-left: 3em;
  padding-right: 3em;
}
.header-id {
  font-size: 20px;
}
.header-date {
  font-size: 14px;
  color: $blue;
}
.font-size-14 {
  font-size: 14px !important;
}
</style>
