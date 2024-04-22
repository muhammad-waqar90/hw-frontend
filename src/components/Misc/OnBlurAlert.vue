<template>
  <portal to="out-of-app-content">
    <Modal
      v-if="open"
      :hide-footer="true"
      :hide-header="true"
      :close-on-click-outside="false"
      class="alert-container"
      @close-modal="closeAlert"
    >
      <template slot="body">
        <h3 class="mt-3">
          {{ $t("iu.quiz.warning") }}
        </h3>
      </template>
    </Modal>
  </portal>
</template>

<script>
import Modal from "@/components/Misc/Modal";

export default {
  components: { Modal },

  props: {
    text: String,
  },

  data() {
    return {
      open: false,
      customStyle: "background-color: #e8505b; color: $white;",
    };
  },

  beforeDestroy() {
    window.removeEventListener("blur", this.handleVisibilityChange);
  },

  mounted() {
    window.addEventListener("blur", this.handleVisibilityChange);
  },

  methods: {
    handleVisibilityChange() {
      this.open = true;
    },
    closeAlert() {
      this.open = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.alert-container :deep(.modal-container) {
  background-color: $red !important;
  color: $static-white;
  div span svg {
    fill: $static-white !important;
  }
}
</style>
