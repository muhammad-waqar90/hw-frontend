<template>
  <div class="container font-montserrat px-3">
    <div class="row">
      <div v-if="$v.profile" class="col">
        <div class="bg-white rounded-card">
          <div class="p-4 text-center text-md-start">
            <h4 class="font-weight-600 color-gray mb-0">
              {{ $t("iu.profile.labels.intro") }}
            </h4>
          </div>
          <hr class="mx-4 mt-0" />
          <h5
            class="text-blue mx-4 ps-1 subheader-font font-weight-600 mb-0 mt-4"
          >
            Personal Details
          </h5>

          <div ref="basicInfo" class="p-4">
            <BasicInfo
              v-if="profile && profile.id"
              :validation="$v"
              :basic-info-prop="profile.basicInfo"
              :email="profile.basicInfo.email"
              @update-field="updateField"
            />
            <LoadingProfile v-else />
          </div>
          <hr class="mx-4 mt-0" />
          <h5
            class="text-blue mx-4 ps-1 subheader-font font-weight-600 mb-0 mt-4"
          >
            Location
          </h5>
          <div ref="contactInfo" class="p-4">
            <ContactInfo
              v-if="profile && profile.id"
              :validation="$v"
              :contact-info-prop="profile.contactInfo"
              @update-field="updateField"
            />
            <LoadingProfile v-else :number-of-items="2" />
          </div>
          <hr class="mx-4" />
          <div class="p-4 text-center text-md-end">
            <ButtonWithLoading
              class="btn blue-btn rounded-pill text-uppercase font-weight-600 px-5"
              :loading="loading"
              :disabled="submitButtonDisabled"
              @action="submit"
            >
              {{ $t("iu.profile.labels.save") }}
            </ButtonWithLoading>
          </div>
        </div>
        <CertificateProfileWarning
          v-if="popupType == 'certificate'"
          :certificate-title="certificateTitle"
          @on-click="closeModalWithErrors"
        />
        <ExamProfileWarning
          v-if="popupType == 'exam'"
          @on-click="closeModalWithErrors"
        />
        <!-- <MissingAddressWarning
          v-if="popupType == 'address'"
          modal-title="Please add your address"
          @on-click="closeModalWithErrors"
        /> -->
      </div>
    </div>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import BasicInfo from "@/components/IU/Profile/BasicInfo";
import ContactInfo from "@/components/IU/Profile/ContactInfo";
import LoadingProfile from "@/components/IU/Profile/LoadingProfile";

import toastMixin from "@/mixins/toastMixin";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import dompurifyMixin from "@/mixins/dompurifyMixin";

import { getProfileService, updateProfileService } from "@/services/iuService";

export default {
  name: "IuProfileInfo",
  components: {
    ButtonWithLoading,
    BasicInfo,
    ContactInfo,
    LoadingProfile,
    CertificateProfileWarning: () =>
      import(
        /* webpackChunkName: "CertificateProfileWarningComponent" */ "@/components/IU/Profile/Modals/CertificateProfileWarning"
      ),
    ExamProfileWarning: () =>
      import(
        /* webpackChunkName: "ExamProfileWarningComponent" */ "@/components/IU/Profile/Modals/ExamProfileWarning"
      ),

    // Redirection if profile is incomplete from checkout
    // MissingAddressWarning: () =>
    //   import(
    //     /* webpackChunkname: "MissingAddressWarningComponent" */ "@/components/IU/Profile/Modals/MissingAddressWarning.vue"
    //   ),
  },

  mixins: [toastMixin, validationMixin, dompurifyMixin],
  beforeRouteLeave(to, from, next) {
    if (this.dataChanged)
      if (!window.confirm(this.$t("iu.profile.areYouSure"))) {
        return;
      }
    next();
  },

  data() {
    return {
      profile: null,
      popupType: "",
      initialSave: false,
      anyUpdated: false,
      dataChanged: false,
      loading: false,
    };
  },

  computed: {
    hasBasicInfoError() {
      return (
        this.$v.profile.basicInfo.gender.$anyError ||
        this.$v.profile.basicInfo.phoneNumber.$anyError ||
        this.$v.profile.basicInfo.occupation.$anyError
      );
    },
    hasContactInfoError() {
      return (
        this.$v.profile.contactInfo.city.$anyError ||
        this.$v.profile.contactInfo.country.$anyError ||
        this.$v.profile.contactInfo.address.$anyError ||
        this.$v.profile.contactInfo.postalCode.$anyError
      );
    },
    submitButtonDisabled() {
      if (!this.anyUpdated) return true;
      if (!this.initialSave) return false;
      if (this.loading) return true;
      return this.$v.profile.$anyError || !this.$v.profile.$anyDirty;
    },
    certificateTitle() {
      return this.$t("iu.profile.modals.profileVerification");
    },
  },

  watch: {
    profile() {
      if (this.initialSave) this.$v.$touch();
    },
  },

  mounted() {
    this.checkPopUp();
    this.init();
  },

  methods: {
    checkPopUp() {
      this.popupType = this.$route.query.redirectType;
    },

    closeModalWithErrors() {
      this.popupType = "";
      this.initialSave = true;
      this.$v.$touch();
      this.jumpToError();
    },

    async init() {
      const response = await getProfileService();

      if (response.error) return this.$displayServerResponse(response);

      this.profile = this.mapProfile(response);
    },

    mapProfile(response) {
      return {
        id: response.id,
        basicInfo: {
          firstName: response.first_name,
          lastName: response.last_name,
          gender: response.gender,
          dateOfBirth: response.date_of_birth,
          phoneNumber: response.phone_number,
          email: response.email,
          occupation: response.occupation,
        },
        contactInfo: {
          city: response.city,
          country: response.country,
          address: response.address,
          postalCode: response.postal_code,
        },
        socialInfo: {
          facebookUrl: response.facebook_url,
          snapchatUrl: response.snapchat_url,
          twitterUrl: response.twitter_url,
          instagramUrl: response.instagram_url,
          youtubeUrl: response.youtube_url,
          pinterestUrl: response.pinterest_url,
          linkedinUrl: response.linkedin_url,
        },
      };
    },

    async submit() {
      this.$v.$touch();
      this.initialSave = true;

      if (this.$v.$invalid) return this.jumpToError();

      if (this.anyUpdated == false) return;

      this.loading = true;
      const response = await updateProfileService(this.formData());
      this.loading = false;

      if (response.error) return this.$displayError(response);

      this.$displaySuccessToast(response.message);
      this.dataChanged = false;
      this.$v.$reset();
      this.handleRedirect();
    },

    formData() {
      let data = {
        ...this.profile.basicInfo,
        ...this.profile.contactInfo,
        ...this.profile.socialInfo,
      };

      let formData = new FormData();
      for (var key in data) {
        formData.append(key, data[key] ? data[key] : "");
      }

      return formData;
    },

    updateField(data) {
      this.anyUpdated = true;
      this.profile[data.group][data.field] = data.value;
      this.dataChanged = true;
      if (!this.initialSave) return;
      this.$v.profile[data.group][data.field].$touch();
    },

    handleRedirect() {
      const redirectUrl = this.$route.query.redirectUrl;

      if (redirectUrl)
        return this.$router.push({ path: redirectUrl }).catch(() => {
          this.$displayErrorToast(
            this.$t("errors.couldNotNavigateToRequestedView")
          );
        });
    },

    jumpToError() {
      if (!this.hasBasicInfoError && !this.hasContactInfoError) return;

      let yAxis;
      if (this.hasContactInfoError)
        yAxis = this.$refs.contactInfo.getBoundingClientRect().top;
      if (this.hasBasicInfoError)
        yAxis = this.$refs.basicInfo.getBoundingClientRect().top;

      window.scrollTo(0, yAxis);
    },
  },

  validations() {
    return {
      profile: {
        basicInfo: {
          gender: { required },
          phoneNumber: { required, isPhoneNumber },
          occupation: { required },
        },

        contactInfo: {
          address: {
            minLength: minLength(3),
            maxLength: maxLength(100),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
          city: {
            minLength: minLength(3),
            maxLength: maxLength(100),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
          country: {
            minLength: minLength(3),
            maxLength: maxLength(100),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
          postalCode: {
            minLength: minLength(3),
            maxLength: maxLength(20),
            required,
            isSanitizeInput: function (value) {
              return this.sanitizeInput(value);
            },
          },
        },
      },
    };
  },
};

const isPhoneNumber = (value) =>
  /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(value);
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.subheader-font {
  font-size: 16px;
}
</style>
