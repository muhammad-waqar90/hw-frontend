<template>
  <article class="w-100">
    <div class="row py-4">
      <div class="col-12 col-md-8 col-lg-9 mt-3 mt-md-0">
        <div class="bg-white rounded-card p-3 py-4">
          <span class="cursor-pointer px-3 text-blue" @click.prevent="onBack">
            &lt; <u>Go back to user purchases</u>
          </span>

          <h5 class="text-uppercase px-3 color-gray">REVIEW REFUND ITEMS</h5>
          <div class="mt-3 px-3">
            <PurchaseItemList
              :items="selectedItemList"
              :with-refund="false"
              @on-change-item-selection="onChangeItemSelection"
            />
          </div>
        </div>
      </div>
      <div class="col-12 col-md-4 col-lg-3 mt-3 mt-md-0">
        <div class="bg-white rounded-card p-3 px-3 pt-4 billing-info-outer">
          <h5 class="text-center">User Information</h5>
          <div class="mt-4">
            <div class="row">
              <div class="col-12"><b>User name:</b> {{ user.name }}</div>
            </div>
            <div class="row">
              <div class="col-12"><b>User id:</b> {{ user.id }}</div>
            </div>
            <div class="row no-of-items">
              <div class="col-8">{{ checkoutText.noOfItems }}:</div>
              <div class="col-4 text-end">
                {{ selectedItemList.length }}
              </div>
            </div>
            <div class="row mt-2 price">
              <div class="col-5 col-sm-5 col-lg-5">
                {{ checkoutText.total }}:
              </div>
              <div class="col-7 col-sm-7 col-lg-7 text-end">
                £{{ totalAmount }}
              </div>
            </div>
            <div class="mt-3">
              <div>
                <button
                  class="btn blue-btn text-uppercase font-weight-600 rounded-pill px-4 py-2 w-100"
                  @click="refund"
                >
                  <span
                    v-if="refundsApi.loading"
                    class="spinner-border spinner-border-sm"
                  />
                  {{ refundsApi.loading ? "Refunding..." : "Refund Items" }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import PurchaseItemList from "@/components/AF/Purchases/PurchaseItemList.vue";
import { refund } from "@/services/AF/afRefundService";
import { checkoutText } from "@/dataObject/AF/afStaticTextsData.js";
import { getDecimalAmount } from "@/utils/generalUtils";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

export default {
  name: "ReviewPurchases",
  components: {
    PurchaseItemList,
  },
  mixins: [toastMixin, apiMixin],
  props: {
    selectedItemList: { type: Array },
    user: { type: Object },
  },
  data() {
    return {
      checkoutText,
      refundsApi: getApiState(),
    };
  },
  computed: {
    totalAmount() {
      return getDecimalAmount(
        this.selectedItemList.reduce((total, item) => total + item.amount, 0),
        2
      );
    },
  },
  methods: {
    onBack() {
      this.$emit("on-back-to-purchases");
    },
    onChangeItemSelection() {
      this.$emit("on-change-item-selection");
    },
    async refund() {
      if (this.user.deleted_at || this.user.restore_user)
        return this.$displayErrorToast(
          "Can not process refund request of a deleted user"
        );

      await this.$postApiData(this.refundsApi, () =>
        refund(this.user.id, this.selectedItemList)
      );

      if (this.refundsApi.error) return;

      this.$emit("on-refunded");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.text-blue {
  color: $blue;
}
.price {
  color: $blue;
  font-size: 20px;
  font-weight: bold;
}
.no-of-items {
  font-size: 20px;
  font-weight: bold;
}
</style>
