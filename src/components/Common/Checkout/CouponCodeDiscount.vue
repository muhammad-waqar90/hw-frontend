<template>
  <div>
    <div v-if="!isCouponComponentVisible" class="my-4 container text-center">
      <div class="row justify-content-center">
        <div class="col fit-max-width">
          <div
            class="text-primary font-weight-700 apply-coupon"
            style="text-decoration: underline"
            @click="toggleVisibility"
          >
            {{ $t("iu.coupon.applyCoupon") }}
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="item-outer rounded-card position-relative px-3 pt-2 pb-3">
        <!-- First Row with Text "Apply a coupon code" -->
        <div class="row mt-2">
          <div class="col-12">
            <div class="font-weight-700 coupon-title">
              {{ $t("iu.coupon.applyCoupon") }}
            </div>
          </div>
        </div>
        <!-- Second Row with Input, Clear Icon, and Apply Button -->
        <div class="row mt-3">
          <div class="col-12">
            <div class="input-group rounded">
              <input
                type="text"
                v-model="couponCodeValue"
                class="form-control left-radius-50 coupon-input"
                :class="colorClass"
                :placeholder="$t(`iu.coupon.couponCodePlaceholder`)"
                :disabled="disableCouponField || loading"
                @input="changeCouponState"
              />
              <div class="input-group-append">
                <Close
                  class="close-button"
                  :class="{ 'disable-icon': loading }"
                  @click="clearInput"
                />
                <div class="coupon-button">
                  <button
                    class="btn w-100 no-hover-active right-radius-50"
                    :class="colorClass"
                    :disabled="disableButton || loading || !couponCodeValue"
                    @click="applyCoupon"
                  >
                    {{ buttonText }}
                    <slot />
                    <span
                      v-show="loading"
                      class="spinner-border"
                      :class="'spinner-border-sm'"
                      role="status"
                      aria-hidden="true"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <small v-show="invalidCoupon" class="col-12 danger">
          <Alert class="alert-icon" />
          {{
            invalidCouponMessage
              ? invalidCouponMessage
              : $t(`iu.coupon.invalidCoupon`)
          }}
        </small>
      </div>
    </div>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/CloseCircleOutline";
import Alert from "vue-material-design-icons/AlertCircleOutline";
import { mapGetters } from "vuex";
import { getCouponRedeemItems } from "@/services/iuService";
import { CART_COURSE } from "@/dataObject/cart/cartItemTypeData";
import { PERCENTAGE, FLAT } from "@/dataObject/discountTypeData.js";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
export default {
  mixins: [validationMixin],
  components: {
    Close,
    Alert,
  },
  data() {
    return {
      couponCodeValue: "",
      apiObject: {},
      updatedData: [],
      invalidCouponMessage: null,
      loading: false,
      cartObject: {},
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters({
      list: "cart/getList",
      isCouponComponentVisible: "cart/getCouponComponentVisible",
      checkCouponStatus: "cart/getCouponStatus",
      couponCode: "cart/getCouponCode",
    }),
    colorClass() {
      if (this.checkCouponStatus == "validCoupon") return "color-green";
      else if (this.checkCouponStatus == "invalidCoupon") return "color-red";
      else return "color-orange";
    },
    buttonText() {
      if (this.checkCouponStatus == "validCoupon") return "Applied";
      else if (this.checkCouponStatus == "invalidCoupon") return "Invalid";
      else return "Apply";
    },
    invalidCoupon() {
      return this.checkCouponStatus == "invalidCoupon";
    },
    validCoupon() {
      return this.checkCouponStatus == "validCoupon";
    },
    disableButton() {
      return this.checkCouponStatus != "emptyCoupon";
    },
    editabeCoupon() {
      return this.checkCouponStatus == "emptyCoupon";
    },
    disableCouponField() {
      return (
        this.checkCouponStatus != "emptyCoupon" &&
        this.checkCouponStatus != "invalidCoupon"
      );
    },
  },
  watch: {
    couponCodeValue(newCodeValue) {
      if (newCodeValue == "") {
        this.$store.dispatch("cart/setCouponStatus", "emptyCoupon");
      }
    },
  },
  validations() {
    return {
      couponCodeValue: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20),
      },
    };
  },
  methods: {
    init() {
      if (this.couponCode && !this.editabeCoupon) {
        this.couponCodeValue = this.couponCode;
      } else this.$store.dispatch("cart/setCouponStatus", "emptyCoupon");
      this.checkCart();
    },
    checkCart() {
      const cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart || !cart.timestamp) return;
      const diffInHours = (new Date().getTime() - cart.timestamp) / 3600000;
      if (diffInHours > 2) return localStorage.removeItem("cart");
      this.$store.dispatch("cart/setList", cart.items);
    },
    toggleVisibility() {
      this.$store.dispatch("cart/setCouponComponentVisibility", true);
    },
    clearInput() {
      // remove the discount from every course at once.
      if (this.validCoupon) {
        this.removeDiscount();
      }
      this.$store.dispatch("cart/setCouponCode", null);

      this.$store.dispatch("cart/setCouponStatus", "emptyCoupon");
      this.couponCodeValue = "";
    },
    async applyCoupon() {
      this.$v.$touch();
      if (this.$v.$invalid)
        return this.$store.dispatch("cart/setCouponStatus", "invalidCoupon");
      this.loading = true;
      this.extractCourseIds();
      const response = await getCouponRedeemItems(this.cartObject);
      if (response.error) {
        this.invalidCouponMessage = response.error;
        this.$store.dispatch("cart/setCouponStatus", "invalidCoupon");
      } else if (this.apiObject && response) {
        this.apiObject = response;
        this.discountedList();
        this.$store.dispatch("cart/setCouponStatus", "validCoupon");
        this.$store.dispatch("cart/setCouponCode", this.apiObject.coupon.code);
        this.$store.dispatch("cart/setList", [...this.updatedData].reverse());
      }
      this.loading = false;
    },
    extractCourseIds() {
      this.cartObject = {
        code: this.couponCodeValue,
        cart: {
          course: [],
        },
      };
      for (const item of this.list) {
        if (item.type === CART_COURSE && typeof item.id === "number") {
          this.cartObject.cart.course.push(item.id);
        }
      }
    },
    discountedList() {
      // Use map to merge properties based on matching IDs
      this.updatedData = this.list.map((item) => {
        let restrictedItem = null;
        for (const can_redeem of this.apiObject?.can_redeem) {
          if (item.type === CART_COURSE && can_redeem.item_id === item.id) {
            restrictedItem = can_redeem;
            break;
          }
        }
        if (restrictedItem) {
          // If a matching can_redeem item is found, merge its properties into the original item
          return {
            ...item,
            code: this.apiObject.coupon.code,
            discountedAmount: this.apiObject.coupon.value,
            discountedType: this.apiObject.coupon.value_type,
            discountedPrice: this.calculateDiscount(
              item?.salaryScaleDiscount || item?.salaryScaleDiscount == 0
                ? item?.salaryScaleDiscount
                : item.price,
              this.apiObject.coupon.value,
              this.apiObject.coupon.value_type
            ),
          };
        }
        return item; // Return the original item for non-matching IDs
      });
    },
    calculateDiscount(itemPrice, discountedAmount, discountedType) {
      let discountedPrice = null;
      if (discountedType === FLAT.value) {
        // Calculate discounted price for flat discount
        discountedPrice = itemPrice - discountedAmount;
      } else if (discountedType === PERCENTAGE.value) {
        // Calculate discounted price for percentage discount
        discountedPrice = itemPrice - (itemPrice * discountedAmount) / 100;
      }
      return discountedPrice;
    },

    // remove the discount from every course at once.
    removeDiscount() {
      this.updatedData = this.list.map((item) => {
        let restrictedItem = null;
        if (item.type === CART_COURSE && item.code) {
          restrictedItem = item;
        }
        if (restrictedItem) {
          const newItem = { ...item };
          delete newItem.code;
          delete newItem.discountedAmount;
          delete newItem.discountedType;
          delete newItem.discountedPrice;
          return newItem;
        }
        return item; // Return the original item for non-matching IDs
      });
      this.$store.dispatch("cart/setList", [...this.updatedData].reverse());
    },
    changeCouponState() {
      if (this.invalidCoupon) {
        this.$store.dispatch("cart/setCouponStatus", "emptyCoupon");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.item-outer {
  background: $lightgray;
}
.apply-coupon {
  cursor: pointer;
}
.close-button {
  position: absolute;
  right: 94px;
  top: calc(42% - 10px);
  cursor: pointer;
  svg {
    fill: #8a94a9;
    width: 24px;
    height: 24px;
  }
}
.disable-icon {
  pointer-events: none;
}
.alert-icon {
  margin-right: 4px;
  svg {
    fill: $red;
    width: 15px;
    height: 15px;
    margin-bottom: 2px;
  }
}
.right-radius-50 {
  border-radius: 0px 50px 50px 0px;
}
.left-radius-50 {
  border-radius: 50px 0px 0px 50px;
}
.coupon-input {
  background-color: $white !important;
  color: $darkgray !important;
}
.danger {
  color: $red;
}
.coupon-button {
  width: 90px;
}
.color-green {
  background-color: $green;
  border-color: $green;
  color: $static-white;
}
.color-orange {
  background-color: $orange;
  border-color: $orange;
  color: $static-white;
}
.color-red {
  background-color: $red;
  border-color: $red;
  color: $static-white;
}
.no-hover-active:active {
  background-color: $orange;
  border-color: $orange;
  color: $static-white;
}
.no-hover-active:focus {
  box-shadow: none;
  text-decoration: none;
}
.fit-max-width {
  max-width: fit-content;
}
.coupon-title {
  color: $black;
}
</style>
