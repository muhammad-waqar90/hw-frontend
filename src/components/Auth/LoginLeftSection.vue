<template>
  <form @submit.prevent="onSubmit">
    <div class="img-outer mt-2 mx-auto mx-md-0 full-width-img">
      <img :src="darkMode ? '/img/dark-logo.png' : '/img/logo.png'" />
    </div>
    <div class="mt-5">
      <div class="container-mt-outline-input">
        <div class="material-textfield">
          <input
            v-model.trim.lazy="$v.inputUsername.$model"
            placeholder=" "
            type="text"
          />
          <label>{{ $t("auth.userName") }}*</label>
        </div>
      </div>
      <template v-if="$v.inputUsername.$error">
        <small v-if="!$v.inputUsername.required" class="text-danger">
          {{ $t("auth.requiredUsername") }}
        </small>
        <small v-if="!$v.inputUsername.isSanitizeInput" class="text-danger">
          {{ $t("errors.invalidFields") }}
        </small>
      </template>
    </div>
    <div class="text-center text-md-end mt-4 mt-md-1">
      <router-link class="text-decoration-none" to="/forgot-username">
        <span class="text-blue text-decoration-none h-6">
          {{ $t("auth.forgotYourUsername") }}
        </span>
      </router-link>
    </div>

    <div class="mt-3">
      <div class="container-mt-outline-input">
        <div class="material-textfield">
          <input
            v-model.trim.lazy="$v.inputPassword.$model"
            placeholder=" "
            type="password"
          />
          <label>{{ $t("auth.password") }}*</label>
        </div>
      </div>
      <template v-if="$v.inputPassword.$error">
        <small
          v-if="!$v.inputPassword.required"
          id="passwordHelp"
          class="text-danger"
        >
          {{ $t("auth.requiredPassword") }}
        </small>
      </template>
    </div>

    <div class="text-center text-md-end mt-4 mt-md-1">
      <router-link class="text-decoration-none" to="/reset-password">
        <span class="text-blue text-decoration-none h-6">
          {{ $t("auth.forgotYourPassword") }}
        </span>
      </router-link>
    </div>

    <div class="row mt-2 mt-md-4">
      <div :class="[showSignUp ? 'col-lg-6' : 'col-lg-4']" class="col-12">
        <ButtonWithLoading
          class="submit-button btn col-12 blue-btn font-weight-600 btn-font-size py-2"
          :is-submit="true"
          :loading="loading"
        >
          {{ $t("auth.login") }}
        </ButtonWithLoading>
      </div>
      <div v-if="showSeparator" class="col-12 mt-3">
        <div class="mobileSeparator">
          <span class="mx-2 text-secondary">
            {{ $t("auth.noAccount") }}
          </span>
        </div>
      </div>
      <div v-if="showSignUp" class="col-12 col-lg-6 text-end mt-lg-0 mt-3">
        <button
          class="btn col-12 gray-btn rounded-pill font-weight-600 btn-font-size px-5 py-2 submit-button"
          @click="onSignUp"
        >
          {{ $t("auth.signUp") }}
        </button>
      </div>
    </div>
  </form>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading.vue";
import { validationMixin } from "vuelidate";
import { required } from "vuelidate/lib/validators";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import { mapGetters } from "vuex";
export default {
  name: "LoginSectionLeft",
  components: { ButtonWithLoading },
  mixins: [validationMixin, devicesMixin, toastMixin, dompurifyMixin],
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputUsername: "",
      inputPassword: "",
    };
  },
  validations: {
    inputUsername: {
      required,
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    inputPassword: {
      required,
    },
  },
  computed: {
    showSignUp() {
      return this.$isPhone || this.isModal;
    },
    showSeparator() {
      return this.$isPhone || (this.$isTablet && this.isModal);
    },
    darkMode() {
      return this.theme == "night-mode" ? true : false;
    },
    ...mapGetters({
      theme: "theme/getThemeMode",
    }),
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        this.$v.inputUsername.required &&
          this.$v.inputPassword.required &&
          this.$displayErrorToast(this.$t("errors.invalidUsernameOrPassword"));
        return;
      }
      const data = {
        username: this.inputUsername,
        password: this.inputPassword,
      };
      this.$emit("submit", data);
    },
    onSignUp() {
      this.$emit("sign-up");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.btn-font-size {
  font-size: 18px;
}
.img-outer {
  width: 220px;
}
.submit-button {
  border-radius: 10px !important;
}
//Mobile Separator
.mobileSeparator {
  display: flex;
  align-items: center;
  text-align: center;
}
.mobileSeparator::before,
.mobileSeparator::after {
  content: "";
  flex: 1;
  border-bottom: 1px solid #000;
}
.mobileSeparator:not(:empty)::before {
  margin-right: 0.25em;
}
.mobileSeparator:not(:empty)::after {
  margin-left: 0.25em;
}
</style>
