<template>
  <section class="app-content">
    <SideNavigation />
    <Cart v-if="renderCart" />
    <GDPR v-if="showGDPR" @accept-gdpr="handleAcceptGDPR" />
    <GlobalNotificationModal
      v-if="showGNModal && !showGDPR"
      @close-gn-modal="handleCloseGNModal"
    />
    <div :style="$computedMainContentOffset">
      <div
        :class="{
          'container mt-3 px-3': !$route.meta.independentLayout,
          'container-fluid': $route.meta.independentLayout,
        }"
      >
        <div class="row">
          <div
            :class="{
              'col-12 pb-sm-1 pb-md-1 pb-lg-3': !$route.meta.noMobilePadding,
              'col-12 col-xl-9 flex-grow-1 pb-lg-0':
                !$route.meta.independentLayout,
              'mb-2 pb-0': $isPhone || $isTablet,
            }"
          >
            <slot></slot>
          </div>
          <div
            v-if="!$route.meta.independentLayout"
            :class="
              $isPhone || $isTablet
                ? 'd-flex justify-content-center'
                : 'col flex-grow-0'
            "
          >
            <IuLayoutRightSection />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SideNavigation from "@/components/IU/Navigations/SideNavigation";
import Cart from "@/components/IU/Cart/Cart";
import IuLayoutRightSection from "@/layouts/IuLayout/IuLayoutRightSection";

import navigationOffsetMixin from "@/mixins/Misc/navigationOffsetMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

import { mapGetters } from "vuex";

export default {
  name: "IuLayout",
  components: {
    SideNavigation,
    Cart,
    IuLayoutRightSection,
    GDPR: () =>
      import(/* webpackChunkName: "GDPRComponent" */ "@/components/Misc/GDPR"),
    GlobalNotificationModal: () =>
      import(
        /* webpackChunkName: "GlobalNotificationModalComponent" */ "@/components/IU/GlobalNotification/GlobalNotificationModal"
      ),
  },
  mixins: [navigationOffsetMixin, devicesMixin],
  data() {
    return {
      renderCart: false,
      closingCart: null,
      showGDPR: true,
      showGNModal: false,
    };
  },
  computed: {
    ...mapGetters({
      cartActive: "ui/getCartActive",
      GNotificationsCount: "notifications/getGNModalCount",
      userId: "user/getUserId",
    }),
  },
  watch: {
    cartActive(newVal) {
      if (this.closingCart) clearTimeout(this.closingCart);

      if (newVal) return (this.renderCart = newVal);

      this.closingCart = setTimeout(() => {
        this.renderCart = newVal;
      }, 1000);
    },
    GNotificationsCount() {
      this.showGNModal = this.GNotificationsCount > 0;
    },
  },
  mounted() {
    this.init();
    this.showGDPR = this.hasAcceptedGDPR();
    this.showGNModal = this.GNotificationsCount > 0;
  },
  methods: {
    init() {
      this.checkCart();
      this.checkCoupon();
    },
    checkCart() {
      const cart = JSON.parse(localStorage.getItem("cart"));
      if (!cart || !cart.timestamp) return;

      const diffInHours = (new Date().getTime() - cart.timestamp) / 3600000;
      if (diffInHours > 2) return localStorage.removeItem("cart");

      this.$store.dispatch("cart/setList", cart.items);
    },
    checkCoupon() {
      const couponVisible = JSON.parse(
        localStorage.getItem("isCouponComponentVisible")
      );
      const couponStatus = JSON.parse(
        localStorage.getItem("checkCouponStatus")
      );
      const couponCode = JSON.parse(localStorage.getItem("couponCode"));
      if (!couponVisible || !couponVisible.timestamp) return;
      const diffInHours =
        (new Date().getTime() - couponVisible.timestamp) / 3600000;
      if (diffInHours > 2) {
        localStorage.removeItem("couponCode");
        localStorage.removeItem("isCouponComponentVisible");
        return localStorage.removeItem("checkCouponStatus");
      }
      this.$store.dispatch(
        "cart/setCouponComponentVisibility",
        couponVisible ? couponVisible.data : false
      );
      this.$store.dispatch(
        "cart/setCouponStatus",
        couponStatus ? couponStatus.data : "emptyCoupon"
      );
      this.$store.dispatch(
        "cart/setCouponCode",
        couponCode ? couponCode.data : null
      );
    },
    hasAcceptedGDPR() {
      if (!localStorage.getItem("gdprAccepted")) return true;
      var gdprs = JSON.parse(localStorage.getItem("gdprAccepted"));
      if (gdprs.find((gdpr) => gdpr == this.userId)) return false;
      return true;
    },
    handleAcceptGDPR() {
      this.showGDPR = false;
      var gdprs = JSON.parse(localStorage.getItem("gdprAccepted"));
      if (gdprs == null) gdprs = [];
      gdprs.push(this.userId);
      localStorage.setItem("gdprAccepted", JSON.stringify(gdprs));
    },
    handleCloseGNModal() {
      this.$store.dispatch("notifications/setAllGNotificationsAsModalRead");
      this.showGNModal = false;
    },
  },
};
</script>
