<template>
  <div>
    <div
      v-if="!profile.imageVerification.verified"
      class="d-flex flex-column flex-md-row justify-content-between"
    >
      <div class="mx-auto mx-md-3 w-100 w-md-100">
        <ImageVerification
          :status="profile.imageVerification.status"
          :upload-percentage="uploadPercentage"
          :shake="shake"
          @get-profile-image="getProfileImage"
        />
      </div>
    </div>
    <div v-else>
      <IVverified />
    </div>
  </div>
</template>

<script>
import IVverified from "@/components/IU/ImageVerification/IVverified";

export default {
  name: "UploadImage",

  components: {
    IVverified,
    ImageVerification: () =>
      import(
        /* webpackChunkName: "ImageVerificationComponent" */ "@/components/IU/ImageVerification/ImageVerification"
      ),
  },

  props: {
    profile: {
      type: Object,
      default: () => {},
    },
    uploadPercentage: {
      type: Number,
      default: null,
    },
    shake: Boolean,
  },

  methods: {
    getProfileImage(file) {
      this.$emit("get-profile-image", file);
    },
  },
};
</script>
