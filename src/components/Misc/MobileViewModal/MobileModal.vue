<template>
  <Modal :hide-header="true" :hide-footer="true">
    <template #body>
      <div class="row mt-3">
        <div class="col-6 pt-4">
          <div class="col mb-3">
            <p class="font-bold heading">
              {{ $t("mobileModal.downloadApp") }}
            </p>
            <span class="lh-1 modal-description">{{
              $t("mobileModal.description")
            }}</span>
          </div>
          <div class="col mt-2">
            <button class="border-0 bg-white p-0" @click="redirectToGooglePlay">
              <googlePlayButton />
            </button>
            <br />
            <button class="border-0 bg-white p-0" @click="redirectToAppleStore">
              <appleStoreButton />
            </button>
          </div>
        </div>
        <div class="col-6 text-center">
          <img
            class="mobile-image"
            src="@/assets/mobile-phone.png"
            alt="mobile-img"
          />
        </div>
      </div>
    </template>
  </Modal>
</template>

<script>
import Modal from "@/components/Misc/Modal.vue";
import googlePlayButton from "@/assets/svg/google-play-button.svg";
import appleStoreButton from "@/assets/svg/download-on-the-apple-store.svg";

export default {
  components: {
    Modal,
    googlePlayButton,
    appleStoreButton,
  },
  methods: {
    redirectToGooglePlay() {
      window.open(process.env.VUE_APP_GOOGLE_PLAY_URL, "_blank");
    },
    redirectToAppleStore() {
      window.open(process.env.VUE_APP_APPLE_STORE_URL, "_blank");
    },
  },
};
</script>

<style lang="scss" scoped>
.mobile-image {
  width: 156px;
  height: 320px;
}
.heading {
  font-weight: 700;
  font-size: large;
  margin-bottom: 0.5rem;
}
.modal-description {
  font-size: 0.8rem;
}
</style>
