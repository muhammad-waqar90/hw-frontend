<template>
  <div>
    <div class="row">
      <div class="d-flex justify-content-between align-items-center">
        <p class="title font-weight-600 mb-0 h-5" :class="{ 'h-6': $isPhone }">
          {{ cardStatus ? "Update Card" : "Add Card" }}
        </p>
        <ButtonWithLoading
          class="btn blue-btn btn-font rounded-card text-uppercase font-weight-600 px-5 py-2"
          :loading="cardSetupApi.loading"
          :small-spinner="true"
          @action="updateCard"
        >
          <slot>
            {{ $t("iu.payment.save") }}
          </slot>
        </ButtonWithLoading>
      </div>
    </div>
    <hr />
    <div class="row text-dark-gray">
      <div class="col-12 col-md-8">
        <label class="ps-3"> {{ $t("iu.payment.ccNumber") }}</label>
        <div id="card-number" class="stripe-input rounded-card" />
      </div>
      <div class="col-12 col-md-4 mt-3 mt-md-0">
        <label class="ps-3">{{ $t("iu.payment.ccExpiry") }}</label>
        <div id="card-expiry" class="stripe-input rounded-card" />
      </div>
      <div class="col-12 col-md-8 mt-3">
        <div class="form-group">
          <label class="ps-3">{{ $t("iu.payment.ccHolderName") }} </label>
          <input
            id="card-holder-name"
            v-model="cardHolderName"
            type="text"
            class="form-control rounded-card stripe-input"
            :placeholder="$t('iu.payment.name')"
          />
        </div>
      </div>
      <div class="col-12 col-md-4 mt-3">
        <label class="ps-3">{{ $t("iu.payment.ccCvc") }}</label>
        <div id="card-cvc" class="stripe-input rounded-card" />
      </div>
      <div id="card-error" />
    </div>

    <!-- <button
        class="btn btn-secondary rounded-card col-12 col-sm-10 col-md-3 col-lg-2 text-uppercase font-weight-600 mx-md-2 my-2"
        :disabled="loading"
        @click="onCancel"
      >
        {{ $t("iu.payment.cancel") }}
      </button> -->
  </div>
</template>

<script>
import {
  updatePaymentMethod,
  getSetupIntent,
} from "@/services/IU/iuPaymentService";
import toastMixin from "@/mixins/toastMixin";
import { mapGetters } from "vuex";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: { ButtonWithLoading },
  mixins: [toastMixin, apiMixin, devicesMixin],
  props: {
    cardStatus: {
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
      loading: false,
      countStripInitialization: 0,
      cardSetupApi: getApiState(),
      updatePaymentApi: getApiState(),
    };
  },
  computed: {
    stripeElements() {
      return this.$stripe.elements();
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
    async updateCard() {
      try {
        this.$emit("set-processing", true);
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

        await this.$fetchApiData(
          this.updatePaymentApi,
          () =>
            updatePaymentMethod(
              this.cardSetupApi.data.setupIntent.payment_method
            ),
          []
        );
        if (this.updatePaymentApi.error || this.cardSetupApi.error) {
          return this.$emit("set-processing", false);
        } else this.$emit("update-success");
      } catch (e) {
        this.$emit("set-processing", false);
      }
    },
    /* onCancel () {
      this.$emit('on-cancel');
    } */
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.title {
  color: $darkgray;
}

.btn-font {
  font-size: 10px;
}

.stripe-input {
  box-sizing: border-box;
  height: 40px;
  padding: 10px 12px;
  border: 1px solid transparent;
  border-radius: 20px;
  background-color: $lightgray !important;
  box-shadow: 0 1px 3px 0 $white;
  -webkit-transition: box-shadow 150ms ease;
  transition: box-shadow 150ms ease;
}
input {
  &.form-control {
    &::placeholder {
      color: #757575;
    }
  }
}
// This is one of the hacks :) see UpdatePaymentInfo.vue for more info on this issue
input:-webkit-autofill,
input:-webkit-autofill:focus {
  transition: background-color 600000s 0s, color 600000s 0s;
}
</style>
