<template>
  <div class="container font-montserrat mt-3 px-0 px-sm-3">
    <template v-if="numberOfItems == 0">
      <CartEmpty />
    </template>
    <template v-else>
      <div class="row">
        <div v-if="$isPhone" class="col-12">
          <div class="bg-white rounded-card p-3 pt-4 billing-info-outer">
            <h5
              class="px-3 color-gray font-weight-600 text-capitalize text-center"
            >
              {{ $t("iu.checkout.billingInfo") }}
            </h5>
            <div class="mt-3 p-3">
              <CheckoutBilling
                :loading="loadingBilling"
                :billing-info="billingInfo"
                :number-of-items="numberOfItems"
                :total-price="totalPrice"
                :coupon-code="couponCode ? couponCode : null"
                :total-discounted-price="
                  totalDiscountedPrice ? totalDiscountedPrice : null
                "
                :is-guest="!isLoggedIn"
                @change-card="onChangeCard"
                @place-order="onPlaceOrder"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-8 mt-3">
          <div class="bg-white rounded-card p-3 px-4 py-4">
            <h4 class="px-1 color-gray pb-3 mb-4 cart-title font-weight-600">
              {{ $t("iu.checkout.reviewYourOrder") }}
            </h4>
            <div class="mt-3">
              <CheckoutItemList
                :list="itemList"
                :is-address-exist="isAddressExist"
                :is-physical-product="isPhysicalProduct"
                @remove-item="onRemoveItem"
                @remove-e-notes="removeEnotes"
                @remove-child="onRemoveChild"
                @add-shipping-address="onAddShippingAddress"
              />
            </div>
            <div
              class="mt-3"
              v-if="different_shipping_address && !isProfileLoading"
            >
              <h4 class="px-1 color-gray pb-3 font-weight-600">
                Address Details
              </h4>
              <ContactInfo
                :contact-info-prop="profile?.contactInfo"
                :validation="$v"
                @update-field="updateField"
              />
            </div>
          </div>
        </div>
        <div class="col-12 col-md-12 col-lg-12 col-xl-4 mt-3">
          <div class="bg-white rounded-card p-3 pt-4 billing-info-outer">
            <h5
              class="px-3 color-gray font-weight-600 text-capitalize text-center"
            >
              {{ $t("iu.checkout.billingInfo") }}
            </h5>
            <div :class="{ 'p-3': !$isTablet }">
              <CheckoutBilling
                :loading="loadingBilling"
                :billing-info="billingInfo"
                :number-of-items="numberOfItems"
                :total-price="totalPrice"
                :coupon-code="couponCode ? couponCode : null"
                :total-discounted-price="
                  totalDiscountedPrice ? totalDiscountedPrice : null
                "
                :is-guest="!isLoggedIn"
                @change-card="onChangeCard"
                @place-order="onPlaceOrder"
              />
            </div>
          </div>
        </div>
      </div>
    </template>

    <template v-if="processing">
      <LoadingAnimation :loading-text="'processing'" />
    </template>

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
      <ModalOutsideClose
        v-if="changingCard"
        :hide-header="true"
        :hide-footer="true"
        :close-on-click-outside="false"
        @close-modal="closeModal"
      >
        <div slot="body">
          <UpdatePaymentInfo :is-card-exist="isCardExist" @pay="onPay" />
        </div>
      </ModalOutsideClose>
    </portal>
    <LoginRegisterModal
      v-if="showLoginRegister"
      @modal-closed="onLoginRegisterModalClose"
    />
  </div>
</template>

<script>
import CartEmpty from "@/components/IU/Cart/CartEmpty";
import CheckoutItemList from "@/components/Common/Checkout/CheckoutItemList";
import CheckoutBilling from "@/components/Common/Checkout/CheckoutBilling";
import UpdatePaymentInfo from "@/components/Common/Checkout/UpdatePaymentInfo";
import WarningModal from "@/components/Misc/WarningModal";
import ModalOutsideClose from "@/components/Misc/ModalOutsideClose";
import LoadingAnimation from "@/components/Misc/LoadingAnimation";
import ContactInfo from "@/components/IU/Profile/ContactInfo";

import { getPaymentMethod } from "@/services/IU/iuPaymentService";
import { getProfileService } from "@/services/iuService";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";

import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import dompurifyMixin from "@/mixins/dompurifyMixin";

import { mapGetters } from "vuex";

import { cartCheckout } from "@/services/IU/iuPurchaseService";
import { clearGuestCart } from "@/services/iuService";

import { calculateSalaryScaleDiscount } from "@/utils/courseUtils";
import { PHYSICAL_PRODUCT } from "@/dataObject/cart/cartItemTypeData";

export default {
  name: "Checkout",
  components: {
    CartEmpty,
    CheckoutItemList,
    ModalOutsideClose,
    CheckoutBilling,
    UpdatePaymentInfo,
    LoadingAnimation,
    WarningModal,
    ContactInfo,
    LoginRegisterModal: () =>
      import(
        /* webpackChunkName: "LoginRegisterModalComponent" */ "@/components/Misc/LoginRegisterModal"
      ),
  },
  mixins: [devicesMixin, toastMixin, validationMixin, dompurifyMixin],
  beforeRouteLeave(to, from, next) {
    if (this.processing) return;
    next();
  },
  data() {
    return {
      pendingRemoveItem: null,
      loadingBilling: true,
      billingInfo: null,
      changingCard: false,
      processing: false,
      showLoginRegister: false,
      isEnotes: false,
      isCardExist: false,
      different_shipping_address: false,
      profile: null,
      isAddressExist: true,
      isPhysicalProduct: false,
      guestCartId: null,
      isProfileLoading: false,
    };
  },
  computed: {
    ...mapGetters({
      itemList: "cart/getList",
      numberOfItems: "cart/getNumberOfItems",
      cartActive: "ui/getCartActive",
      totalPrice: "cart/getTotalPrice",
      couponCode: "cart/getCouponCode",
      totalDiscountedPrice: "cart/getTotalDiscountedPrice",
      isLoggedIn: "auth/getIsLoggedIn",
      // redirectToExamId: "cart/getRedirectToExamId",
      discountPercentage: "user/getDiscountPercentage",
    }),
    hasContactInfoError() {
      return (
        this.$v.profile.contactInfo.city.$anyError ||
        this.$v.profile.contactInfo.country.$anyError ||
        this.$v.profile.contactInfo.address.$anyError ||
        this.$v.profile.contactInfo.postalCode.$anyError
      );
    },
  },
  watch: {
    numberOfItems(newVal, oldVal) {
      if (oldVal == 0 && newVal != 0) this.init();
    },
  },
  mounted() {
    this.init();
    this.guestCartId = localStorage.getItem("guestCartId");
  },
  methods: {
    async init() {
      if (this.numberOfItems == 0) return;
      if (!this.isLoggedIn) return (this.loadingBilling = false);
      this.loadingBilling = true;

      if (this.itemsHasPhysicalProductItem()) this.isPhysicalProduct = true;

      this.isProfileLoading = true;
      //Todo
      //Need to use vuex here to get the profile data.
      //Need to call this API if cart have any physical book item
      const profileResponse = await getProfileService();
      if (profileResponse.error)
        return this.$displayServerResponse(profileResponse);
      this.isProfileLoading = false;

      if (
        (!profileResponse.country ||
          !profileResponse.city ||
          !profileResponse.address ||
          !profileResponse.postal_code) &&
        this.isPhysicalProduct
      ) {
        this.isAddressExist = false;
      }
      if (!this.isAddressExist && !this.different_shipping_address) {
        this.different_shipping_address = true;
      }

      // Need to refactor this code as its totally copy-paste from iu-profile
      this.profile = this.mapProfile(profileResponse);

      const response = await getPaymentMethod();

      if (response.error) return this.$displayServerResponse(response);

      this.billingInfo = response;
      this.loadingBilling = false;
      if (this.guestCartId) {
        clearGuestCart(this.guestCartId);
        localStorage.removeItem("guestCartId");
      }
    },

    mapProfile(profileResponse) {
      return {
        id: profileResponse.id,
        basicInfo: {
          firstName: profileResponse.first_name,
          lastName: profileResponse.last_name,
          gender: profileResponse.gender,
          dateOfBirth: profileResponse.date_of_birth,
          phoneNumber: profileResponse.phone_number,
          email: profileResponse.email,
          occupation: profileResponse.occupation,
        },
        contactInfo: {
          city: profileResponse.city,
          country: profileResponse.country,
          address: profileResponse.address,
          postalCode: profileResponse.postal_code,
        },
        socialInfo: {
          facebookUrl: profileResponse.facebook_url,
          snapchatUrl: profileResponse.snapchat_url,
          twitterUrl: profileResponse.twitter_url,
          instagramUrl: profileResponse.instagram_url,
          youtubeUrl: profileResponse.youtube_url,
          pinterestUrl: profileResponse.pinterest_url,
          linkedinUrl: profileResponse.linkedin_url,
        },
      };
    },

    updateField(data) {
      this.anyUpdated = true;
      this.profile[data.group][data.field] = data.value;
      this.dataChanged = true;
      if (!this.initialSave) return;
      this.$v.profile[data.group][data.field].$touch();
    },

    onRemoveItem(item) {
      this.isEnotes = false;
      this.pendingRemoveItem = item;
    },
    removeEnotes(item) {
      this.isEnotes = true;
      this.pendingRemoveItem = item;
    },
    onRemoveChild(item) {
      this.pendingRemoveItem = { ...item, isChild: true };
    },
    onAddShippingAddress(different_shipping_address) {
      this.different_shipping_address = different_shipping_address;
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

      if (!this.itemsHasPhysicalProductItem()) {
        this.isAddressExist = false;
        this.different_shipping_address = false;
        this.isPhysicalProduct = false;
      }
    },
    removebookBindingDiscount(pendingRemoveItem) {
      if (
        pendingRemoveItem.type === "physical_product" &&
        pendingRemoveItem.course_module_id
      ) {
        var newList;
        newList = this.itemList.map((item) => {
          if (item.type === "course") {
            this.updatedModules = item.items?.map((module) => {
              if (pendingRemoveItem.course_module_id == module.id) {
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
          } else if (item.type === "ebook") {
            if (pendingRemoveItem.course_module_id === item.id) {
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
      for (const item of this.itemList) {
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
      const updatedData = this.itemList.map((item) => {
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
    onChangeCard() {
      if (!this.isLoggedIn) return (this.showLoginRegister = true);
      if (this.validateShippingAddress()) return;
      this.changingCard = true;
    },
    async handleChangeCard() {
      this.closeModal();
    },
    async onPlaceOrder() {
      if (!this.isLoggedIn) return (this.showLoginRegister = true);
      if (this.validateShippingAddress()) return;
      this.isCardExist = true;
      const billingInfo =
        !this.billingInfo ||
        !this.billingInfo.card_last_four ||
        !this.billingInfo.card_brand;

      if (
        (billingInfo &&
          this.totalPrice != "0.00" &&
          this.totalDiscountedPrice !== "0.00") ||
        (this.totalPrice === "0.00" && this.isPhysicalProduct && billingInfo)
      ) {
        return this.onChangeCard();
      }

      this.onPay();
    },
    async onPay(alternatePayment) {
      let data;
      if (this.isPhysicalProduct) {
        data = this.preparePhysicalProductData(alternatePayment);
      } else {
        data = this.prepareData(alternatePayment);
      }
      this.closeModal();
      this.processing = true;

      const response = await cartCheckout(data);
      this.$displayServerResponse(response);
      this.processing = false;
      if (response.error) return;

      // TODO: will be removed in the future if not required
      // this.redirectToExamId
      //   ? this.$router.go(-1)
      //   : this.$router.replace({ name: "homepage" });
      this.$store.dispatch("cart/clear");

      // Saving data for granted access to ebooks to vuex store
      if (response.granted_access_to_ebooks != null) {
        // Save data to VueX state
        this.$store.dispatch(
          "product/fetchLectureNotes",
          response.granted_access_to_ebooks
        );
      }

      // it will be redirected to the previous route
      this.$router.go(-1);
    },
    prepareData(alternatePayment) {
      const data = {
        items: this.parseItems(),
        paymentMethod: this.parsePaymentOption(alternatePayment),
        code: this.couponCode ? this.couponCode : "",
      };
      return data;
    },
    preparePhysicalProductData(alternatePayment) {
      if (this.different_shipping_address) {
        const data = {
          items: this.parseItems(),
          different_shipping_address: this.different_shipping_address,
          shipping_country: this.profile.contactInfo.country,
          shipping_city: this.profile.contactInfo.city,
          shipping_address: this.profile.contactInfo.address,
          shipping_postal_code: this.profile.contactInfo.postalCode,
          paymentMethod: this.parsePaymentOption(alternatePayment),
          code: this.couponCode ? this.couponCode : "",
        };
        return data;
      } else if (!this.different_shipping_address) {
        const data = {
          items: this.parseItems(),
          different_shipping_address: this.different_shipping_address,
          paymentMethod: this.parsePaymentOption(alternatePayment),
          code: this.couponCode ? this.couponCode : "",
        };
        return data;
      }
    },
    parseItems() {
      let data = [];
      for (const item of this.itemList) {
        const salaryScaleDiscount = this.addSalaryScaleDiscount(item);
        if (item.type == "course" && item.is_discounted) {
          data.push({
            id: item.id,
            type: item.type,
            salaryScaleDiscount: salaryScaleDiscount,
          });
        } else if (item.type == "ebook" && item.bookBindingDiscount == 0) {
          data.push({
            id: item.id,
            type: item.type,
            bookBindingDiscount: item.bookBindingDiscount,
          });
        } else {
          data.push({ id: item.id, type: item.type });
        }
        if (item.items) {
          for (const child of item.items) {
            if (child.bookBindingDiscount === 0) {
              data.push({
                id: child.id,
                type: child.type,
                bookBindingDiscount: child.bookBindingDiscount,
              });
            } else {
              data.push({ id: child.id, type: child.type });
            }
          }
        }
      }

      return data;
    },
    parsePaymentOption(alternatePayment) {
      return alternatePayment && alternatePayment.paymentMethod
        ? {
            id: alternatePayment.paymentMethod,
            save: alternatePayment.saveDefault,
          }
        : {};
    },
    closeModal() {
      this.pendingRemoveItem = null;
      this.changingCard = false;
    },
    onLoginRegisterModalClose() {
      this.showLoginRegister = false;
    },
    addSalaryScaleDiscount(item) {
      return item.is_discounted
        ? calculateSalaryScaleDiscount(item.price, this.discountPercentage)
        : item.price;
    },
    validateShippingAddress() {
      if (this.isPhysicalProduct && this.different_shipping_address) {
        this.$v.$touch();
        return this.$v.$invalid;
      }
      return false;
    },
    itemsHasPhysicalProductItem() {
      return this.itemList.some((item) => item.type === PHYSICAL_PRODUCT);
    },
  },

  validations() {
    return {
      profile: {
        contactInfo: {
          address: {
            minLength: minLength(3),
            maxLength: maxLength(100),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
          city: {
            minLength: minLength(3),
            maxLength: maxLength(100),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
          country: {
            minLength: minLength(3),
            maxLength: maxLength(100),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
          postalCode: {
            minLength: minLength(3),
            maxLength: maxLength(20),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
        },
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.billing-info-outer {
  position: sticky;
  top: 72px;
}
.cart-title {
  border-bottom: 3px solid $lightgray;
}
</style>
