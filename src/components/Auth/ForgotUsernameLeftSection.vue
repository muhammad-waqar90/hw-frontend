<template>
  <div
    class="forgotUsernameLeftSection py-2 py-md-5 d-flex flex-column justify-content-center"
  >
    <header class="pt-3 pt-md-5 pb-2">
      <span class="h2 text-dark-gray">
        {{ $t("auth.forgotUsername") }}
      </span>
      <h6 class="text-blue mt-1">
        {{ $t("auth.forgotUsernameText") }}
      </h6>
    </header>
    <form class="my-3" @submit.prevent="onSubmit">
      <div class="form-group pb-3">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model.trim.lazy="$v.inputEmail.$model"
              placeholder=" "
              :class="{ 'text-red': $v.inputEmail.$error }"
              type="email"
            />
            <label>{{ $t("auth.emailAddress") }}*</label>
          </div>
        </div>
        <template v-if="$v.inputEmail.$error">
          <small
            v-if="!$v.inputEmail.required"
            id="emailHelp"
            class="form-text text-danger error"
            >{{ $t("auth.requiredEmailAddress") }}
          </small>
          <small
            v-if="!$v.inputEmail.email"
            class="form-text text-danger error"
          >
            {{ $t("auth.emailAddress") }} {{ $t("auth.invalid") }}
          </small>
        </template>
      </div>
      <ButtonWithLoading
        class="resetButton btn blue-btn d-block px-5 py-2 mt-2 mt-lg-5"
        :loading="loading"
        :is-submit="true"
      >
        {{ $t("auth.requestUsername") }}
      </ButtonWithLoading>
    </form>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import { validationMixin } from "vuelidate";
import { email, required } from "vuelidate/lib/validators";
export default {
  name: "ForgotUsernameLeftSection",
  mixins: [validationMixin],
  components: { ButtonWithLoading },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputEmail: "",
      submitStatus: null,
    };
  },
  validations: {
    inputEmail: {
      required,
      email,
    },
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      const data = {
        email: this.inputEmail,
      };
      this.$emit("on-request-username", data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/text.scss";
.forgotUsernameLeftSection {
  font-family: "Montserrat", sans-serif;
  .h2 {
    font-weight: 600;
  }
  button.resetButton {
    border-radius: 10px;
    font-size: 20px;
    font-weight: 600;
  }
}
@media (max-width: $desktopWidth) {
  .forgotUsernameLeftSection {
    header {
      text-align: center;
    }
    .resetButton {
      width: 100%;
    }
  }
}
</style>
