<template>
  <div class="container font-montserrat px-3">
    <div class="row">
      <div class="col">
        <div class="bg-white rounded-card pb-4">
          <div class="p-4 text-center text-md-start">
            <h4 class="font-weight-600 color-gray mb-0">
              {{ $t("iu.deleteAccount.title") }}
            </h4>
          </div>
          <hr class="mx-4 mt-0 mb-0" />

          <div :class="$isPhone ? 'p-2' : 'p-4'">
            <div class="row">
              <div class="col-12 px-4">
                <p class="bold-black text-black">
                  {{ $t("iu.deleteAccount.areYouSure") }}
                </p>
                <div class="d-flex flex-column mb-3">
                  <div class="container-mt-outline-input">
                    <div class="material-textfield">
                      <input
                        v-model.trim.lazy="$v.inputFeedback.$model"
                        placeholder=" "
                        type="text"
                        :class="{ 'is-invalid-text': $v.inputFeedback.$error }"
                      />
                      <label>{{
                        $isPhone
                          ? $t("iu.deleteAccount.feedbackShortLabel")
                          : $t("iu.deleteAccount.feedbackLabel")
                      }}</label>
                    </div>
                  </div>
                  <template v-if="$v.inputFeedback.$error">
                    <small
                      v-if="!$v.inputFeedback.required"
                      id="passwordHelp"
                      class="form-text text-danger error"
                    >
                      {{ $t("errors.requiredFields") }}
                    </small>
                    <small
                      v-else-if="!$v.inputFeedback.minLength"
                      class="form-text text-danger error"
                    >
                      {{
                        $t("iu.deleteAccount.feedbackMinLetters", {
                          num: $v.inputFeedback.$params.minLength.min,
                        })
                      }}
                    </small>
                    <small
                      v-else-if="!$v.inputFeedback.maxLength"
                      class="form-text text-danger error"
                    >
                      {{
                        $t("iu.deleteAccount.feedbackMaxLetters", {
                          num: $v.inputFeedback.$params.maxLength.max,
                        })
                      }}
                    </small>
                    <small
                      v-else-if="!$v.inputFeedback.isSanitizeInput"
                      class="form-text text-danger error"
                    >
                      {{ $t("errors.invalidFields") }}
                    </small>
                  </template>
                </div>
                <p
                  class="bold-black text-black"
                  v-html="$t('iu.deleteAccount.instructions', { userName })"
                />
                <div class="d-flex flex-column mb-4">
                  <div class="container-mt-outline-input">
                    <div class="material-textfield">
                      <input v-model="inputUser" placeholder=" " type="text" />
                      <label>{{
                        $isPhone
                          ? $t("iu.deleteAccount.userNameShortLabel")
                          : $t("iu.deleteAccount.userNameLabel")
                      }}</label>
                    </div>
                  </div>
                </div>
                <div class="bg-red text-white rounded-card mb-4 p-3">
                  <h5 class="font-weight-600">
                    {{ $t("iu.deleteAccount.warning") }}
                  </h5>
                  <p class="mb-1">
                    {{ $t("iu.deleteAccount.warningText") }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <hr class="mx-4 mt-0 mb-0" />
          <div class="d-flex justify-content-end p-4 pb-0">
            <button
              :disabled="inputUser != userName || $v.$invalid"
              class="btn blue-btn btn-font font-weight-600 text-uppercase rounded-card px-5"
              @click="onConfirmButton"
            >
              {{ $t("iu.deleteAccount.confirm") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <portal to="out-of-app-content">
      <WarningModal
        v-if="warningModal"
        :with-confirmation-buttons="true"
        :only-confirm="true"
        :close-on-click-outside="false"
        @close-modal="warningModal = false"
        @on-confirm="deleteUser"
      >
        <span slot="body">
          {{ $t("iu.deleteAccount.modalText") }}
        </span>
      </WarningModal>
    </portal>
  </div>
</template>

<script>
import WarningModal from "@/components/Misc/WarningModal";
import { deleteUserService } from "@/services/authService";
import { validationMixin } from "vuelidate";
import { minLength, maxLength, required } from "vuelidate/lib/validators";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import toastMixin from "@/mixins/toastMixin";
import { mapGetters } from "vuex";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  name: "IuDeleteAccount",
  components: {
    WarningModal,
  },
  mixins: [apiMixin, toastMixin, validationMixin, dompurifyMixin, devicesMixin],
  data() {
    return {
      deleteUserApi: getApiState(),
      inputUser: null,
      inputFeedback: null,
      warningModal: false,
    };
  },
  computed: {
    ...mapGetters({
      userName: "user/getName",
    }),
  },
  validations: {
    inputFeedback: {
      required,
      minLength: minLength(1),
      maxLength: maxLength(10000),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
  },
  methods: {
    onConfirmButton() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.warningModal = true;
    },
    async deleteUser() {
      this.warningModal = false;
      const data = {
        feedback: this.inputFeedback,
      };
      await this.$fetchApiData(this.deleteUserApi, () =>
        deleteUserService(data)
      );
      if (!this.deleteUserApi.error) {
        this.$displaySuccessToast(this.deleteUserApi.data.message);
        await this.$store.dispatch("auth/logout", {
          blockLogoutService: true,
        });
        if (this.$route.name !== "homepage")
          this.$router.push({ name: "homepage" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.bold-black :deep(b) {
  color: $black;
}
.bg-red {
  background-color: $red;
}
.btn-font {
  font-size: 13px;
}
.is-invalid-text {
  color: $red !important;
}
</style>
