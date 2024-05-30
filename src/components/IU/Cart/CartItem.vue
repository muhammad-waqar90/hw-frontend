<template>
  <div>
    <div
      v-if="!subItem"
      class="item-outer rounded-card position-relative px-3 py-3"
    >
      <div class="row mt-2">
        <div class="col-auto ps-3">
          <img
            v-if="item.img"
            :src="item.img ? item.img : getDefaultImage()"
            class="item-img rounded-card"
            @error="handleImageError"
          />
          <div
            v-else-if="item.type == availableTypes.CART_EBOOK"
            class="item-img rounded-card ebook-card d-flex align-items-center justify-content-center text-white"
          >
            <BookOpenOutline :size="60" />
          </div>
          <div
            v-else-if="item.type == availableTypes.CART_EXAM"
            class="item-img rounded-card blue-btn d-flex align-items-center justify-content-center text-white border border-white"
          >
            <SchoolIcon :size="60" />
          </div>
        </div>
        <div class="col">
          <div
            class="d-flex align-items-start flex-column text-dark-gray h-100"
          >
            <div
              class="text-break text-capitalize mb-auto pe-0 pe-md-5 font-weight-600"
            >
              {{ item.name }}
            </div>
            <div
              class="d-flex text-break"
              :class="{ 'flex-column': $isPhone }"
              v-if="item.code"
            >
              <div v-if="item.price !== 0">
                <small class="discount-applied mr-1"
                  >£{{ getDecimalAmountFunc }}</small
                >
              </div>
              <small
                class="coupon-applied rounded-card p-1"
                :class="{ 'd-flex px-2': $isPhone }"
              >
                <span :class="{ 'small-coupon-applied': $isPhone }">
                  {{
                    $t("iu.coupon.appliedCoupon", {
                      code: item.code,
                    })
                  }}
                </span>
                <CloseOutline
                  class="close-outline-button"
                  @click="removeDiscount(item.id)"
              /></small>
            </div>
            <small class="text-break" v-if="item.code">
              <span v-if="item.discountedType == availableTypes.PERCENTAGE">
                {{
                  $t("iu.coupon.discountedPercentage", {
                    amount: item.discountedAmount,
                  })
                }}
              </span>
              <span v-if="item.discountedType == availableTypes.FLAT">
                {{
                  $t("iu.coupon.flatDiscount", {
                    amount: item.discountedAmount,
                  })
                }}
              </span>
            </small>
            <div class="row w-100 mt-3 g-0">
              <div class="col col-md-5 text-center text-md-center">
                <div v-if="item?.is_discounted && discountPercentage !== 0">
                  <div
                    v-if="!item?.code && item?.price !== 0"
                    class="text-decoration-line-through e-notes-grayed-out gbp-price text-start px-1"
                  >
                    £{{ item?.price?.toFixed(2) }}
                  </div>
                  <div
                    v-if="item?.code"
                    class="rounded-card gbp-price text-white sub-item-outer"
                  >
                    £{{ getDiscountedDecimalAmount }}
                  </div>
                  <div
                    v-else
                    class="rounded-card gbp-price text-white sub-item-outer"
                  >
                    £{{ getSalaryScaleDiscountedAmount }}
                  </div>
                </div>
                <div v-else-if="item?.code">
                  <div class="rounded-card gbp-price text-white sub-item-outer">
                    £{{ getDiscountedDecimalAmount }}
                  </div>
                </div>
                <div
                  v-else-if="
                    item?.type == 'ebook' && item?.bookBindingDiscount == 0
                  "
                >
                  <div
                    v-if="!item?.code && item?.price !== 0"
                    class="text-decoration-line-through e-notes-grayed-out gbp-price text-start px-1"
                  >
                    £{{ item?.price?.toFixed(2) }}
                  </div>
                  <div class="rounded-card gbp-price text-white sub-item-outer">
                    £{{ getEbookDiscountedAmount }}
                  </div>
                </div>
                <div
                  v-else
                  class="rounded-card gbp-price text-white sub-item-outer"
                >
                  £{{ getDecimalAmountFunc }}
                </div>
              </div>
              <div class="col col-md-7">
                <div class="text-end">
                  <Close class="close-button" @click="removeItem" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="subItem" class="sub-item-outer-new position-relative px-3 py-1">
      <div class="row">
        <div class="col">
          <div
            class="d-flex align-items-start flex-column text-dark-gray h-100"
          >
            <div class="row w-100 g-0">
              <div
                class="text-start text-md-start"
                :class="$isPhone ? 'col-12' : 'col-md-8 col-8'"
              >
                <div class="text-break mb-auto pe-0 font-weight-700">
                  {{ item.name }}
                </div>
              </div>
              <div
                class="align-self-center e-notes-amount"
                :class="
                  $isPhone ? 'small-e-notes-ammount col-12' : 'col-md-4 col-4'
                "
              >
                <div
                  class="price font-weight-700"
                  :class="{
                    'text-decoration-line-through e-notes-grayed-out':
                      item.bookBindingDiscount === 0,
                  }"
                >
                  £{{ getDecimalAmountFunc }}
                </div>
                <Close class="close-button-subitem ps-2" @click="removeItem" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="item.items && item.items.length" class="e-notes">
      <div class="rounded-card sub-item-outer py-4">
        <div class="row px-4 pt-4 pb-2 text-white">
          <div class="col-6 text-start">
            {{ $t(`iu.cart.types.${item.items[0].type}`) }}
          </div>
          <div class="col-6 text-end">
            <Close class="close-button-enotes" @click="removeEnotes(item)" />
          </div>
        </div>
        <div
          v-for="child in item.items"
          :key="child.type + child.id"
          class="mt-3 px-4"
        >
          <CartItem :item="child" :sub-item="true" @remove-item="removeChild" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/Close";
import BookOpenOutline from "vue-material-design-icons/BookOpenBlankVariant";
import SchoolIcon from "vue-material-design-icons/School";

import * as availableTypes from "@/dataObject/cart/cartItemTypeData";
import { getDecimalAmount } from "@/utils/generalUtils";
import CloseOutline from "vue-material-design-icons/CloseCircleOutline";
import { mapGetters } from "vuex";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { calculateSalaryScaleDiscount } from "@/utils/courseUtils";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "CartItem",
  mixins: [devicesMixin],
  components: {
    Close,
    BookOpenOutline,
    SchoolIcon,
    CloseOutline,
  },
  props: {
    item: {
      type: Object,
    },
    subItem: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      availableTypes,
    };
  },
  computed: {
    ...mapGetters({
      list: "cart/getList",
      discountPercentage: "user/getDiscountPercentage",
    }),
    getDecimalAmountFunc() {
      return getDecimalAmount(this.item.price, 2);
    },
    getDiscountedDecimalAmount() {
      return getDecimalAmount(this.item.discountedPrice, 2);
    },
    getSalaryScaleDiscountedAmount() {
      if (this.item.type == "course") {
        if (this.item.discountedPrice) {
          const price = calculateSalaryScaleDiscount(
            this.item.discountedPrice,
            this.discountPercentage
          );
          return getDecimalAmount(price, 2);
        } else {
          const price = calculateSalaryScaleDiscount(
            this.item.price,
            this.discountPercentage
          );
          return getDecimalAmount(price, 2);
        }
      }
      return getDecimalAmount(this.item.price, 2);
    },
    getEbookDiscountedAmount() {
      return getDecimalAmount(this.item.bookBindingDiscount, 2);
    },
  },
  methods: {
    removeItem() {
      if (
        this.item.type === "physical_product" &&
        this.item.course_module_id !== null
      ) {
        const data = {
          id: this.item.id,
          type: this.item.type,
          courseModuleId: this.item.course_module_id,
        };
        this.$emit("remove-item", data);
      } else {
        const data = { id: this.item.id, type: this.item.type };
        this.$emit("remove-item", data);
      }
    },
    removeDiscount(id) {
      let hasSingleCouponCode = false;
      let couponCodeCount = 0;
      for (const item of this.list) {
        if (item.code) {
          couponCodeCount++;
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
      if (hasSingleCouponCode) {
        this.$store.dispatch("cart/setCouponStatus", "emptyCoupon");
        this.$store.dispatch("cart/setCouponCode", null);
      }
      this.$store.dispatch("cart/setList", [...updatedData].reverse());
    },
    removeEnotes(item) {
      this.$emit("remove-e-notes", item);
    },
    removeChild(child) {
      const data = {
        parent: {
          id: this.item.id,
          type: this.item.type,
        },
        child: {
          id: child.id,
          type: child.type,
        },
      };
      this.$emit("remove-child", data);
    },
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item-outer {
  background: $lightgray;
}
.e-notes {
  margin-top: -36px;
}
.sub-item-outer {
  background: $blue;
}
.sub-item-outer-new {
  background: $lightgray;
  border-radius: 20px;
}

.close-button {
  cursor: pointer;
  z-index: 1;
  svg {
    fill: $red;
    width: 24px;
    height: 24px;
  }
}
.close-button-enotes {
  cursor: pointer;
  svg {
    fill: $static-white;
    width: 22px;
    height: 22px;
  }
}
.close-button-subitem {
  cursor: pointer;
  svg {
    fill: $red;
    width: 20px;
    height: 20px;
  }
}

.e-notes-amount {
  justify-content: right;
  display: inline-flex;
}
.small-e-notes-ammount {
  justify-content: space-between;
}

.item-img {
  width: 110px;
  object-fit: cover;
  aspect-ratio: 1;
}

.price {
  color: $blue;
  min-width: max-content;
}

.ebook-card {
  background: $green;
}
.gbp-price {
  font-size: 12px;
  width: 75%;
  padding: 1px;
}

.e-notes-grayed-out {
  color: #8192a5;
}
.discount-applied {
  text-decoration: line-through;
  margin-right: 6px;
  color: $gray;
}
.coupon-applied {
  background: $lightblue;
  color: $static-white;
  border-radius: 20px;
  font-size: 12px;
}
.small-coupon-applied {
  display: block;
  white-space: nowrap;
  width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.close-outline-button {
  cursor: pointer;
  z-index: 1;
  svg {
    fill: $static-white;
    width: 19px;
    height: 19px;
    margin-bottom: 2px;
  }
}
</style>
