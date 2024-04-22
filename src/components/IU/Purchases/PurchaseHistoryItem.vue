<template>
  <div class="bg-white rounded-card item py-3">
    <div
      :class="[{ 'pb-2': expanded }]"
      class="row g-0 px-4 align-items-center font-weight-600"
    >
      <div class="text-start col">
        {{ item.id }}
      </div>
      <div class="text-center col-2">
        {{ item.purchaseItems.length }}
        {{ $isPhone ? $t("iu.payment.items") : "" }}
      </div>
      <div class="text-center col-2">
        {{ item.currency_symbol }}{{ formattedPrice }}
      </div>
      <div class="text-center col-2">
        {{ item.entity_type }}
      </div>
      <div class="text-end col-2">
        {{ formattedDate }}
      </div>
      <div class="text-end col-2 cursor-pointer" @click="toggleExpanded">
        <template v-if="!expanded">
          <ChevronDownIcon :size="32" />
        </template>
        <template v-else>
          <ChevronUpIcon :size="32" />
        </template>
      </div>
    </div>
    <div v-if="expanded">
      <div>
        <PurchaseItemList
          :items="item"
          :currency-symbol="item.currency_symbol"
        />
      </div>
    </div>
  </div>
</template>

<script>
import PurchaseItemList from "@/components/IU/Purchases/PurchaseItemList.vue";
import { getDecimalAmount } from "@/utils/generalUtils";
import { UTCtoLocalDateOnlyFormatted } from "@/utils/dateTimeUtils";

import ChevronUpIcon from "vue-material-design-icons/ChevronUp";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    PurchaseItemList,
    ChevronUpIcon,
    ChevronDownIcon,
  },
  mixins: [devicesMixin],
  props: {
    item: Object,
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    formattedDate() {
      return UTCtoLocalDateOnlyFormatted(this.item.created_at);
    },
    formattedPrice() {
      return getDecimalAmount(this.item.amount, 2);
    },
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.item {
  background-color: $white;
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
.expand {
  background: $gray;
  color: $white;
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
