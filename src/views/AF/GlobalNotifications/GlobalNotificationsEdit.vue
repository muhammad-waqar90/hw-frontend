<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Global Notification - Edit</h3>
      </div>
      <div class="py-3">
        <GlobalNotificationCreateEdit
          v-if="showEdit"
          :global-notification="globalNotification"
          mode="edit"
          @on-save="updateGlobalNotification"
          @on-change="checkHasChanged"
          @on-delete="startDeletingGlobalNotification"
        />
      </div>
      <modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete
          <b>"{{ globalNotification.title }}"</b>?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            @on-cancel="closeModal"
            @on-confirm="deleteGlobalNotification"
          />
        </template>
      </modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import GlobalNotificationCreateEdit from "@/components/AF/GlobalNotifications/GlobalNotificationCreateEdit.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import {
  getGlobalNotification,
  updateGlobalNotification,
  deleteGlobalNotification,
} from "@/services/AF/afGlobalNotificationService";
import { ACTIVE as archiveActiveStatus } from "@/dataObject/globalNotifications/archiveStatusData.js";

export default {
  name: "GlobalNotificationEdit",
  components: {
    GlobalNotificationCreateEdit,
    Modal,
    ConfirmationButtons,
  },
  mixins: [toastMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },

  data() {
    return {
      showEdit: false,
      hasChanged: false,
      globalNotification: {},
      modalMode: "",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      let response = await getGlobalNotification(this.$route.params.id);

      if (response.error) return this.$displayServerResponse(response);

      this.globalNotification = response;
      this.showEdit = true;
    },
    async updateGlobalNotification(data) {
      let response = await updateGlobalNotification(
        this.$route.params.id,
        data
      );

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({
        name: "af-global-notifications",
        query: { archiveStatus: archiveActiveStatus.value },
      });
    },
    startDeletingGlobalNotification(item) {
      this.globalNotification = item;
      this.openModal("delete");
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
      this.globalNotification = {};
    },
    async deleteGlobalNotification() {
      const response = await deleteGlobalNotification(
        this.globalNotification.id
      );

      this.$displayServerResponse(response);

      this.closeModal();

      this.hasChanged = false;
      this.$router.push({
        name: "af-global-notifications",
        query: { archiveStatus: archiveActiveStatus.value },
      });
    },

    checkHasChanged(key, value) {
      this.hasChanged = this.globalNotification[key] != value;
    },
  },
};
</script>
