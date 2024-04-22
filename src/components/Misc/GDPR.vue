<template>
  <portal to="out-of-app-content">
    <Modal
      :hide-footer="true"
      :hide-header="true"
      :close-on-click-outside="false"
      :hide-close-button="true"
    >
      <template slot="body">
        <div class="text-center">
          <img
            class="col-8 col-md-4"
            :src="darkMode ? '/img/dark-logo.png' : '/img/logo.png'"
            alt=""
          />
          <h4 class="color-gray mt-4">
            {{ $t("iu.gdpr.privacyPolicy") }}
          </h4>
          <p class="text-light-gray mt-3 px-3">
            {{ $t("iu.gdpr.description") }}
          </p>
          <div class="mt-4">
            <button
              class="btn blue-btn rounded-pill font-weight-600 text-uppercase px-4"
              @click="acceptGdpr"
            >
              {{ $t("iu.gdpr.accept") }}
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </portal>
</template>

<script>
import Modal from "@/components/Misc/Modal";
import { mapGetters } from "vuex";
export default {
  components: {
    Modal,
  },
  computed: {
    darkMode() {
      return this.theme == "night-mode" ? true : false;
    },
    ...mapGetters({
      theme: "theme/getThemeMode",
    }),
  },
  methods: {
    acceptGdpr() {
      this.$emit("accept-gdpr");
    },
  },
};
</script>
