<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Coupon - Edit</h3>
      </div>
      <div class="py-3">
        <CouponCreateEdit
          v-if="api.data"
          mode="edit"
          :is-submitting="api.loading"
          :coupon="api.data"
          @on-save="updateCoupon"
          @on-change="hasChanged"
        />
      </div>
    </article>
  </section>
</template>

<script>
import CouponCreateEdit from "@/components/AF/Coupon/CouponCreateEdit.vue";
import { getCoupon, updateCoupon } from "@/services/AF/afCouponService";
import toastMixin from "@/mixins/toastMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

export default {
  name: "CouponEdit",
  components: { CouponCreateEdit },
  mixins: [apiMixin, toastMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasCouponChanged)
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
      hasCouponChanged: false,
      api: getApiState(),
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(this.api, () =>
        getCoupon(this.$route.params.id)
      );
    },

    async updateCoupon(data) {
      await this.$postApiData(this.api, () =>
        updateCoupon(this.$route.params.id, data)
      );
      if (this.api.error) return;

      this.hasCouponChanged = false;
      this.$router.push({ name: "af-coupons" });
    },

    hasChanged(key, value) {
      this.hasCouponChanged = this.api.data[key] != value;
    },
  },
};
</script>
