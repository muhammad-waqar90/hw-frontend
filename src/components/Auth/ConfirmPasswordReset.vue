<template>
  <div
    class="confirmPasswordReset h-100 py-2 py-md-4 d-flex flex-column justify-content-center"
  >
    <header class="mb-4">
      <h2 class="text-dark-gray">
        {{ $t("auth.resetPassword") }}
      </h2>
    </header>
    <form @submit.prevent="onSubmit">
      <div class="form-group">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model.trim.lazy="$v.inputPassword1.$model"
              placeholder=" "
              :class="{ 'text-red': $v.inputPassword1.$error }"
              maxlength="254"
              type="password"
            />
            <label>{{ $t("auth.newPassword") }}*</label>
          </div>
        </div>
        <template v-if="$v.inputPassword1.$error">
          <small
            v-if="!$v.inputPassword1.required"
            id="passwordHelp"
            class="form-text text-danger error"
          >
            {{ $t("auth.requiredPassword") }}
          </small>
          <small
            v-else-if="!$v.inputPassword1.isValid"
            class="form-text text-danger error"
            >{{ $t("auth.password") }}
            {{
              $t("auth.passFormat", {
                num: $v.inputPassword1.$params.minLength.min,
              })
            }}
          </small>
        </template>
      </div>
      <div class="form-group mt-4">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model.trim.lazy="$v.inputPassword2.$model"
              placeholder=" "
              :class="{ 'text-red': $v.inputPassword2.$error }"
              maxlength="254"
              type="password"
            />
            <label>{{ $t("auth.confirmNewPassword") }}*</label>
          </div>
        </div>
        <template v-if="$v.inputPassword2.$error">
          <span class="row">
            <small
              v-if="!$v.inputPassword2.required"
              id="passwordHelp"
              class="form-text text-danger error col-12"
            >
              {{ $t("auth.requiredPassword") }}
            </small>
            <small
              v-else-if="!$v.inputPassword2.sameAsPassword"
              id="repeatPasswordHelp"
              class="form-text text-danger error col-12"
            >
              {{ $t("auth.samePasswords") }}
            </small>
          </span>
        </template>
      </div>
      <ButtonWithLoading
        class="resetButton btn blue-btn d-block px-5 py-2 mt-2 mt-lg-5"
        :is-submit="true"
        :loading="loading"
      >
        {{ $t("auth.reset") }}
      </ButtonWithLoading>
    </form>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minLength, required, sameAs } from "vuelidate/lib/validators";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading.vue";

export default {
  name: "ConfirmPasswordReset",
  components: { ButtonWithLoading },
  mixins: [validationMixin],

  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      inputPassword1: "",
      inputPassword2: "",
    };
  },

  validations: {
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
  },

  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const data = {
        password: this.inputPassword1,
        password_confirmation: this.inputPassword2,
      };

      this.$emit("on-valid-submit", data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.confirmPasswordReset {
  font-family: "Montserrat", sans-serif;
  h2 {
    font-weight: 600;
  }

  button.resetButton {
    border-radius: 10px;
    font-size: 20px;
    font-weight: 600;
    position: relative;
    top: 60px;
  }
}

@media (max-width: $desktopWidth) {
  .resetPasswordSection {
    header {
      text-align: center;
    }
    button.resetButton {
      width: 100%;
    }
  }
}
</style>
