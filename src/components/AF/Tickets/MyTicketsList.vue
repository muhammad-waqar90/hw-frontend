<template>
  <div
    class="col-12 p-0 position-relative overflow-auto scrollbar-blue height-fit"
  >
    <div v-if="tickets.length" class="col-12 ps-0 pb-4">
      <div v-for="ticket in tickets" :key="ticket.id" class="subtle-link m-2">
        <AdminSingleTicket
          :id="'ticket' + ticket.id"
          :ticket="ticket"
          :is-selected="selectedTicketId == ticket.id"
          @show-details="handleClickTicket"
        />
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="loadMoreTickets"
        :custom-css="observerCustomCss"
      />
      <div
        v-if="individualTicketSelect"
        class="d-flex justify-content-center my-3"
      >
        <button
          class="btn blue-btn btn-font font-weight-600 rounded-card px-3"
          @click="$emit('init-ticket-list')"
        >
          GO BACK TO ALL TICKETS
        </button>
      </div>
    </div>
    <template v-else>
      <div class="text-center">
        {{ ticketText.noTicketsFound }}
      </div>
    </template>
  </div>
</template>

<script>
import AdminSingleTicket from "@/components/AF/Tickets/AdminSingleTicket";
import Observer from "@/components/Misc/Observer";
import { ticketText } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  components: {
    AdminSingleTicket,
    Observer,
  },
  props: {
    tickets: {
      type: Array,
      default: () => [],
    },
    selectedTicketId: {
      type: [Number, String],
      default: null,
    },
    individualTicketSelect: false,
  },
  data() {
    return {
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
      showObserver: true,
      ticketText,
    };
  },
  watch: {
    tickets() {
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
  },
  methods: {
    handleClickTicket(id) {
      this.$emit("select-ticket", id);
    },
    loadMoreTickets() {
      this.$emit("load-more-tickets");
      this.showObserver = false;
    },
  },
};
</script>

<style scoped>
.height-fit {
  height: calc(100% - 90px);
}
</style>
