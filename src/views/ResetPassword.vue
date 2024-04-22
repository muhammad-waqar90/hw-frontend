<template>
  <div
    :class="{ 'full-height': !$isPhone }"
    class="d-flex justify-content-center"
  >
    <div class="container font-montserrat my-auto">
      <div class="row custom-container bg-white rounded-card one-edge-shadow">
        <div class="col-12 col-md-6 form-padding">
          <ResetPasswordLeftSection
            :loading="loading"
            @on-reset-password="onSubmit"
          />
        </div>
        <div v-if="!$isPhone" class="col-6 px-0">
          <ResetPasswordRightSection />
        </div>
      </div>
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
import ResetPasswordLeftSection from "@/components/Auth/ResetPasswordLeftSection";
import ResetPasswordRightSection from "@/components/Auth/ResetPasswordRightSection";
import { requestPasswordResetService } from "@/services/authService";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "ResetPassword",

  components: { ResetPasswordLeftSection, ResetPasswordRightSection },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      loading: false,
    };
  },

  methods: {
    async onSubmit(data) {
      this.loading = true;
      const response = await requestPasswordResetService(data);
      this.$displayServerResponse(response);

      if (response.error) {
        this.loading = false;
        return this.handleError(response, data);
      }

      this.$router.push({ name: "login" });
    },

    handleError(response, data) {
      if (!response.unverified) return;

      this.$store.dispatch("auth/setRegisterUsername", data.username);
      this.$router.push({
        name: "register-confirmation-link",
        params: {
          identity: "user-verificaion",
        },
      });
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
