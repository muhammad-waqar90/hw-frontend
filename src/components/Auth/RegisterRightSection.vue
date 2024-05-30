<template>
  <div class="h-100 d-flex flex-column justify-content-center text-dark-gray">
    <header v-if="!isModal" class="w-100 text-start">
      <h3 class="mb-0 mb-lg-1 text-center text-lg-start">
        {{ $t("auth.register") }}
      </h3>
    </header>
    <form class="mt-2 mt-lg-3" @submit.prevent="onSubmit">
      <div class="row">
        <div class="d-flex flex-column col-12 col-sm-6 my-2">
          <div class="container-mt-outline-input">
            <div class="material-textfield">
              <input
                v-model.trim.lazy="$v.inputFirstName.$model"
                placeholder=" "
                :class="{ 'text-red': $v.inputFirstName.$error }"
                type="text"
              />
              <label>{{ $t("auth.firstName") }}*</label>
            </div>
          </div>
          <template v-if="$v.inputFirstName.$error">
            <small
              v-if="!$v.inputFirstName.required"
              id="firstNameHelp"
              class="text-danger"
              >{{ $t("auth.requiredFirstName") }}</small
            >
            <small v-else-if="!$v.inputFirstName.minLength" class="text-danger"
              >{{ $t("auth.firstName") }}
              {{
                $t(`auth.minLetters`, {
                  num: $v.inputFirstName.$params.minLength.min,
                })
              }}</small
            >
            <small v-else-if="!$v.inputFirstName.maxLength" class="text-danger"
              >{{ $t("auth.firstName") }}
              {{
                $t(`auth.maxLetters`, {
                  num: $v.inputFirstName.$params.maxLength.max,
                })
              }}</small
            >
            <small
              v-else-if="!$v.inputFirstName.isSanitizeInput"
              class="text-danger"
              >{{ $t("errors.invalidFields") }}</small
            >
          </template>
        </div>
        <div
          class="d-flex flex-column col-12 col-sm-6 my-2"
          :class="{ 'py-2': $isPhone, 'input-field-tablet': $isTablet }"
        >
          <div class="container-mt-outline-input">
            <div class="material-textfield">
              <input
                v-model.trim.lazy="$v.inputLastName.$model"
                placeholder=" "
                :class="{ 'text-red': $v.inputLastName.$error }"
                type="text"
              />
              <label>{{ $t("auth.lastName") }}*</label>
            </div>
          </div>
          <template v-if="$v.inputLastName.$error">
            <small
              v-if="!$v.inputLastName.required"
              id="lastNameHelp"
              class="text-danger"
              >{{ $t("auth.requiredLastName") }}</small
            >
            <small v-else-if="!$v.inputLastName.minLength" class="text-danger"
              >{{ $t("auth.lastName") }}
              {{
                $t(`auth.minLetters`, {
                  num: $v.inputLastName.$params.minLength.min,
                })
              }}</small
            >
            <small v-else-if="!$v.inputLastName.maxLength" class="text-danger"
              >{{ $t("auth.lastName") }}
              {{
                $t(`auth.maxLetters`, {
                  num: $v.inputLastName.$params.maxLength.max,
                })
              }}</small
            >
            <small
              v-else-if="!$v.inputLastName.isSanitizeInput"
              class="text-danger"
              >{{ $t("errors.invalidFields") }}</small
            >
          </template>
        </div>
      </div>
      <div class="row">
        <div class="d-flex flex-column col-12 col-sm-6 my-2">
          <div class="container-mt-outline-input">
            <div class="material-textfield">
              <input
                v-model.trim.lazy="$v.inputEmail.$model"
                placeholder=" "
                :class="{ 'text-red': $v.inputEmail.$error }"
                type="email"
              />
              <label>{{ $t("auth.signupEmail") }}*</label>
            </div>
          </div>
          <template v-if="$v.inputEmail.$error">
            <small
              v-if="!$v.inputEmail.required"
              id="emailHelp"
              class="text-danger"
              >{{ $t("auth.requiredEmailAddress") }}</small
            >
            <small v-if="!$v.inputEmail.email" class="text-danger">{{
              $t("auth.emailInvalid")
            }}</small>
          </template>
        </div>
        <div
          class="d-flex flex-column col-12 col-sm-6 my-2"
          :class="{ 'py-2': $isPhone, 'input-field-tablet': $isTablet }"
        >
          <div class="container-mt-outline-input">
            <div class="material-textfield">
              <input
                v-model.trim.lazy="$v.dateOfBirth.$model"
                placeholder=" "
                type="date"
                :min="minDate"
                :max="maxDate"
              />
              <label>{{ $t("auth.dateOfBirth") }}*</label>
            </div>
          </div>
          <template v-if="$v.dateOfBirth.$error">
            <small
              v-if="!$v.dateOfBirth.required"
              id="dateOfBirthHelp"
              class="text-danger"
              >{{ $t("auth.dobRequired") }}</small
            >
          </template>
        </div>
      </div>
      <div v-if="showParentEmailField" class="row">
        <div
          class="d-flex flex-column col-12 my-2"
          :class="{ 'pb-2': $isPhone }"
        >
          <div class="container-mt-outline-input">
            <div class="material-textfield">
              <input
                v-model.trim.lazy="$v.parentEmailAddress.$model"
                placeholder=" "
                :class="{ 'text-red': $v.parentEmailAddress.$error }"
                type="email"
              />
              <label>{{ $t("auth.parentEmailAddress") }}*</label>
            </div>
          </div>
          <template v-if="$v.parentEmailAddress.$error">
            <small
              v-if="!$v.parentEmailAddress.differentThanEmail"
              class="text-danger"
              >{{ $t("auth.parentEmailSame") }}</small
            >
            <small
              v-else-if="!$v.parentEmailAddress.required"
              class="text-danger"
              >{{ $t("auth.parentEmailAddressRequired") }}</small
            >
            <small
              v-else-if="!$v.parentEmailAddress.email"
              class="text-danger"
              >{{ $t("auth.parentEmailInvalid") }}</small
            >
          </template>
        </div>
      </div>
      <div class="row">
        <div class="d-flex flex-column col-12 col-sm-6 my-2">
          <div class="container-mt-outline-input">
            <div class="material-textfield">
              <input
                v-model.trim.lazy="$v.inputPassword1.$model"
                placeholder=" "
                :class="{ 'text-red': $v.inputPassword1.$error }"
                maxlength="254"
                type="password"
              />
              <label>{{ $t("auth.password") }}*</label>
            </div>
          </div>
          <template v-if="$v.inputPassword1.$error">
            <small
              v-if="!$v.inputPassword1.required"
              id="passwordHelp"
              class="text-danger"
              >{{ $t("auth.requiredPassword") }}</small
            >
            <small v-else-if="!$v.inputPassword1.isValid" class="text-danger"
              >{{ $t("auth.password") }}
              {{
                $t(`auth.passFormat`, {
                  num: $v.inputPassword1.$params.minLength.min,
                })
              }}</small
            >
          </template>
        </div>
        <div
          class="d-flex flex-column col-12 col-sm-6 my-2"
          :class="{ 'py-2': $isPhone, 'input-field-tablet': $isTablet }"
        >
          <div class="container-mt-outline-input">
            <div class="material-textfield">
              <input
                v-model.trim.lazy="$v.inputPassword2.$model"
                placeholder=" "
                :class="{ 'text-red': $v.inputPassword2.$error }"
                maxlength="254"
                type="password"
              />
              <label>{{ $t("auth.confirmPassword") }}*</label>
            </div>
          </div>
          <template v-if="$v.inputPassword2.$error">
            <small
              v-if="!$v.inputPassword2.required"
              id="confirmPasswordHelp"
              class="text-danger"
              >{{ $t("auth.requiredConfirmPassword") }}</small
            >
            <small
              v-else-if="!$v.inputPassword2.sameAsPassword"
              id="confirmPasswordHelp"
              class="text-danger"
              >{{ $t("auth.samePasswords") }}</small
            >
          </template>
        </div>
      </div>
      <div class="row my-2">
        <div class="col-12 mb-3">
          <div
            class="d-flex align-items-center cursor-pointer width-fit"
            @click="communicationAccepted = !communicationAccepted"
          >
            <div
              class="custom-checkbox d-flex justify-content-center align-items-center flex-shrink-0"
            >
              <svg-check v-if="communicationAccepted" class="icon" />
            </div>
            <small class="ms-2 position-static line-height-12">{{
              $t("auth.newsLabel")
            }}</small>
          </div>
        </div>
        <div class="col-12 mb-3">
          <div class="d-flex align-items-center cursor-pointer width-fit">
            <div
              class="custom-checkbox d-flex justify-content-center align-items-center flex-shrink-0"
              @click="termsAndConditionsAccepted = !termsAndConditionsAccepted"
            >
              <svg-check v-if="termsAndConditionsAccepted" class="icon" />
            </div>
            <small class="ms-2">
              <span
                @click="
                  termsAndConditionsAccepted = !termsAndConditionsAccepted
                "
              >
                {{ $t("auth.tncLabel") }}
              </span>
              <span class="tnc" @click="openTermsAndConditions">
                <span>{{ $t("auth.tncs") }}</span>
              </span>
              &
              <span class="tnc" @click="openPrivacyPolicy">
                <span>{{ $t("auth.privacy") }}</span>
              </span>
            </small>
          </div>
          <small
            v-if="
              $v.termsAndConditionsAccepted.$error &&
              !$v.termsAndConditionsAccepted.isValid
            "
            class="text-danger"
            >{{ $t("auth.requiredTnc") }}</small
          >
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <h-captcha
            :toggle-reset-captcha="toggleResetCaptcha"
            @on-verify="onCaptchaVerify"
            @on-expired="onCaptchaExpired"
          />
          <small
            v-if="
              $v.captchaVerification.$error && !$v.captchaVerification.isValid
            "
            class="text-danger"
            >{{ $t("auth.requiredCaptcha") }}</small
          >
        </div>
      </div>
      <div class="row mt-2 mt-md-2">
        <div class="col-12">
          <ButtonWithLoading
            class="btn blue-btn d-block px-4 py-2 registerButton"
            :is-submit="true"
            :disabled="!isDirty"
            :loading="loading"
          >
            {{ $t("auth.register") }}
          </ButtonWithLoading>
        </div>
        <div v-if="showSeparator" class="col-12 mt-3">
          <div class="mobileSeparator">
            <span class="mx-2 text-dark-gray">
              {{ $t("auth.alreadyRegistered") }}
            </span>
          </div>
        </div>
        <div v-if="showSignIn" class="col-12 col-lg-6 text-end mt-lg-0 mt-3">
          <div
            class="alreadyRegistered text-dark-gray btn px-5 py-2"
            @click="onSignIn"
          >
            {{ $t("auth.login") }}
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading.vue";
import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { mapGetters } from "vuex";
import { subYears, differenceInYears } from "date-fns";
import HCaptcha from "@/components/Common/HCaptcha/HCaptcha.vue";
import {
  required,
  minLength,
  maxLength,
  email,
  sameAs,
  not,
} from "vuelidate/lib/validators";
import SvgCheck from "@/assets/svg/check.svg";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  name: "RegisterRightSection",
  components: {
    ButtonWithLoading,
    HCaptcha,
    SvgCheck,
  },
  mixins: [validationMixin, toastMixin, devicesMixin, dompurifyMixin],
  validations() {
    const validation = {
      inputFirstName: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      inputLastName: {
        required,
        minLength: minLength(2),
        maxLength: maxLength(20),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      inputEmail: {
        required,
        email,
      },
      inputPassword1: {
        required,
        minLength: minLength(8),
        isValid: function (value) {
          return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,255}$/.test(
            value
          );
        },
      },
      inputPassword2: {
        required,
        sameAsPassword: sameAs("inputPassword1"),
      },
      dateOfBirth: {
        required,
      },
      captchaVerification: {
        isValid: (value) => {
          return value === true;
        },
      },
      termsAndConditionsAccepted: {
        isValid: (value) => {
          return value === true;
        },
      },
    };
    if (this.showParentEmailField)
      validation.parentEmailAddress = {
        required,
        email,
        differentThanEmail: not(sameAs("inputEmail")),
      };
    return validation;
  },
  props: {
    isModal: {
      type: Boolean,
      default: false,
    },
    toggleResetCaptcha: {
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
      inputFirstName: "",
      inputLastName: "",
      inputEmail: "",
      confirmEmail: "",
      inputPassword1: "",
      inputPassword2: "",
      check: false,
      dateOfBirth: "",
      minDate: "",
      maxDate: "",
      parentEmailAddress: "",
      captchaVerification: false,
      captchaToken: "",
      communicationAccepted: false,
      termsAndConditionsAccepted: false,
      termsAndConditionsModal: false,
    };
  },
  computed: {
    showParentEmailField() {
      if (!this.dateOfBirth) return false;
      return differenceInYears(new Date(), new Date(this.dateOfBirth)) < 13;
    },
    showSignIn() {
      return this.$isPhone || this.isModal;
    },
    showSeparator() {
      return this.$isPhone || (this.$isTablet && this.isModal);
    },
    modeColor() {
      return this.theme == "night-mode" ? "dark" : "light";
    },
    isDirty() {
      return this.$v.$anyDirty;
    },
    ...mapGetters({
      theme: "theme/getThemeMode",
    }),
  },
  watch: {
    toggleResetCaptcha(val) {
      val && (this.captchaVerification = false);
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.minDate = subYears(new Date(), 100).toISOString().split("T")[0];
      this.maxDate = subYears(new Date(), 1).toISOString().split("T")[0];
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$v.$reset();
      const data = {
        first_name: this.inputFirstName,
        last_name: this.inputLastName,
        email: this.inputEmail,
        password: this.inputPassword1,
        password_confirmation: this.inputPassword2,
        dateOfBirth: this.dateOfBirth,
        parentEmailAddress: this.parentEmailAddress,
        captchaToken: this.captchaToken,
        communicationAccepted: this.communicationAccepted,
        termsAndConditionsAccepted: this.termsAndConditionsAccepted,
      };
      this.$emit("submit", data);
    },
    onSignIn() {
      this.$emit("sign-in");
    },
    onCaptchaVerify(token) {
      this.captchaVerification = true;
      this.captchaToken = token;
    },
    onCaptchaExpired() {
      this.captchaVerification = false;
    },
    openTermsAndConditions() {
      window.open(process.env.VUE_APP_TERMS_LINK, "_blank");
    },
    openPrivacyPolicy() {
      window.open(process.env.VUE_APP_PRIVACY_LINK, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/text.scss";
h3 {
  font-weight: 600;
}
.input-field-tablet {
  padding: 0px 10px 0px 0px;
}
.container-mt-outline-input {
  height: fit-content !important;
}
button.registerButton {
  border-radius: 10px;
  font-size: 18px;
  font-weight: 600;
  float: right;
}
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
.line-height-12 {
  line-height: 12px;
}
.alreadyRegistered {
  display: inline-block;
  border-radius: 10px;
  white-space: nowrap;
  font-weight: 600;
  font-size: 20px;
  border: 1px solid #ccc;
  background: rgb(188 196 215 / 40%);
}
.custom-checkbox {
  height: 24px;
  width: 24px;
  border: 1px solid $blue;
  border-radius: 6px;
}
.icon {
  height: 14px;
  width: 14px;
  fill: $blue;
}
.tnc {
  color: $orange;
  text-decoration: underline;
  font-weight: 600;
  p {
    font-size: 12px;
    margin-bottom: 0;
  }
}
.width-fit {
  width: fit-content;
}
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-calendar-picker-indicator {
  filter: $iconFilter;
}
@media (max-width: $laptopWidth) {
  button.registerButton {
    width: 100%;
  }
  small {
    font-size: 60%;
  }
  input[type="date"]::-webkit-inner-spin-button,
  input[type="date"]::-webkit-calendar-picker-indicator {
    display: none;
    -webkit-appearance: none;
  }
  .alreadyRegistered {
    width: 100%;
  }
}
</style>
