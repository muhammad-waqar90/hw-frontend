<template>
  <portal to="out-of-app-content">
    <Modal
      title="Resolve Ticket"
      :min-height="'300px'"
      @close-modal="onCancelUpdate"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to proceed with this action?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="onCancelUpdate"
          @on-confirm="onResolve"
        />
      </template>
    </Modal>
  </portal>
</template>

<script>
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";

export default {
  components: {
    Modal,
    ConfirmationButtons,
  },

  methods: {
    onResolve() {
      this.$emit("resolve-ticket");
    },
    onCancelUpdate() {
      this.$emit("on-cancel-update");
    },
  },
};
</script>
