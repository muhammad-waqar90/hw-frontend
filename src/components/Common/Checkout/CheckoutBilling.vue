<template>
  <div>
    <template v-if="loading">
      <LoadingBilling />
    </template>
    <template v-else>
      <div>
        <div :class="{ 'd-flex justify-content-around mt-3': $isTablet }">
          <CardInfo
            v-if="(!isFree && !isGuest) || isPhysicalProduct"
            :billing-info="billingInfo"
            :class="{ 'col-md-6 col-lg-5 p-3 mt-3 h-100': $isTablet }"
          />
          <div
            class="font-montserrat"
            :class="{ 'col-md-6 col-lg-5 p-3': $isTablet, 'mt-4': !$isTablet }"
          >
            <div class="row text-dark-gray">
              <div class="col-8 lower-text-size font-weight-600">
                {{ $t("iu.checkout.noOfItems") }}
              </div>
              <div class="col-4 text-end number-size font-weight-700">
                {{ numberOfItems }}
              </div>
              <div v-if="isPhysicalProduct" class="d-flex justify-between">
                <div class="col-8 lower-text-size font-weight-600">
                  {{ $t("iu.checkout.shippingCost") }}
                </div>
                <div class="col-4 text-end number-size font-weight-700">
                  £2.99
                </div>
              </div>
            </div>
            <hr class="" />
            <div class="row price">
              <div
                class="col-5 col-sm-5 col-md-4 col-lg-5 col-lg-5 lower-text-size align-self-end font-weight-600"
              >
                {{ $t("iu.checkout.total") }}
              </div>
              <div
                class="col-7 col-sm-7 col-md-8 col-lg-7 text-end price-number-size font-weight-700 total-price"
              >
                <!-- <div class="discount-container">
              <small
                v-if="couponCode && totalPrice !== totalDiscountedPrice"
                class="discount-applied"
                >£{{
                  isPhysicalProduct
                    ? (shippingCost + Number(totalPrice)).toFixed(2)
                    : totalPrice
                }}</small
              >
            </div> -->
                <div>
                  £{{
                    totalDiscountedPrice
                      ? isPhysicalProduct
                        ? (shippingCost + Number(totalDiscountedPrice)).toFixed(
                            2
                          )
                        : totalDiscountedPrice
                      : isPhysicalProduct
                      ? (shippingCost + Number(totalPrice)).toFixed(2)
                      : totalPrice
                  }}
                </div>
              </div>
            </div>
            <div class="mt-3">
              <div>
                <button
                  class="btn btn-font blue-btn font-weight-600 rounded-pill px-4 py-1 w-100"
                  @click="placeOrder"
                >
                  {{ $t("iu.checkout.placeOrder") }}
                </button>
              </div>
              <div
                v-if="
                  (!isFree && !noCardSaved) ||
                  (isPhysicalProduct && !noCardSaved)
                "
                class="mt-3"
              >
                <button
                  class="btn btn-font blue-border-btn font-weight-600 rounded-pill px-4 py-1 w-100"
                  @click="changeCard"
                >
                  {{ addOrChangeBtnTxt }}
                </button>
              </div>
              <div v-if="!$isTablet" class="mt-4">
                <div
                  class="text-center text-uppercase links-font font-weight-600 text-blue mt-2"
                >
                  <span class="span-as-anchor" @click="openTermsAndConditions">
                    <small>
                      {{ $t("iu.checkout.termsAndConditions") }}
                    </small>
                  </span>
                </div>
                <div
                  class="text-center text-uppercase links-font font-weight-600 text-blue link-underline mt-2"
                >
                  <router-link :to="{ name: contactLink }" class="subtle-link">
                    <small>
                      {{ $t("auth.contactPageLink") }}
                    </small>
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="$isTablet" class="col-12 justify-content-around mt-3">
          <div
            class="text-center text-uppercase links-font font-weight-600 text-blue mt-2"
          >
            <span class="span-as-anchor" @click="openTermsAndConditions">
              <small>
                {{ $t("iu.checkout.termsAndConditions") }}
              </small>
            </span>
          </div>
          <div
            class="text-center text-uppercase links-font font-weight-600 text-blue link-underline mt-2"
          >
            <router-link :to="{ name: contactLink }" class="subtle-link">
              <small>
                {{ $t("auth.contactPageLink") }}
              </small>
            </router-link>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import LoadingBilling from "@/components/Common/Checkout/Billing/LoadingBilling";
import CardInfo from "@/components/Common/Checkout/Billing/CardInfo";
import { mapGetters } from "vuex";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    LoadingBilling,
    CardInfo,
  },
  mixins: [devicesMixin],
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
    billingInfo: {
      type: Object,
      default: () => {},
    },
    numberOfItems: {
      type: Number,
    },
    totalPrice: {
      type: String,
    },
    couponCode: {
      type: String,
    },
    totalDiscountedPrice: {
      type: String,
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      termsAndConditions: false,
      shippingCost: 2.99,
    };
  },
  computed: {
    isFree() {
      if (this.totalPrice === "0.00") return true;
      else if (
        this.totalPrice !== "0.00" &&
        this.totalDiscountedPrice === "0.00"
      )
        return true;
      else return false;
    },
    termsLink() {
      return this.isGuest ? "gu-terms" : "iu-terms";
    },
    contactLink() {
      return this.isGuest ? "gu-faq-dashboard" : "iu-faq-dashboard";
    },
    noCardSaved() {
      return (
        !this.billingInfo ||
        !this.billingInfo.card_last_four ||
        !this.billingInfo.card_brand
      );
    },
    addOrChangeBtnTxt() {
      return this.$t("iu.checkout.changeCard");
    },
    ...mapGetters({ isPhysicalProduct: "cart/getItemType" }),
  },
  methods: {
    placeOrder() {
      this.$emit("place-order");
    },
    changeCard() {
      this.$emit("change-card");
    },
    openTermsAndConditions() {
      window.open(process.env.VUE_APP_TERMS_LINK, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.price {
  color: $blue;
}
.total-price {
  white-space: nowrap;
  overflow: hidden;
}
hr {
  background-color: $lightgray;
}
.btn-font {
  font-size: 14px;
}
.link-underline {
  text-decoration: underline;
}
.lower-text-size {
  font-size: 18px;
}
.number-size {
  font-size: 22px;
}
.lower-price-text-size {
  font-size: 22px;
}
.price-number-size {
  font-size: 26px;
}
.links-font {
  font-size: 13px;
}
.span-as-anchor {
  text-decoration: underline;
  color: $blue;
  cursor: pointer;
}
.discount-container {
  height: 14px;
}
.discount-applied {
  position: absolute;
  right: 34px;
  font-size: 14px;
  text-decoration: line-through;
  color: $gray;
}
</style>
