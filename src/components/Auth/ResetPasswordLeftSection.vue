<template>
  <div
    class="resetPasswordLeftSection py-2 py-md-5 d-flex flex-column justify-content-center"
  >
    <header class="pt-3 pt-md-5 pb-2">
      <span class="h2 text-dark-gray">
        {{ $t("auth.forgotPassword") }}
      </span>
      <h6 class="text-blue mt-1">
        {{ $t("auth.resetPasswordText") }}
      </h6>
    </header>
    <form class="my-3" @submit.prevent="onSubmit">
      <div class="form-group pb-3">
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
          <small
            v-if="!$v.inputUsername.required"
            class="form-text text-danger error"
          >
            {{ $t("auth.requiredUsername") }}
          </small>
          <small
            v-if="!$v.inputUsername.isSanitizeInput"
            class="form-text text-danger error"
          >
            {{ $t("errors.invalidFields") }}
          </small>
        </template>
      </div>
      <ButtonWithLoading
        class="resetButton btn blue-btn d-block px-5 py-2 mt-2 mt-lg-5"
        :is-submit="true"
        :loading="loading"
      >
        {{ $t("auth.requestLink") }}
      </ButtonWithLoading>
    </form>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading.vue";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import toastMixin from "@/mixins/toastMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";
export default {
  name: "ResetPasswordLeftSection",
  components: { ButtonWithLoading },
  mixins: [validationMixin, toastMixin, dompurifyMixin],
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      inputUsername: "",
    };
  },
  validations: {
    inputUsername: {
      required,
      minLength: minLength(3),
      maxLength: maxLength(255),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
  },
  methods: {
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) {
        if (
          this.$v.inputUsername.isSanitizeInput &&
          this.$v.inputUsername.required
        )
          this.$displayErrorToast(this.$t("errors.invalidUsername"));

        return;
      }
      const data = {
        username: this.inputUsername,
      };
      this.$emit("on-reset-password", data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.resetPasswordLeftSection {
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
  .resetPasswordLeftSection {
    header {
      text-align: center;
    }
    .resetButton {
      width: 100%;
    }
  }
}
</style>
