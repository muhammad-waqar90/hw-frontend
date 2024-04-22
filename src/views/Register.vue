<template>
  <div
    :class="{ 'full-height': !$isPhone }"
    class="d-flex justify-content-center"
  >
    <div class="container font-montserrat my-auto">
      <div class="row custom-container bg-white rounded-card one-edge-shadow">
        <div v-if="!$isPhone" class="col-6 px-0">
          <RegisterLeftSection />
        </div>
        <div class="col-12 col-md-6 form-padding">
          <RegisterRightSection
            :toggle-reset-captcha="toggleResetCaptcha"
            :loading="loading"
            @submit="submit"
            @sign-in="handleSignIn"
          />
        </div>
      </div>
      <div class="text-center mt-3">
        <router-link
          :to="{ name: 'gu-faq-dashboard' }"
          class="text-uppercase text-center text-white text-decoration-none font-weight-600 truncate h6"
        >
          {{ $t("auth.contactPageLink") }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Vuelidate annotation
 * @property { object } $v
 */
import RegisterRightSection from "@/components/Auth/RegisterRightSection";
import { registerService } from "@/services/authService";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "RegisterCard",

  components: {
    RegisterLeftSection: () =>
      import(
        /* webpackChunkName: "RegisterLeftSectionComponent" */ "@/components/Auth/RegisterLeftSection"
      ),
    RegisterRightSection,
  },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      toggleResetCaptcha: false,
      loading: false,
    };
  },
  mounted() {
    this.saveGuestCart();
  },
  methods: {
    async submit(data) {
      this.loading = true;
      this.toggleResetCaptcha = false;
      const response = await registerService(data);

      if (response.error) {
        this.loading = false;
        return this.handleError(response);
      }

      this.$displayServerResponse(response);
      //if the requirement is that you get the code in the mail rather than the link
      this.$store.dispatch("auth/setRegisterUsername", response.username);
      this.$store.dispatch("auth/setIsParentVerified", true);
      localStorage.setItem("username", response.username);
      localStorage.setItem("isParentVerified", true);
      this.$router.push({
        name: "register-confirmation-link",
        params: {
          identity: "user-verificaion",
        },
      });
    },
    saveGuestCart() {
      if (this.$route.query.cartId) {
        localStorage.setItem("guestCartId", this.$route.query.cartId);
      }
    },
    handleSignIn() {
      this.$router.push({ name: "login" });
    },
    handleError(response) {
      this.toggleResetCaptcha = true;
      this.$displayError(response);
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
