<template>
  <div class="p-4 font-montserrat">
    <div class="row mb-3">
      <div class="col-12">
        <h5 class="text-blue header-size font-weight-600 text-uppercase">
          {{ cardTitle }}
        </h5>
      </div>
    </div>
    <div class="row color-gray">
      <div class="col-12 col-md-8">
        <label class="ps-3">{{ $t("iu.payment.ccNumber") }}</label>
        <div id="card-number" class="stripe-input rounded-card" />
      </div>
      <div class="col-12 col-md-4 mt-3 mt-md-0">
        <label class="ps-3">{{ $t("iu.payment.ccExpiry") }}</label>
        <div id="card-expiry" class="stripe-input rounded-card" />
      </div>
      <div class="col-12 col-md-8 mt-3">
        <label class="ps-3">{{ $t("iu.payment.ccHolderName") }}</label>
        <input
          id="card-holder-name"
          v-model="cardHolderName"
          type="text"
          class="form-control rounded-card stripe-input"
          :placeholder="$t('iu.payment.name')"
        />
      </div>
      <div class="col-12 col-md-4 mt-3">
        <label class="ps-3">{{ $t("iu.payment.ccCvc") }}</label>
        <div id="card-cvc" class="stripe-input rounded-card" />
      </div>
      <div id="card-error" />
    </div>
    <div class="col-12 mt-4">
      <PaymentCheckbox
        :label="$t('iu.checkout.saveCcForFuture')"
        @on-change="updateSaveDefault"
      />
    </div>
    <div class="mt-4 text-center">
      <ButtonWithLoading
        class="btn blue-btn text-uppercase font-weight-600 rounded-pill px-4 py-1 w-100"
        :loading="cardSetupApi.loading"
        @action="updateCard"
      >
        <slot>
          {{ $t("iu.checkout.pay") }}
        </slot>
      </ButtonWithLoading>
    </div>
  </div>
</template>

<script>
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import PaymentCheckbox from "@/components/Common/Checkout/PaymentCheckbox";

import { getSetupIntent } from "@/services/IU/iuPaymentService";
import { mapGetters } from "vuex";
import toastMixin from "@/mixins/toastMixin";

export default {
  components: {
    PaymentCheckbox,
    ButtonWithLoading,
  },
  mixins: [toastMixin, apiMixin],
  props: {
    isCardExist: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cardNumber: null,
      cardExpiry: null,
      cardCvc: null,
      cardHolderName: null,

      clientSecret: "",

      saveDefault: false,
      loading: false,
      countStripInitialization: 0,
      cardSetupApi: getApiState(),
    };
  },
  computed: {
    stripeElements() {
      return this.$stripe.elements();
    },
    cardTitle() {
      return this.isCardExist
        ? this.$t("iu.payment.add")
        : this.$t("iu.payment.updateCard");
    },
    ...mapGetters({
      theme: "theme/getColors",
    }),
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.cardNumber) this.cardNumber.destroy();
    if (this.cardExpiry) this.cardExpiry.destroy();
    if (this.cardCvc) this.cardCvc.destroy();
  },
  methods: {
    async init() {
      this.cardSetupApi.loading = true;
      const { client_secret } = await this.stripInitialization();
      this.clientSecret = client_secret;
      const style = {
        base: {
          color: this.theme.stripeInput,
          backgroundColor: this.theme.stripeBackground,
        },
      };
      this.cardNumber = this.stripeElements.create("cardNumber", { style });
      this.cardNumber.mount("#card-number");
      this.cardExpiry = this.stripeElements.create("cardExpiry", { style });
      this.cardExpiry.mount("#card-expiry");
      this.cardCvc = this.stripeElements.create("cardCvc", { style });
      this.cardCvc.mount("#card-cvc");
      this.cardSetupApi.loading = !(
        this.clientSecret &&
        this.cardNumber &&
        this.cardExpiry &&
        this.cardCvc
      );
    },
    async stripInitialization() {
      ++this.countStripInitialization;
      const response = await getSetupIntent();

      if (response.errors && this.countStripInitialization < 3) {
        return await this.stripInitialization();
      }

      return response;
    },
    updateCard() {
      if (this.saveDefault) return this.handleSetup();
      this.handleOneOff();
    },
    async handleSetup() {
      try {
        await this.$fetchApiData(
          this.cardSetupApi,
          () =>
            this.$stripe.confirmCardSetup(this.clientSecret, {
              payment_method: {
                card: this.cardNumber,
                billing_details: { name: this.cardHolderName },
              },
            }),
          []
        );

        if (this.cardSetupApi.data?.setupIntent?.payment_method) {
          this.$emit("pay", {
            paymentMethod: this.cardSetupApi.data.setupIntent.payment_method,
            saveDefault: true,
          });
        }
      } catch (e) {
        this.$displayErrorToast(e.message);
        this.cardSetupApi.loading = false;
      }
    },
    async handleOneOff() {
      try {
        await this.$fetchApiData(
          this.cardSetupApi,
          () =>
            this.$stripe.createPaymentMethod({
              type: "card",
              card: this.cardNumber,
              billing_details: {
                name: this.cardHolderName,
              },
            }),
          []
        );

        if (this.cardSetupApi.data?.paymentMethod?.id) {
          this.$emit("pay", {
            paymentMethod: this.cardSetupApi.data.paymentMethod.id,
            saveDefault: false,
          });
        }
      } catch (e) {
        this.$displayErrorToast(e.message);
        this.cardSetupApi.loading = false;
      }
    },
    updateSaveDefault(value) {
      this.saveDefault = value;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.header-size {
  font-size: 18px;
}

.stripe-input {
  box-sizing: border-box;
  height: 40px;
  padding: 12px 14px;
  color: $darkgray;
  background-color: $lightgray !important;
  box-shadow: 0 1px 3px 0 $white;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
  border: none;
}

input {
  &.form-control {
    &::placeholder {
      color: #757575;
    }
  }
}

// Note: The user agent style sheets of many browsers
// use !important in their :-webkit-autofill style declarations
// making them non-overridable by webpages without resorting to JavaScript hacks.
// This is one of those hacks :)
// More info: https://developer.mozilla.org/en-US/docs/Web/CSS/:autofill
// Solution: https://stackoverflow.com/questions/61083813/how-to-avoid-internal-autofill-selected-style-to-be-applied
input:-webkit-autofill,
input:-webkit-autofill:focus {
  transition: background-color 600000s 0s, color 600000s 0s;
}
</style>
