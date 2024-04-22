<template>
  <div
    class="card-container text-dark-gray font-montserrat bg-light-gray p-3 rounded-card"
  >
    <template v-if="!billingInfo || !billingInfo.card_last_four">
      <div class="text-center color-gray">
        <div class="text-uppercase">
          {{ $t("iu.checkout.noCreditCardAdded") }}
        </div>
        <div class="icon-outer mt-3">
          <CreditCardOffOutline :size="70" />
        </div>
        <div class="text-uppercase mt-3">
          {{ $t("iu.checkout.youCanAddAfterClicking") }}
          <span>{{ $t("iu.checkout.placeOrder") }}</span>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center billing-text font-weight-600">
        {{ $t("iu.checkout.ccEndingIn") }}:
      </div>
      <div class="mt-1 billing-text font-weight-600 text-center">
        {{ billingInfo.card_last_four }}
      </div>
      <div class="position-relative justify-content-center card-parent">
        <svg-card-bg class="no-card" />
        <div
          class="card-detail d-flex flex-column justify-content-center align-items-center mt-3"
          :class="{ 'w-75 small-card-detail': $isPhone || $isTablet }"
        >
          <DisplayCardBrand
            class="card-name d-flex flex-row-reverse col-12"
            :small="true"
            :card-brand="billingInfo.card_brand"
          />
          <span
            class="card-number-font text-white font-weight-600"
            :class="{ 'small-card-number-font': $isPhone || $isTablet }"
          >
            {{ $t("iu.payment.unknownDigits") }}
            <span> {{ billingInfo.card_last_four }}</span></span
          >
        </div>
      </div>
      <div class="mt-1 billing-text font-weight-600 text-center text-uppercase">
        <span>{{ $t("iu.checkout.ccType") }}</span>
        <span>{{ billingInfo.card_brand }}</span>
      </div>
    </template>
  </div>
</template>

<script>
import DisplayCardBrand from "@/components/IU/Payments/DisplayCardBrand";
import CreditCardOffOutline from "vue-material-design-icons/CreditCardOffOutline";
import SvgCardBg from "@/assets/svg/card-bg.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  mixins: [devicesMixin],
  components: {
    CreditCardOffOutline,
    DisplayCardBrand,
    SvgCardBg,
  },
  props: {
    billingInfo: {
      type: Object,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.card-container {
  text-align: -webkit-center;
}
.bg-light-gray {
  background-color: $lightgray;
}
.card-number-font {
  word-spacing: 5px;
  font-size: 14px;
  margin-left: 40px;
  margin-top: 6px;
}
.small-card-number-font {
  margin-left: 0px;
  margin-top: 10px;
}
.no-card {
  border-radius: 20px;
}
.card-detail {
  position: relative !important;
  bottom: 100%;
  padding-right: unset !important;
  right: 20px;
}
.small-card-detail {
  right: 0px;
}
.card-parent {
  padding: unset;
  width: max-content;
  min-width: 200px;
  height: 120px;
}
.billing-text {
  font-size: 12px;
}
img {
  height: 60px;
  width: auto;
}
.icon-outer {
  svg {
    fill: #dcdcdc;
  }
}
</style>
