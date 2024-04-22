<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Coupon - Create</h3>
      </div>
      <div class="py-3">
        <CouponCreateEdit
          mode="create"
          :is-submitting="api.loading"
          @on-save="createCoupon"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import CouponCreateEdit from "@/components/AF/Coupon/CouponCreateEdit.vue";
import { createCoupon } from "@/services/AF/afCouponService";
import toastMixin from "@/mixins/toastMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

export default {
  name: "CouponCreate",
  components: { CouponCreateEdit },
  mixins: [apiMixin, toastMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },

  data() {
    return {
      hasChanged: false,
      api: getApiState(),
    };
  },

  methods: {
    async createCoupon(data) {
      await this.$postApiData(this.api, () => createCoupon(data));
      if (this.api.error) return;

      this.hasChanged = false;
      this.$router.push({ name: "af-coupons" });
    },
  },
};
</script>
