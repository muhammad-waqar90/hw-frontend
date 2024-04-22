<template>
  <div
    :class="{ 'full-height': !$isPhone }"
    class="d-flex justify-content-center"
  >
    <div class="container font-montserrat my-auto">
      <div
        v-if="!tokenLoading"
        class="row custom-container bg-white rounded-card one-edge-shadow"
      >
        <div class="col-12 col-md-6 form-padding">
          <ConfirmPasswordReset :loading="loading" @on-valid-submit="submit" />
        </div>
        <div v-if="!$isPhone" class="col-6 px-0">
          <ResetPasswordRightSection />
        </div>
      </div>
      <div
        v-else
        class="row custom-container animated-loading-background rounded-card"
      ></div>
      <div class="text-center mt-3">
        <router-link
          :to="{ name: 'gu-faq-dashboard' }"
          class="text-uppercase text-white text-decoration-none font-weight-600 truncate h6"
        >
          {{ $t("auth.contactPageLink") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import ConfirmPasswordReset from "@/components/Auth/ConfirmPasswordReset";
import ResetPasswordRightSection from "@/components/Auth/ResetPasswordRightSection";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

import {
  checkPasswordResetService,
  passwordResetService,
} from "@/services/authService";

export default {
  name: "ResetPasswordConfirm",

  components: { ConfirmPasswordReset, ResetPasswordRightSection },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      loading: false,
      tokenLoading: true,
    };
  },

  async created() {
    await this.checkPasswordResetToken(this.$route.params.token);
  },

  methods: {
    async checkPasswordResetToken(token) {
      const response = await checkPasswordResetService({ token });
      if (response.error) return this.handleError(response);
      this.tokenLoading = false;
    },

    async submit(data) {
      this.$clearAllToast();
      this.loading = true;
      data.token = this.$route.params.token;
      const response = await passwordResetService(data);
      this.loading = false;
      if (response.error) return this.$displayError(response);
      this.$displayServerResponse(response);
      if (!response.error) this.$router.push({ name: "login" });
    },

    handleError(response) {
      this.$displayError(response);
      if (response.error) this.$router.push({ name: "homepage" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.custom-container {
  min-height: 605px;
}

.full-height {
  min-height: calc(95vh - 56px - 2rem);
}

.form-padding {
  padding: 3rem 4rem;
}

@media (max-width: $laptopWidth) {
  .form-padding {
    padding: 3rem 2rem;
  }
}
</style>
