<template>
  <div class="container px-3 font-montserrat">
    <div class="row">
      <div class="col">
        <div class="bg-white rounded-card font-montserrat text-dark-gray">
          <div class="p-4 text-center text-md-start">
            <h4 class="font-weight-600 color-gray mb-0">
              {{ $t("iu.profile.labels.password.changePassword") }}
            </h4>
          </div>
          <hr class="mx-4 mt-0 mb-3" />
          <div class="p-4 row">
            <div class="mb-4" :class="{ 'col-6': !$isPhone }">
              <div class="p-4 change-password-note rounded-card text-white">
                <div class="d-flex">
                  <h5 class="font-weight-700">
                    {{ $t("iu.profile.labels.password.noteTitle") }}
                  </h5>
                </div>
                <p class="paragraph-font mb-0">
                  {{ $t("iu.profile.labels.password.noteDescription1") }}
                </p>
                <p class="paragraph-font mb-0">
                  {{ $t("iu.profile.labels.password.noteDescription2") }}
                </p>
              </div>
            </div>

            <div class="col-12 col-md-6 mb-4">
              <div class="d-flex flex-column mb-4">
                <div class="container-mt-outline-input">
                  <div class="material-textfield">
                    <input
                      v-model.trim.lazy="$v.inputCurrentPassword.$model"
                      placeholder=" "
                      :class="{
                        'is-invalid-text': $v.inputCurrentPassword.$error,
                      }"
                      maxlength="254"
                      :type="inputCurrentPasswordType"
                    />
                    <label
                      >{{
                        $t("iu.profile.labels.password.currentPassword")
                      }}*</label
                    >
                    <EyeOutline
                      v-if="inputCurrentPasswordType === 'text'"
                      class="input-eye-icon"
                      @click="inputCurrentPasswordType = 'password'"
                    />
                    <EyeOffOutline
                      v-else
                      class="input-eye-off-icon"
                      @click="inputCurrentPasswordType = 'text'"
                    />
                  </div>
                </div>
                <template v-if="$v.inputCurrentPassword.$error">
                  <small
                    v-if="!$v.inputCurrentPassword.required"
                    id="passwordHelp"
                    class="form-text text-danger error"
                  >
                    {{ $t("auth.requiredPassword") }}
                  </small>
                  <small
                    v-else-if="!$v.inputCurrentPassword.isValid"
                    class="form-text text-danger error"
                    >{{ $t("auth.password") }}
                    {{
                      $t("auth.passFormat", {
                        num: $v.inputCurrentPassword.$params.minLength.min,
                      })
                    }}
                  </small>
                </template>
              </div>
              <div class="d-flex flex-column mb-4">
                <div class="container-mt-outline-input">
                  <div class="material-textfield">
                    <input
                      v-model.trim.lazy="$v.inputNewPassword.$model"
                      placeholder=" "
                      :class="{ 'is-invalid-text': $v.inputNewPassword.$error }"
                      maxlength="254"
                      :type="inputNewPasswordType"
                    />
                    <label
                      >{{
                        $t("iu.profile.labels.password.newPassword")
                      }}*</label
                    >
                    <EyeOutline
                      v-if="inputNewPasswordType === 'text'"
                      class="input-eye-icon"
                      @click="inputNewPasswordType = 'password'"
                    />
                    <EyeOffOutline
                      v-else
                      class="input-eye-off-icon"
                      @click="inputNewPasswordType = 'text'"
                    />
                  </div>
                </div>
                <template v-if="$v.inputNewPassword.$error">
                  <small
                    v-if="!$v.inputNewPassword.required"
                    id="passwordHelp"
                    class="form-text text-danger error"
                  >
                    {{ $t("auth.requiredPassword") }}
                  </small>
                  <small
                    v-else-if="
                      !$v.inputNewPassword.differentThanCurrentPassword
                    "
                    class="text-danger"
                    >{{
                      $t("iu.profile.labels.password.differPasswords")
                    }}</small
                  >
                  <small
                    v-else-if="!$v.inputNewPassword.isValid"
                    class="form-text text-danger error"
                    >{{ $t("auth.password") }}
                    {{
                      $t("auth.passFormat", {
                        num: $v.inputNewPassword.$params.minLength.min,
                      })
                    }}
                  </small>
                </template>
              </div>
              <div class="d-flex flex-column mb-4">
                <div class="container-mt-outline-input">
                  <div class="material-textfield">
                    <input
                      v-model.trim.lazy="$v.inputConfirmNewPassword.$model"
                      placeholder=" "
                      :class="{
                        'is-invalid-text': $v.inputConfirmNewPassword.$error,
                      }"
                      maxlength="254"
                      :type="inputConfirmNewPasswordType"
                    />
                    <label
                      >{{
                        $t("iu.profile.labels.password.confirmNewPassword")
                      }}*</label
                    >
                    <EyeOutline
                      v-if="inputConfirmNewPasswordType === 'text'"
                      class="input-eye-icon"
                      @click="inputConfirmNewPasswordType = 'password'"
                    />
                    <EyeOffOutline
                      v-else
                      class="input-eye-off-icon"
                      @click="inputConfirmNewPasswordType = 'text'"
                    />
                  </div>
                </div>
                <template v-if="$v.inputConfirmNewPassword.$error">
                  <small
                    v-if="
                      !$v.inputConfirmNewPassword.required &&
                      !$v.inputNewPassword.$model
                    "
                    id="passwordHelp"
                    class="form-text text-danger error"
                  >
                    {{ $t("auth.requiredPassword") }}
                  </small>
                  <small
                    v-if="!$v.inputConfirmNewPassword.sameAsPassword"
                    id="repeatPasswordHelp"
                    class="form-text text-danger error"
                  >
                    {{ $t("auth.samePasswords") }}
                  </small>
                </template>
              </div>
              <ButtonWithLoading
                class="btn blue-btn d-block py-2 mt-3 mt-lg-2 font-weight-600 resetButton text-uppercase"
                :class="{ 'px-5': !$isPhone && !$isTablet }"
                :loading="loading"
                :disabled="!isDirty"
                @action="onResetPassword"
              >
                {{ $t("iu.profile.labels.password.changePassword") }}
              </ButtonWithLoading>
            </div>
          </div>
        </div>
      </div>
    </div>
    <portal to="out-of-app-content">
      <WarningModal
        v-if="onReset"
        :with-confirmation-buttons="true"
        :only-confirm="false"
        :hide-close-button="false"
        @close-modal="closeModal"
        @on-confirm="handleResetPassword()"
      >
        <b slot="body">
          {{ $t("modal.areYouSure") }}
        </b>
      </WarningModal>
    </portal>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import { minLength, required, sameAs, not } from "vuelidate/lib/validators";
import EyeOutline from "vue-material-design-icons/EyeOutline";
import EyeOffOutline from "vue-material-design-icons/EyeOffOutline";
import WarningModal from "@/components/Misc/WarningModal";
import { resetUserPasswordService } from "@/services/authService";
import toastMixin from "@/mixins/toastMixin";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  name: "IuChangePassword",
  components: {
    WarningModal,
    EyeOutline,
    EyeOffOutline,
    ButtonWithLoading,
  },
  mixins: [validationMixin, toastMixin, devicesMixin],
  data() {
    return {
      inputCurrentPassword: "",
      inputCurrentPasswordType: "password",
      inputNewPassword: "",
      inputNewPasswordType: "password",
      inputConfirmNewPassword: "",
      inputConfirmNewPasswordType: "password",
      onReset: false,
      loading: false,
    };
  },
  computed: {
    isDirty() {
      return this.$v.$anyDirty;
    },
  },
  validations: {
    inputCurrentPassword: {
      required,
      minLength: minLength(8),
      isValid: function (value) {
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,255}$/.test(
          value
        );
      },
    },
    inputNewPassword: {
      required,
      minLength: minLength(8),
      isValid: function (value) {
        return /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?([^\w\s]|[_])).{8,255}$/.test(
          value
        );
      },
      differentThanCurrentPassword: not(sameAs("inputCurrentPassword")),
    },
    inputConfirmNewPassword: {
      required,
      sameAsPassword: sameAs("inputNewPassword"),
    },
  },
  methods: {
    onResetPassword() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.onReset = true;
    },
    closeModal() {
      this.onReset = false;
    },
    resetForm() {
      this.$v.inputCurrentPassword.$model = "";
      this.$v.inputNewPassword.$model = "";
      this.$v.inputConfirmNewPassword.$model = "";
      this.$v.$reset();
    },
    async handleResetPassword() {
      this.loading = true;
      this.closeModal();
      const data = {
        current_password: this.inputCurrentPassword,
        password: this.inputNewPassword,
        password_confirmation: this.inputConfirmNewPassword,
      };
      const response = await resetUserPasswordService(data);
      this.loading = false;
      if (response.errors) return this.$displayError(response);

      this.resetForm();
      return this.$displaySuccessToast(response.message);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.change-password-note {
  background: $blue !important;
}
.is-invalid-text {
  color: $red !important;
}
.material-textfield input {
  padding-right: 46px;
}
.input-eye-icon {
  width: 20px;
  height: 20px;
  color: $blue;
  position: absolute;
  right: 20px;
  top: calc(50% - 12px);
  pointer-events: cursor;
}
.input-eye-off-icon {
  width: 20px;
  height: 20px;
  color: $gray;
  position: absolute;
  right: 20px;
  top: calc(50% - 12px);
  pointer-events: cursor;
}
.resetButton {
  border-radius: 20px;
  width: 100%;
}
</style>
