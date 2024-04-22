<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Event - Edit</h3>
      </div>
      <div class="py-3">
        <EventCreateEdit
          v-if="showEdit"
          mode="edit"
          :event="event"
          @on-save="updateEvent"
          @on-change="isChanged"
          @on-delete="startDeletingEvent"
        />
      </div>
      <modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete <b>"{{ selectedEvent.title }}"</b>?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            @on-cancel="closeModal"
            @on-confirm="deleteEvent"
          />
        </template>
      </modal>
    </article>
  </section>
</template>

<script>
import EventCreateEdit from "@/components/AF/Event/EventCreateEdit.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import {
  getEvent,
  updateEvent,
  deleteEvent,
} from "@/services/AF/afEventService";

export default {
  name: "AFEventsEdit",
  components: {
    EventCreateEdit,
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
      hasChanged: false,
      event: {},
      showEdit: false,
      selectedEvent: {},
      modalMode: "",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async updateEvent(data) {
      let response = await updateEvent(this.$route.params.id, data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-events" });
    },

    async init() {
      let response = await getEvent(this.$route.params.id);

      if (response.error) return this.$displayServerResponse(response);

      this.event = response;
      this.showEdit = true;
    },

    startDeletingEvent(item) {
      this.selectedEvent = item;
      this.openModal("delete");
    },

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
      this.selectedEvent = {};
    },

    async deleteEvent() {
      const response = await deleteEvent(this.selectedEvent.id);

      this.$displayServerResponse(response);

      this.closeModal();

      this.hasChanged = false;
      this.$router.push({ name: "af-events" });
    },

    isChanged(key, value) {
      this.hasChanged = this.event[key] != value;
    },
  },
};
</script>
