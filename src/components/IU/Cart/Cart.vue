<template>
  <div
    class="cart-outer shadow pt-2 px-4"
    :class="{ 'cart-outer--active': cartActive && loaded }"
  >
    <div class="text-end">
      <Close class="close-button" @click="closeCart" />
    </div>
    <h5 class="cart-title text-start text-lg-start font-weight-600">
      <svg-cart-store class="cart-icon" />
      <span class="px-2 font-weight-600 text-dark-gray">
        {{ $t("iu.cart.myCart") }}
      </span>
    </h5>
    <div
      class="mt-4 cart-list scrollbar-blue container"
      :class="{ 'small-cart-list': $isPhone }"
    >
      <CartList
        :list="list"
        @remove-item="removeItem"
        @remove-e-notes="removeEnotes"
        @remove-child="removeChild"
      />
    </div>
    <div v-if="list.length" class="row mt-2 mx-1 coupon-discount">
      <CouponCodeDiscount />
    </div>
    <div v-if="list.length" class="mt-2 mx-3 rounded-card item-outer px-4 py-3">
      <div class="row mb-3 px-0 mx-1 pb-2 border-bottom">
        <div
          class="col-6 text-start align-self-end total cart-items font-weight-500 pt-1 px-0"
        >
          {{ list.length }} {{ $t("iu.cart.item") }}
        </div>
        <div
          class="col-6 payment-sum text-uppercase text-end total fw-bold px-0"
        >
          <!-- <div class="discount-container">
            <small
              v-if="couponCode && totalPrice !== totalDiscountedPrice"
              class="discount-applied"
              >£ {{ totalPrice }}</small
            >
          </div> -->
          <div>
            £{{ totalDiscountedPrice ? totalDiscountedPrice : totalPrice }}
          </div>
        </div>
      </div>
      <router-link :to="{ name: checkoutPath }">
        <button
          class="btn blue-btn text-uppercase cart-checkout font-weight-500 rounded-pill mt-2 px-4 py-1 w-100"
          @click="closeCart"
        >
          {{ $t("iu.cart.checkout") }}
        </button>
      </router-link>
    </div>
    <portal to="out-of-app-content">
      <WarningModal
        v-if="pendingRemoveItem"
        :with-confirmation-buttons="true"
        :only-confirm="false"
        :hide-close-button="false"
        @close-modal="closeModal"
        @on-confirm="handleRemoveItem"
      >
        <b slot="body">
          {{ $t("modal.areYouSure") }}
        </b>
      </WarningModal>
    </portal>
  </div>
</template>

<script>
import CartList from "@/components/IU/Cart/CartList";
import Close from "vue-material-design-icons/Close";
import WarningModal from "@/components/Misc/WarningModal";
import SvgCartStore from "@/assets/svg/cart-store.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import CouponCodeDiscount from "@/components/Common/Checkout/CouponCodeDiscount";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    Close,
    CartList,
    WarningModal,
    SvgCartStore,
    CouponCodeDiscount,
  },
  mixins: [devicesMixin],
  data() {
    return {
      loaded: false,
      pendingRemoveItem: null,
      isEnotes: false,
      updatedModules: [],
    };
  },
  computed: {
    ...mapGetters({
      list: "cart/getList",
      cartActive: "ui/getCartActive",
      totalPrice: "cart/getTotalPrice",
      couponCode: "cart/getCouponCode",
      totalDiscountedPrice: "cart/getTotalDiscountedPrice",
      isLoggedIn: "auth/getIsLoggedIn",
    }),
    checkoutPath() {
      return this.isLoggedIn ? "iu-checkout" : "gu-checkout";
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      setTimeout(() => {
        this.loaded = true;
      }, 0);
    },
    ...mapActions({ bindBook: "cart/findBindedCourse" }),
    closeCart() {
      if (!this.cartActive) return;

      setTimeout(() => {
        this.$store.dispatch("ui/setCartActive", false);
      }, 0);
    },
    removeItem(item) {
      this.isEnotes = false;
      this.pendingRemoveItem = item;
    },
    removeEnotes(item) {
      this.isEnotes = true;
      this.pendingRemoveItem = item;
    },
    removeChild(item) {
      this.pendingRemoveItem = { ...item, isChild: true };
    },
    handleRemoveItem() {
      if (this.pendingRemoveItem.isChild)
        this.$store.dispatch("cart/removeChildItem", this.pendingRemoveItem);
      else {
        if (this.isEnotes)
          this.$store.dispatch("cart/removeEnotes", this.pendingRemoveItem);
        else {
          this.removeDiscount(this.pendingRemoveItem.id);
          this.removebookBindingDiscount(this.pendingRemoveItem);
          this.$store.dispatch("cart/removeItem", this.pendingRemoveItem);
        }
      }
      this.closeModal();
    },
    removebookBindingDiscount(pendingRemoveItem) {
      if (
        pendingRemoveItem.type === "physical_product" &&
        pendingRemoveItem.courseModuleId
      ) {
        var newList;
        newList = this.list.map((item) => {
          if (item.type === "course" && item.items) {
            this.updatedModules = item.items.map((module) => {
              if (pendingRemoveItem.courseModuleId === module.id) {
                if ("bookBindingDiscount" in module) {
                  const newModule = { ...module };
                  delete newModule.bookBindingDiscount;
                  return newModule;
                }
                return module;
              } else {
                return module;
              }
            });
            const newItem = { ...item };
            delete newItem.items;
            return { ...newItem, items: this.updatedModules };
          }
          if (item.type === "ebook") {
            if (pendingRemoveItem.courseModuleId === item.id) {
              if ("bookBindingDiscount" in item) {
                const newModule = { ...item };
                delete newModule.bookBindingDiscount;
                return newModule;
              } else {
                return item;
              }
            } else {
              return item;
            }
          } else {
            return item;
          }
        });
        this.$store.dispatch("cart/setList", newList);
      }
    },
    removeDiscount(id) {
      let hasSingleCouponCode = false;
      let isItemDiscounted = false;
      let couponCodeCount = 0;
      for (const item of this.list) {
        if (item.code) {
          couponCodeCount++;
        }
        if (item.code && item.id === id) {
          isItemDiscounted = true;
        }
      }
      if (couponCodeCount === 1) {
        hasSingleCouponCode = true;
      }
      const updatedData = this.list.map((item) => {
        if (id === item.id) {
          const newItem = { ...item };
          delete newItem.code;
          delete newItem.discountedAmount;
          delete newItem.discountedType;
          delete newItem.discountedPrice;
          return newItem;
        }
        return item;
      });
      if (hasSingleCouponCode && isItemDiscounted) {
        this.$store.dispatch("cart/setCouponStatus", "emptyCoupon");
        this.$store.dispatch("cart/setCouponCode", null);
      }
      this.$store.dispatch("cart/setList", [...updatedData].reverse());
    },
    closeModal() {
      this.pendingRemoveItem = null;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.cart-outer {
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1030;
  top: 0;
  left: 0;
  background-color: $white;
  overflow-x: hidden;
  transition: transform 0.5s;
  transform: translateX(100vw);
  width: 500px;
  &.cart-outer--active {
    transform: translateX(calc(100vw - 515px));
  }
}
.close-button {
  cursor: pointer;
  svg {
    padding: 2px;
    fill: $static-white;
    width: 28px;
    height: 28px;
    background-color: $red;
    border-radius: 10px;
  }
}
.cart-icon {
  width: 40px;
}

.cart-title {
  font-family: "Montserrat";
  font-size: 36px;
}
.cart-list {
  overflow-y: auto;
  height: calc(100vh - 390px);
}
.small-cart-list {
  height: calc(100vh - 270px) !important;
}
.item-outer {
  background: $lightgray;
}
.total {
  color: $blue;
}
.payment-sum {
  font-size: 22px;
}
.cart-items {
  font-size: 18px;
}
.cart-checkout {
  font-size: 14px;
}
.discount-container {
  height: 14px;
}
.discount-applied {
  position: absolute;
  right: 67px;
  font-size: 14px;
  text-decoration: line-through;
  color: $gray;
}
@media (max-width: $laptopWidth) {
  .cart-outer {
    &.cart-outer--active {
      transform: translateX(calc(100vw - 500px));
    }
  }
}

@media (max-width: $tabletWidth) {
  .cart-outer {
    width: 100vw;
    transform: translateX(100vw);
    &.cart-outer--active {
      transform: translateX(0vw);
    }
  }
  .cart-list {
    height: calc(100vh - 390px);
  }
}
</style>
