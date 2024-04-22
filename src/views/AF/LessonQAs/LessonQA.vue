<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <note :size="30" class="me-2" />
        <h3 class="w-100">
          Lecture:
          <span class="fw-bold">
            {{ ticket.subject }}
          </span>
        </h3>
      </div>
      <div class="content-holder d-flex justify-content-between">
        <ticket-details
          v-if="ticket"
          :key="ticketComponentKey"
          :ticket="ticket"
          :toggle-ticketing="toggleTicketing"
          back-to="lessonQA"
          @on-confirm="submit"
        />
        <messaging
          :key="messagingComponentKey"
          class="p-3"
          :chat-enabled="
            ticket.ticket_status_id == inProgress &&
            ticket.assigned_to_current_user == true
          "
          :messages="messages"
          :toggle-scroll-bottom-messages="toggleScrollBottomMessages"
          @on-submit="replyToTicket"
          @load-more-messages="loadNextPageMessages"
        />
      </div>
    </article>
  </section>
</template>

<script>
import TicketDetails from "@/components/AF/Tickets/TicketDetails";
import Messaging from "@/components/AF/Tickets/TicketMessaging.vue";
import {
  getTicket,
  claimTicket,
  unclaimTicket,
  resolveTicket,
  updateTicketCategory,
  replyToTicket,
  saveAsLessonFaq,
} from "@/services/AF/afTicketService";
import { IN_PROGRESS } from "@/dataObject/tickets/ticketStatusData";
import toastMixin from "@/mixins/toastMixin";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import { getNextPage } from "@/services/generalService";
import { removeDuplicatesByKey } from "@/utils/generalUtils";
import Note from "vue-material-design-icons/NoteTextOutline";

export default {
  name: "LessonQA",

  components: {
    TicketDetails,
    Messaging,
    Note,
  },

  mixins: [toastMixin, permissionsMixin],

  data() {
    return {
      ticket: {},
      messages: [],
      inProgress: IN_PROGRESS,
      ticketComponentKey: 0,
      messagingComponentKey: 1,
      nextPageMessageUrl: null,
      toggleTicketing: true,
      toggleScrollBottomMessages: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      const response = await getTicket(this.$route.params.id);

      if (response.error) return this.$displayError(response);

      this.ticket = response.ticket;
      this.messages = response.messages.data.sort((a, b) => a.id - b.id);
      this.nextPageMessageUrl = response.messages.next_page_url;
      this.toggleScrollBottomMessages = !this.toggleScrollBottomMessages;
    },

    async loadNextPageMessages() {
      if (!this.nextPageMessageUrl) return;

      const response = await getNextPage(this.nextPageMessageUrl);
      if (response.error) return this.$displayError(response);

      this.messages = removeDuplicatesByKey(
        [...response.messages.data.reverse(), ...this.messages],
        "id"
      );
      this.nextPageMessageUrl = response.messages.next_page_url;
    },

    async replyToTicket(data) {
      const response = await replyToTicket(this.$route.params.id, data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.init();
      this.toggleScrollBottomMessages = !this.toggleScrollBottomMessages;
    },

    submit(data) {
      if (data.mode == "resolveTicket") {
        this.resolveTicket();
      }

      if (data.mode == "claimTicket") {
        this.claimTicket();
      }

      if (data.mode == "unclaimTicket") {
        this.unClaimTicket();
      }

      if (data.mode == "changeTicketType") {
        this.changeTicketType(data);
      }

      if (data.mode == "saveLessonFaq") {
        this.saveAsLessonFaq();
      }
    },

    async claimTicket() {
      const response = await claimTicket(this.ticket.id);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.init();
      this.toggleTicketing = !this.toggleTicketing;
    },

    async changeTicketType(data) {
      const payload = {
        categoryId: data.categoryId,
      };
      const response = await updateTicketCategory(this.ticket.id, payload);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.init();
      this.toggleTicketing = !this.toggleTicketing;
      // this.toggleScrollBottomMessages = !this.toggleScrollBottomMessages;
    },

    async saveAsLessonFaq() {
      const response = await saveAsLessonFaq(this.ticket.id);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.init();
      this.toggleTicketing = !this.toggleTicketing;
    },

    async unClaimTicket() {
      const response = await unclaimTicket(this.ticket.id);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.init();
      this.toggleTicketing = !this.toggleTicketing;
    },

    async resolveTicket() {
      const response = await resolveTicket(this.ticket.id);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.init();
      this.toggleTicketing = !this.toggleTicketing;
    },
  },
};
</script>

<style lang="scss" scoped>
.content-holder {
  > div {
    background: #fff;
    margin: 0 10px;
    border-radius: 10px;
    &.details {
      width: 35%;
    }
    &.messaging {
      width: 65%;
    }
  }
}
</style>
