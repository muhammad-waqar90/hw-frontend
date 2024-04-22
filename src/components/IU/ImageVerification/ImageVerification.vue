<template>
  <div class="bg-white font-montserrat rounded-card">
    <h3 class="text-center color-gray font-weight-600 mb-3">
      {{ $t("iu.imageVerification.uploadImage") }}
    </h3>
    <div
      class="d-flex flex-column flex-md-row gray-container text-start rounded-card text-size"
    >
      <div
        v-if="
          status === availableStatuses.PENDING ||
          status === availableStatuses.FAILED
        "
        class="col-12 col-md mt-4 mb-4 me-4 ps-4"
      >
        <IVinstructions />
      </div>

      <div
        class="col-10 col-md-6 col-lg-4 mx-auto position-relative py-4 px-2 px-md-5"
        @click="chooseFile"
      >
        <div
          v-if="status !== availableStatuses.PROCESSING"
          class="text-center click-below text-primary mb-2"
        >
          {{ $t("iu.imageVerification.clickBelow") }}
        </div>
        <div
          class="bg-white rounded-card shadow-sm"
          :class="{ 'shake-it': shake }"
        >
          <template
            v-if="selectedFile && status !== availableStatuses.PROCESSING"
          >
            <IVpreview
              class="clickable-div"
              :img="imgPreview"
              :upload-percentage="uploadPercentage"
            />
          </template>
          <div v-else>
            <IVpending
              v-if="status === availableStatuses.PENDING"
              :status="status"
              class="cursor-pointer clickable-div"
            />
            <IVprocessing
              v-if="status === availableStatuses.PROCESSING"
              :status="status"
            />
            <IVfailed
              v-if="status === availableStatuses.FAILED"
              :status="status"
              class="cursor-pointer clickable-div"
            />
          </div>
          <input
            v-if="status !== availableStatuses.PROCESSING"
            ref="fileUpload"
            type="file"
            style="display: none"
            accept="image/jpeg, image/jpg"
            @change="storeFileTemp"
          />
        </div>
        <template v-if="$v.selectedFile.$error">
          <small
            v-if="!$v.selectedFile.required"
            class="form-text text-danger text-center error"
          >
            {{ $t(`iu.profile.validation.profileImage.required`) }}
          </small>
          <small
            v-if="!$v.selectedFile.isImage"
            class="form-text text-danger text-center error"
          >
            {{ $t(`iu.profile.validation.profileImage.notImage`) }}
          </small>
        </template>
        <!--         <template v-if="errors.profileImage">
          <small class="form-text text-danger error">
            {{ errors.profileImage[0] }}
          </small>
        </template> -->
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import IVpending from "@/components/IU/ImageVerification/IVpending";
import IVprocessing from "@/components/IU/ImageVerification/IVprocessing";
import IVfailed from "@/components/IU/ImageVerification/IVfailed";
import IVpreview from "@/components/IU/ImageVerification/IVpreview";
import IVinstructions from "@/components/IU/ImageVerification/IVinstructions";

import * as availableStatuses from "@/dataObject/imageVerification/imageVerificationStatusData";

import toastMixin from "@/mixins/toastMixin";
import { required } from "vuelidate/lib/validators";

export default {
  components: {
    IVpending,
    IVprocessing,
    IVfailed,
    IVpreview,
    IVinstructions,
  },
  mixins: [toastMixin, validationMixin],
  props: {
    status: String,
    uploadPercentage: {
      type: Number,
      default: null,
    },
    shake: Boolean,
  },
  data() {
    return {
      availableStatuses,
      selectedFile: null,
    };
  },
  validations() {
    return {
      selectedFile: {
        required,
        isImage: (value) => {
          if (value == null) return false;
          return value.type == ("image/jpeg" || "image/jpg") ? true : false;
        },
      },
    };
  },

  methods: {
    chooseFile() {
      if (this.status === availableStatuses.PROCESSING) return;
      this.$refs.fileUpload.click();
    },
    storeFileTemp(e) {
      this.selectedFile = e.target.files[0];
      this.$v.selectedFile.$touch();
      if (this.selectedFile) {
        this.imgPreview = URL.createObjectURL(this.selectedFile);
        this.$emit("get-profile-image", this.selectedFile);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.gray-container {
  background-color: $lightgray;
}
.text-size {
  font-size: 22px;
}
.click-below {
  font-size: 14px;
}
.clickable-div:hover {
  opacity: 0.7;
  transition: 0.15s;
}

.shake-it {
  animation: shake 0.82s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%,
  90% {
    transform: translate3d(-1px, 0, 0);
  }

  20%,
  80% {
    transform: translate3d(2px, 0, 0);
  }

  30%,
  50%,
  70% {
    transform: translate3d(-4px, 0, 0);
  }

  40%,
  60% {
    transform: translate3d(4px, 0, 0);
  }
}
</style>
