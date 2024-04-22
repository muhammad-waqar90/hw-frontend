<template>
  <div
    v-if="selectedTicket"
    class="d-flex flex-column justify-content-between h-100"
  >
    <div class="row mx-0 justify-content-between border-bottom">
      <div>
        <h4>{{ selectedTicket.subject }} - {{ selectedTicket.user }}</h4>
        <h5>Category: {{ getTicketCategory }}</h5>
      </div>

      <button
        v-if="
          selectedTicket.user_id &&
          (selectedTicket.ticket_status_id == availableStatuses.IN_PROGRESS ||
            selectedTicket.ticket_status_id == availableStatuses.ON_HOLD)
        "
        class="btn btn-secondary ms-auto my-2 col-auto"
        @click="updateMode = 'resolve'"
      >
        Mark As Resolved
      </button>
      <div
        v-else-if="
          selectedTicket.ticket_status_id == availableStatuses.IN_PROGRESS ||
          selectedTicket.ticket_status_id == availableStatuses.ON_HOLD
        "
        class="tr"
      >
        <ButtonWithTooltip
          :disabled="true"
          label="Mark As Resolved"
          message="Guest user ticket will auto resolved once admin reply"
          btn-class="btn btn-secondary ms-auto my-2 col-auto"
        />
      </div>
    </div>

    <TicketMessaging
      v-if="messageList"
      :chat-enabled="
        selectedTicket.ticket_status_id == availableStatuses.IN_PROGRESS ||
        selectedTicket.ticket_status_id == availableStatuses.ON_HOLD
      "
      :messages="messageList"
      :toggle-scroll-bottom-messages="toggleScrollBottomMessages"
      :toggle-message="toggleMessage"
      :has-upload-screenshot="selectedTicket.user_id != null"
      @on-submit="replyToTicket"
      @load-more-messages="loadNextPageMessages"
    />

    <div class="d-flex flex-wrap justify-content-between mt-auto">
      <router-link
        v-if="showUserDetails"
        :to="`/af/users/${selectedTicket.user_id}`"
        class="btn col-auto orange-btn text-white my-2"
      >
        User Details
      </router-link>

      <button
        v-if="
          selectedTicket.user_id &&
          selectedTicket.ticket_status_id != availableStatuses.RESOLVED
        "
        class="btn col-auto green-btn my-2"
        @click="updateMode = 'changeCategory'"
      >
        Change Ticket Category
      </button>

      <button
        v-if="
          selectedTicket.ticket_status_id == availableStatuses.IN_PROGRESS ||
          selectedTicket.ticket_status_id == availableStatuses.ON_HOLD
        "
        class="btn col-auto btn-danger my-2"
        @click="updateMode = 'unclaim'"
      >
        Unclaim Ticket
      </button>

      <button
        v-if="selectedTicket.ticket_status_id == availableStatuses.IN_PROGRESS"
        class="btn col-auto btn-info text-white my-2"
        @click="updateMode = 'onHold'"
      >
        On Hold Ticket
      </button>
    </div>

    <ResolveTicketModalContent
      v-if="updateMode == 'resolve'"
      @resolve-ticket="resolveTicket"
      @on-cancel-update="cancelUpdateTicket"
    />
    <ChangeTicketCategoryModalContent
      v-if="updateMode == 'changeCategory'"
      :ticket="selectedTicket"
      @change-ticket-category="changeTicketCategory"
      @on-cancel-update="cancelUpdateTicket"
    />
    <UnclaimTicketModalContent
      v-if="updateMode == 'unclaim'"
      @unclaim-ticket="unclaimTicket"
      @on-cancel-update="cancelUpdateTicket"
    />
    <OnHoldTicketModalContent
      v-if="updateMode == 'onHold'"
      @on-hold-ticket="onHoldTicket"
      @on-cancel-update="cancelUpdateTicket"
    />
  </div>
  <div v-else>
    <h4 class="text-center">No selected ticket</h4>
  </div>
</template>

<script>
import TicketMessaging from "@/components/AF/Tickets/TicketMessaging";

import ResolveTicketModalContent from "@/components/AF/Tickets/Misc/ResolveTicketModalContent.vue";
import ChangeTicketCategoryModalContent from "@/components/AF/Tickets/Misc/ChangeTicketCategoryModalContent.vue";
import UnclaimTicketModalContent from "@/components/AF/Tickets/Misc/UnclaimTicketModalContent.vue";
import OnHoldTicketModalContent from "@/components/AF/Tickets/Misc/OnHoldTicketModalContent";
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";

import { getTicket, replyToTicket } from "@/services/AF/afTicketService";
import { getNextPage } from "@/services/generalService";
import { removeDuplicatesByKey } from "@/utils/generalUtils";
import {
  unclaimTicket,
  onHoldTicket,
  resolveTicket,
  updateTicketCategory,
} from "@/services/AF/afTicketService";

import * as availableCategories from "@/dataObject/tickets/ticketCategoryData";
import * as availableStatuses from "@/dataObject/tickets/ticketStatusData";

import toastMixin from "@/mixins/toastMixin";
import permissionsMixin from "@/mixins/AF/permissionsMixin";

export default {
  components: {
    TicketMessaging,
    ResolveTicketModalContent,
    ChangeTicketCategoryModalContent,
    UnclaimTicketModalContent,
    OnHoldTicketModalContent,
    ButtonWithTooltip,
  },

  mixins: [toastMixin, permissionsMixin],

  props: {
    selectedTicketId: null,
  },
  data() {
    return {
      loading: false,
      selectedTicket: null,
      messageList: null,
      nextPageMessageUrl: null,
      toggleScrollBottomMessages: false,
      toggleMessage: false,
      updateMode: "",

      availableStatuses,
      availableCategories,
    };
  },

  computed: {
    getTicketCategory() {
      return this.selectedTicket
        ? Object.keys(availableCategories).find(
            (key) =>
              availableCategories[key] == this.selectedTicket.ticket_category_id
          )
        : null;
    },
    showUserDetails() {
      return this.selectedTicket
        ? [availableCategories.REFUND, availableCategories.GDPR].includes(
            this.selectedTicket.ticket_category_id
          ) &&
            this.selectedTicket.ticket_status_id !=
              availableStatuses.RESOLVED &&
            (this.$isAbleToViewUserPurchaseHistory || this.$isGDPRManager)
        : false;
    },
  },

  watch: {
    selectedTicketId() {
      this.init();
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      if (!this.selectedTicketId) return (this.selectedTicket = null);

      this.loading = true;
      const response = await getTicket(this.selectedTicketId);
      this.loading = false;

      if (response.error) return this.$displayError(response);

      if (!response.ticket.assigned_to_current_user)
        return this.$displayErrorToast(
          "Selected ticket is not assigned to you"
        );

      this.selectedTicket = response.ticket;
      this.messageList = response.messages.data.reverse();
      this.nextPageMessageUrl = response.messages.next_page_url;
      this.toggleScrollBottomMessages = !this.toggleScrollBottomMessages;
      this.toggleMessage = !this.toggleMessage;
    },

    async loadNextPageMessages() {
      if (!this.nextPageMessageUrl) return;

      const response = await getNextPage(this.nextPageMessageUrl);
      if (response.error) return this.$displayError(response);

      this.messageList = removeDuplicatesByKey(
        [...response.messages.data.reverse(), ...this.messageList],
        "id"
      );
      this.nextPageMessageUrl = response.messages.next_page_url;
    },

    async replyToTicket(data) {
      const response = await replyToTicket(this.selectedTicket.id, data);

      if (response.error) return this.$displayError(response);

      if (!this.selectedTicket.user_id) {
        this.$emit("reset-list");
        return this.init();
      }

      response.data.message.forEach((message) =>
        this.messageList.push(message)
      );
      this.toggleMessage = !this.toggleMessage;
      this.toggleScrollBottomMessages = !this.toggleScrollBottomMessages;
    },

    async resolveTicket() {
      const response = await resolveTicket(this.selectedTicketId);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.updateMode = "";
      this.$emit("reset-list");
    },

    async changeTicketCategory(selectedCategoryId) {
      const payload = {
        categoryId: selectedCategoryId,
      };
      const response = await updateTicketCategory(
        this.selectedTicketId,
        payload
      );

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.updateMode = "";
      this.$emit("reset-list");
    },

    async unclaimTicket() {
      const response = await unclaimTicket(this.selectedTicketId);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.updateMode = "";
      this.$emit("reset-list");
    },

    async onHoldTicket() {
      const response = await onHoldTicket(this.selectedTicketId);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.updateMode = "";
      this.$emit("reset-list");
    },

    cancelUpdateTicket() {
      this.updateMode = "";
    },
  },
};
</script>
<style scoped>
.tr {
  text-align: right;
}
</style>
