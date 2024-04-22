<template>
  <div class="container font-montserrat px-3">
    <template v-if="currentPaymentMethodApi.loading">
      <LoadingPaymentMethod />
    </template>
    <template v-else>
      <div class="bg-white rounded-card p-4">
        <div class="d-flex justify-content-between align-items-center">
          <h5 class="title font-weight-600 mb-0">Cards</h5>
          <div :class="{ 'd-flex': $isPhone }">
            <button
              v-if="hasPaymentMethod"
              class="btn blue-border-btn btn-font rounded-card text-uppercase font-weight-600"
              :class="$isPhone ? 'px-2 py-1 me-1' : 'px-4 py-2 me-3'"
              @click="onDelete"
            >
              {{ $t("iu.payment.delete") }}
            </button>
            <button
              class="btn blue-btn btn-font rounded-card text-uppercase font-weight-600"
              :class="$isPhone ? 'px-2 py-1' : 'px-4 py-2'"
              @click="changeMode('update')"
            >
              {{
                hasPaymentMethod
                  ? $t("iu.payment.update")
                  : $t("iu.payment.add")
              }}
            </button>
          </div>
        </div>
        <hr />
        <div class="mt-3">
          <div>
            <DisplayPaymentMethod
              :payment-method="currentPaymentMethodApi"
              @update-mode="handleUpdateMode"
            />
          </div>
        </div>
      </div>

      <div v-if="mode == 'update'" class="bg-white rounded-card p-4 pb-5 mt-4">
        <div>
          <UpdatePaymentMethod
            :card-status="hasPaymentMethod"
            @set-processing="setProcessing"
            @update-success="openSuccessModal"
            @on-cancel="handleCancelUpdate"
          />
        </div>
      </div>
      <portal to="out-of-app-content">
        <WarningModal
          v-if="openDeleteModal"
          :with-confirmation-buttons="true"
          @close-modal="openDeleteModal = false"
          @on-confirm="handleDelete"
        >
          <span slot="body">
            {{ $t("iu.payment.areYouSure") }}
          </span>
        </WarningModal>
        <template v-if="processing">
          <LoadingAnimation loading-text="PROCESSING" />
        </template>
        <SuccessModal
          v-if="successModal"
          :with-confirmation-buttons="true"
          @close-modal="closeSuccessModal"
          @on-confirm="handleRedirect"
        >
          <span slot="body">
            New Card added!<br />
            Would you like to make a payment?
          </span>
        </SuccessModal>
      </portal>
    </template>
  </div>
</template>

<script>
import UpdatePaymentMethod from "@/components/IU/Payments/UpdatePaymentMethod";
import DisplayPaymentMethod from "@/components/IU/Payments/DisplayPaymentMethod";
import WarningModal from "@/components/Misc/WarningModal";
import SuccessModal from "@/components/Misc/SuccessModal";
import LoadingPaymentMethod from "@/components/IU/Payments/LoadingPaymentMethod";
import LoadingAnimation from "@/components/Misc/LoadingAnimation";

import apiMixin, { getApiState } from "@/mixins/apiMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

import {
  getPaymentMethod,
  deletePaymentMethods,
} from "@/services/IU/iuPaymentService";

export default {
  name: "IuPaymentMethod",
  components: {
    DisplayPaymentMethod,
    UpdatePaymentMethod,
    WarningModal,
    SuccessModal,
    LoadingPaymentMethod,
    LoadingAnimation,
  },
  mixins: [apiMixin, devicesMixin],
  data() {
    return {
      mode: "display",
      currentPaymentMethodApi: getApiState(),
      openDeleteModal: false,
      successModal: false,
      processing: false,
    };
  },
  computed: {
    hasPaymentMethod() {
      if (!this.currentPaymentMethodApi.data) return false;
      return (
        this.currentPaymentMethodApi.data != null &&
        this.currentPaymentMethodApi.data.card_brand != null &&
        this.currentPaymentMethodApi.data.card_last_four != null
      );
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.openDeleteModal = false;
      this.changeMode("display");
      this.currentPaymentMethodApi.data = null;
      await this.$fetchApiData(this.currentPaymentMethodApi, () =>
        getPaymentMethod()
      );

      this.processing = false;
    },
    changeMode(mode) {
      this.mode = mode;
    },
    openSuccessModal() {
      this.processing = false;
      this.successModal = true;
    },
    closeSuccessModal() {
      this.successModal = false;
      this.handleSuccessUpdate();
    },
    handleSuccessUpdate() {
      this.init();
    },
    handleRedirect() {
      this.$router.push({ name: "iu-courses" });
    },
    handleUpdateMode() {
      this.changeMode("update");
    },
    handleCancelUpdate() {
      this.changeMode("display");
    },
    onDelete() {
      this.openDeleteModal = true;
    },
    async handleDelete() {
      this.openDeleteModal = false;
      this.processing = true;
      const response = await deletePaymentMethods();
      if (response.error) return this.$displayServerResponse(response);

      this.processing = false;
      this.init();
    },
    setProcessing(value) {
      this.processing = value;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.title {
  font-size: 20px;
  color: $darkgray;
}
.btn-font {
  font-size: 10px;
}
// Todo: need to check if the style is required or not
.processing-gif {
  width: 36%;
  margin: 0 32%;
}
.processing-text {
  color: $blue;
  font-family: "Montserrat";
}
.loading-font {
  font-size: 90px;
  letter-spacing: 5px;
}
.hr-white {
  border-width: 2px;
  opacity: 1;
}
</style>
