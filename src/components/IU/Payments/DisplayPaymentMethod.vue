<template>
  <div>
    <template v-if="!hasPaymentMethod">
      <div
        class="position-relative d-flex justify-content-center align-items-center"
        :class="{ 'card-parent': !$isPhone }"
      >
        <svg-nocard class="no-card" />
        <div
          class="position-absolute d-flex flex-column justify-content-center align-items-center"
        >
          <h4 class="subhead-font font-weight-600 text-white">Add your Card</h4>
          <span
            class="card-number stars-color font-weight-700"
            :class="{ 'small-card-number': $isPhone }"
            >**** **** **** ****</span
          >
        </div>
      </div>
    </template>
    <template v-else>
      <div
        class="position-relative d-flex justify-content-center"
        :class="{ 'card-parent': !$isPhone }"
      >
        <svg-card-bg class="no-card" />
        <div
          class="position-absolute d-flex flex-column justify-content-center align-items-center"
          :class="$isPhone ? 'mt-3' : 'mt-5'"
        >
          <DisplayCardBrand
            class="d-flex flex-row-reverse col-12"
            :card-brand="paymentMethod.data.card_brand"
            :small="$isPhone"
          />
          <span
            class="card-number text-white font-weight-700 mt-5"
            :class="{ 'small-card-number': $isPhone }"
          >
            {{ $t("iu.payment.unknownDigits") }}
            <span> {{ paymentMethod.data.card_last_four }}</span></span
          >
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import DisplayCardBrand from "@/components/IU/Payments/DisplayCardBrand";
import SvgNocard from "@/assets/svg/nocard.svg";
import SvgCardBg from "@/assets/svg/card-bg.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  mixins: [devicesMixin],
  components: {
    DisplayCardBrand,
    SvgNocard,
    SvgCardBg,
  },
  props: {
    paymentMethod: {
      type: Object,
    },
  },
  computed: {
    hasPaymentMethod() {
      return (
        this.paymentMethod.data &&
        this.paymentMethod.data.card_brand &&
        this.paymentMethod.data.card_last_four
      );
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.has-card {
  background-color: $white;
  border: 2px solid $gray;
  color: $gray;
  transition: 0.15s;
}
.has-card h3 {
  font-size: 1.8em;
  word-spacing: 0.4vw;
  letter-spacing: 0.2vw;
}
.magnet {
  background-color: $gray;
}

.stars-color {
  color: #889ab5;
}

.card-parent {
  padding: 3em 9em;
}

.no-card {
  width: 100%;
}
.subhead-font {
  font-size: 28px;
}
.card-number {
  font-size: 3vw;
}
.small-card-number {
  font-size: 6vw;
  margin-top: 18px !important;
}
</style>
