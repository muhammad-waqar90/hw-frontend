<template>
  <portal to="out-of-app-content">
    <Modal
      :min-height="'300px'"
      :hide-footer="true"
      :close-on-click-outside="false"
      :hide-close-button="true"
    >
      <template slot="header">
        <h4 class="w-100 text-center text-lg mb-0 text-dark">
          {{ $t("iu.profile.modals.title") }}
        </h4>
      </template>
      <template slot="body">
        <span>
          {{ $t("iu.profile.modals.exams") }}<br /><br />
          {{ $t("iu.profile.modals.note") }}
        </span>
        <div class="d-flex justify-content-center">
          <button
            class="btn blue-btn font-weight-600 px-5 mt-4 rounded-pill"
            @click="$emit('on-click')"
          >
            {{ $t("iu.profile.modals.ok") }}
          </button>
        </div>
      </template>
    </Modal>
  </portal>
</template>

<script>
import Modal from "@/components/Misc/Modal";

export default {
  components: {
    Modal,
  },
};
</script>
