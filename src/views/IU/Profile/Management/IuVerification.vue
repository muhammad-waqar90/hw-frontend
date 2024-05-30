<!-- eslint-disable prettier/prettier -->
<template>
  <div class="container font-montserrat" :class="$isPhone ? 'px-0' : 'px-3'">
    <div class="row">
      <div class="col">
        <div class="bg-white rounded-card">
          <div class="p-4 text-center text-md-start">
            <h4 class="font-weight-600 color-gray mb-0">
              {{ $t("iu.identityVerification.identityVerification") }}
            </h4>
          </div>
          <hr class="mx-4 mt-0" />
          <h5
            class="text-blue mx-4 ps-1 subheader-font font-weight-600 mb-0 mt-4"
          >
            {{ $t("iu.identityVerification.identityVerification") }}
          </h5>

          <div class="p-4">
            <div :class="$isPhone ? 'col' : 'row'">
              <div :class="$isPhone ? 'row' : 'col-6'">
                <div class="p-4 bg-blue rounded-card text-white">
                  <h5 class="font-weight-700">
                    {{ $t("iu.identityVerification.instructionsTitle") }}
                  </h5>
                  <p class="paragraph-font mb-0">
                    {{ $t("iu.identityVerification.instructions") }}
                    <ul class="ps-3 mb-0">
                      <li>{{ $t("iu.identityVerification.bullet1") }}</li>
                      <li>{{ $t("iu.identityVerification.bullet2") }}</li>
                      <li>{{ $t("iu.identityVerification.bullet3") }}</li>
                    </ul>
                  </p>
                </div>
              </div>
              <div v-if="identityApi.loading" :class="$isPhone ? 'row py-3' : 'col-6'">
                <LoadingVerification />
              </div>
              <div v-else :class="$isPhone ? 'row py-3' : 'col-6 d-flex'">
                <div
                  v-if="!verified"
                  class="d-flex flex-column rounded-card flex-grow-1 px-3"
                >
                  <span class="paragraph-font text-blue mb-2">{{
                    $t("iu.identityVerification.clickBox")
                  }}</span>
                  <label
                    for="file-upload"
                    class="custom-file-upload cursor-pointer"
                  >
                    <span>
                      <svg-document class="icon-small me-2" />
                      {{ fileName }}
                    </span>
                    <svg-upload class="icon-small icon-blue" />
                  </label>
                  <input
                    id="file-upload"
                    ref="fileUpload"
                    class="custom-input-file"
                    type="file"
                    accept="image/jpeg, image/jpg, image/png, application/pdf"
                    @change="storeFileTemp"
                  />
                  <span class="paragraph-font text-end mb-2 me-3 text-danger"
                    >jpg | png | pdf | max: 10MB</span
                  >
                </div>
                <div
                  v-else
                  :class="[borderColor]"
                  class="custom-border d-flex justify-content-center align-items-center flex-column flex-grow-1 rounded-card p-3"
                >
                  <svg-document
                    class="icon-large mb-3"
                    :class="[documentColor]"
                  />
                  <h5 class="text-dark-gray">{{ documentText }}</h5>
                </div>
              </div>
            </div>
          </div>

          <div
            v-if="!verified && !identityApi.loading"
            class="p-4 text-center text-md-end"
          >
            <ButtonWithLoading
            class="btn blue-btn rounded-pill text-uppercase font-weight-600 px-5"
              :loading="identityUploadApi.loading"
              :disabled="!file ? true : false || identityUploadApi.loading"
              @action="submitFile"
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
      </div>
    </div>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import LoadingVerification from "@/components/IU/Verification/LoadingVerification";
import toastMixin from "@/mixins/toastMixin";
//import { required, url, minLength, maxLength } from 'vuelidate/lib/validators'
import { updateIdentity, getIdentity } from "@/services/iuService";
import * as availableStatuses from "@/dataObject/imageVerification/imageVerificationStatusData";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import SvgDocument from "@/assets/svg/document.svg";
import SvgUpload from "@/assets/svg/upload.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "IuVerification",

  components: {
    ButtonWithLoading,
    LoadingVerification,
    CertificateProfileWarning: () =>
      import(
        /* webpackChunkName: "CertificateProfileWarningComponent" */ "@/components/IU/Profile/Modals/CertificateProfileWarning"
      ),
    ExamProfileWarning: () =>
      import(
        /* webpackChunkName: "ExamProfileWarningComponent" */ "@/components/IU/Profile/Modals/ExamProfileWarning"
      ),
    SvgDocument,
    SvgUpload,
  },

  mixins: [toastMixin, apiMixin, devicesMixin],

  beforeRouteLeave(to, from, next) {
    if (this.dataChanged)
      if (!window.confirm(this.$t("iu.profile.areYouSure"))) {
        return;
      }
    next();
  },

  data() {
    return {
      popupType: "",
      file: null,
      identityApi: getApiState(),
      identityUploadApi: getApiState(),
      availableStatuses,
    };
  },

  computed: {
    fileName() {
      return this.file ? this.file.name : "Upload Document";
    },
    status() {
      return this.identityApi.data ? this.identityApi.data.status : null;
    },
    verified() {
      return this.identityApi.data ? this.identityApi.data.verified : false;
    },
    documentColor() {
      if (this.status == availableStatuses.COMPLETED) return "icon-green";
      if (this.status == availableStatuses.FAILED) return "icon-red";
      return "icon-blue";
    },
    borderColor() {
      if (this.status == availableStatuses.COMPLETED) return "border-green";
      if (this.status == availableStatuses.FAILED) return "border-red";
      return "border-blue";
    },
    documentText() {
      if (this.status == availableStatuses.PENDING)
        return this.$t("iu.identityVerification.pending");
      if (this.status == availableStatuses.PROCESSING)
        return this.$t("iu.identityVerification.processing");
      if (this.status == availableStatuses.COMPLETED)
        return this.$t("iu.identityVerification.completed");
      if (this.status == availableStatuses.FAILED)
        return this.$t("iu.identityVerification.failed");
      return this.$t("iu.identityVerification.pending");
    },
    certificateTitle() {
      return this.$t("iu.profile.modals.identityVerification");
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
    },

    async init() {
      await this.$fetchApiData(this.identityApi, () => getIdentity());
    },

    storeFileTemp(e) {
      const file = e.target.files?.[0];
      const fileSize = (file.size / 1000) / 1000; // convert size into MB

      if(fileSize > 10) {
        this.$refs.fileUpload.value = '';
        this.$clearAllToast();
        this.$displayErrorToast(this.$t("iu.identityVerification.errors.fileSize"));
        return;
      }

      this.file = file;
    },

    async submitFile() {
      if (this.file == null) return;

      let formData = new FormData();
      formData.append("identityFile", this.file);
      await this.$fetchApiData(this.identityUploadApi, () =>
        updateIdentity(formData)
      );

      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.subheader-font {
  font-size: 16px;
}
.paragraph-font {
  font-size: 12px;
}
.bg-blue {
  background-color: $blue;
}
.custom-input-file {
  display: none;
}
.custom-file-upload {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #bfcbe0;
  fill: #bfcbe0;
  font-weight: 600;
  border: 2px solid $blue;
  border-radius: 50px;
  padding: 10px 15px;
}
.icon-blue {
  fill: $blue;
}
.icon-green {
  fill: $green;
}
.icon-red {
  fill: $red;
}
.custom-border {
  border: 2px solid $white;
}
.border-blue {
  border-color: $blue;
}
.border-green {
  border-color: $green;
}
.border-red {
  border-color: $red;
}
</style>
