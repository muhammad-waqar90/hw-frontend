<template>
  <div
    :class="{ 'full-height': !$isPhone }"
    class="d-flex justify-content-center"
  >
    <div class="container font-montserrat my-auto">
      <div class="row custom-container bg-white rounded-card one-edge-shadow">
        <div class="col-12 col-md-6 form-padding">
          <LoginLeftSection
            @submit="submit"
            @sign-up="handleSignUp"
            :loading="loading"
          />
        </div>
        <div v-if="!$isPhone" class="col-6 px-0">
          <LoginRightSection />
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
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

import LoginLeftSection from "@/components/Auth/LoginLeftSection";

export default {
  components: {
    LoginLeftSection,
    LoginRightSection: () =>
      import(
        /* webpackChunkName: "LoginRightSectionComponent" */ "@/components/Auth/LoginRightSection"
      ),
  },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      loading: false,
    };
  },
  mounted() {
    this.saveGuestCart();
  },
  methods: {
    async submit(data) {
      this.loading = true;
      if (this.$route.name !== "login") this.$router.push({ name: "login" }); // dokha TODO:

      const response = await this.$store.dispatch("auth/login", data);
      if (response.error) {
        this.loading = false;
        return this.handleLoginError(response, data);
      }
      await this.$store.dispatch("user/setUserData");

      this.handleRedirect();
    },
    saveGuestCart() {
      if (this.$route.query.cartId) {
        localStorage.setItem("guestCartId", this.$route.query.cartId);
      }
    },
    handleRedirect() {
      const { redirect } = this.$route.query;
      if (redirect)
        return this.$router.push(redirect).catch(() => {
          this.$displayErrorToast(
            this.$t("errors.couldNotNavigateToRequestedView")
          );
          this.$router.push({ name: "homepage" });
        });

      this.$router.push({ name: "homepage" });
    },
    handleLoginError(response, data) {
      if (response.token && response.status == 406) {
        return this.$router.push({
          name: "restore-account",
          params: { token: response.token },
        });
      }
      this.$displayServerResponse(response);
      if (!response.unverified && !response.unverified_parent) return;

      if (response.unverified) return this.handleVerificationError(data);
      if (response.unverified_parent)
        return this.handleParentVerificationError(response);
    },
    handleVerificationError(data) {
      this.$store.dispatch("auth/setRegisterUsername", data.username);
      this.$store.dispatch("auth/setIsParentVerified", true);
      localStorage.setItem("username", data.username);
      this.$router.push({
        name: "register-confirmation-link",
        params: {
          identity: "user-verificaion",
        },
      });
    },
    handleParentVerificationError(response) {
      this.$store.dispatch("auth/setRegisterUsername", response.username);
      this.$store.dispatch("auth/setIsParentVerified", false);
      localStorage.setItem("isParentVerified", false);
      this.$router.push({
        name: "register-confirmation-link",
        params: {
          identity: "parent-verificaion",
        },
      });
    },
    handleSignUp() {
      this.$router.push({ name: "register" });
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

@media (max-width: $tabletWidth) {
  .form-padding {
    padding: 3rem 2rem;
  }
}
</style>
