<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Ticket Subject - Edit</h3>
      </div>
      <div class="py-3">
        <CreateEditTicketSubject
          v-if="showEdit"
          mode="edit"
          :ticket="ticket"
          @on-save="updateTicketSubject"
          @on-change="hasChanged = true"
          @on-delete="startDeletingTicket"
        />
      </div>
      <modal
        v-if="modalMode == 'deleteTicket'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete
          <b>{{ selectedTicket.name }}</b
          >?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            @on-cancel="closeModal"
            @on-confirm="deleteTicket"
          />
        </template>
      </modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CreateEditTicketSubject from "@/components/AF/Tickets/CreateEditTicketSubject";
import {
  updateTicketSubject,
  getTicketSubject,
  deleteTicketSubject,
} from "@/services/AF/afTicketService";
import Modal from "@/components/Misc/Admin/AdminModal";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";

export default {
  name: "TicketSubjectEdit",

  components: { CreateEditTicketSubject, Modal, ConfirmationButtons },
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
      hasChanged: false,
      ticket: {},
      showEdit: false,
      selectedTicket: {},
      modalMode: "",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async updateTicketSubject(data) {
      let response = await updateTicketSubject(this.$route.params.id, data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-tickets-subjects" });
    },

    async init() {
      let response = await getTicketSubject(this.$route.params.id);

      if (response.error) return this.$displayServerResponse(response);

      this.ticket = response;
      this.showEdit = true;
    },

    startDeletingTicket(ticket) {
      this.selectedTicket = ticket;
      this.openModal("deleteTicket");
    },

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
      this.selectedTicket = {};
    },

    async deleteTicket() {
      const response = await deleteTicketSubject(this.selectedTicket.id);

      this.$displayServerResponse(response);

      this.closeModal();

      this.hasChanged = false;
      this.$router.replace({ name: "af-tickets-subjects" });
    },
  },
};
</script>
