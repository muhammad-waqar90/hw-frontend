<template>
  <div>
    <portal to="out-of-app-content">
      <Modal
        :hide-footer="true"
        :close-on-click-outside="false"
        @close-modal="onModalClose"
      >
        <b slot="header">
          {{ getHeader }}
        </b>
        <template slot="body">
          <Login
            v-if="type == 'login'"
            :is-modal="true"
            @submit="handleLogin"
            @sign-up="showRegister"
          />
          <Register
            v-if="type == 'register'"
            :is-modal="true"
            @submit="handleRegister"
            @sign-in="showLogin"
          />
        </template>
      </Modal>
    </portal>
  </div>
</template>

<script>
import Modal from "@/components/Misc/Modal";
import Login from "@/components/Auth/LoginLeftSection";
import Register from "@/components/Auth/RegisterRightSection";

import { registerService } from "@/services/authService";

import toastMixin from "@/mixins/toastMixin";

export default {
  components: {
    Modal,
    Login,
    Register,
  },
  mixins: [toastMixin],
  data() {
    return {
      type: "login",
    };
  },
  computed: {
    getHeader() {
      return this.type == "login"
        ? this.$t("navigation.login")
        : this.$t("navigation.register");
    },
  },
  methods: {
    async handleLogin(data) {
      const response = await this.$store.dispatch("auth/login", data);
      if (response.error) return this.handleLoginError(response, data);

      await this.$store.dispatch("user/setUserData");
      this.$router.push({ name: "iu-checkout" });
    },
    handleLoginError(response, data) {
      this.$displayServerResponse(response);
      if (!response.unverified && !response.unverified_parent) return;

      if (response.unverified) return this.handleVerificationError(data);
      if (response.unverified_parent)
        return this.handleParentVerificationError(response);
    },
    handleVerificationError(data) {
      this.$store.dispatch("auth/setRegisterUsername", data.username);
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
      this.$router.push({
        name: "register-confirmation-link",
        params: {
          identity: "parent-verificaion",
        },
      });
    },
    async handleRegister(data) {
      const response = await registerService(data);

      this.$displayServerResponse(response);
      if (response.error) return;

      this.$router.push({
        name: "register-confirmation-link",
        params: {
          identity: "user-verificaion",
        },
      });
    },
    showRegister() {
      this.type = "register";
    },
    showLogin() {
      this.type = "login";
    },
    onModalClose() {
      this.$emit("modal-closed");
    },
  },
};
</script>
