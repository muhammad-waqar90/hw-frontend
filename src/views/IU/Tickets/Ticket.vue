<template>
  <div class="px-4 pt-4 pb-3 container-fluid h-100">
    <template v-if="ticket && !ticketNotFound">
      <div class="row">
        <div
          class="col-12 col-md-6 text-center text-md-start position-relative"
        >
          <div v-if="$isMobile" class="arrow-outer">
            <ChevronLeftCircle
              class="cursor-pointer"
              :size="29"
              fill-color="#4D4D4D"
              @click="onBack"
            />
          </div>
          <h4
            class="px-lg-0 color-gray mt-lg-0"
            :class="$isMobile && !$isPhone ? 'mt-5' : 'px-4'"
          >
            {{ ticket.subject }}
          </h4>
        </div>
        <div
          class="col-12 col-md-6 text-center text-md-end mt-lg-0"
          :class="$isMobile && !$isPhone ? 'pt-5' : 'mt-3'"
        >
          <span
            v-if="ticket.ticket_status_id != availableStatuses.RESOLVED"
            class="rounded-pill ticket-resolved-button text-white px-4 cursor-pointer truncate py-2 py-lg-1 d-inline-block"
            @click="onResolveTicket"
          >
            {{ $t("iu.ticket.markAsResolved") }}
          </span>
          <span
            v-if="ticket.ticket_status_id == availableStatuses.RESOLVED"
            class="rounded-pill ticket-reopen-button text-white px-4 cursor-pointer truncate py-2 py-lg-1 d-inline-block"
            @click="onReopenTicket"
          >
            {{ $t("iu.ticket.reopenTicket") }}
          </span>
        </div>
      </div>
      <hr />
      <div class="mt-2 mb-2 pb-2 pt-2 ticket-messages-outer">
        <TicketMessageList
          :message-list="messageList"
          :toggle-scroll-bottom-messages="toggleScrollBottomMessages"
          @load-more-messages="loadNextPageMessages"
        />
      </div>
      <hr />
      <div
        v-if="ticket.ticket_status_id != availableStatuses.RESOLVED"
        class="mt-2"
      >
        <TicketSendMessage
          :reset-message="resetMessage"
          @send-message="sendMessage"
          @set-data-changed="setDataChanged"
        />
      </div>
    </template>
    <template v-else-if="ticketNotFound">
      <div
        class="d-flex flex-column align-items-center justify-content-center no-tickets-found pt-5 h-100"
      >
        <div class="bg-gray full-rounded p-4 mb-4">
          <svg-support-bubble class="icon-size" />
        </div>
        <h4 :class="$isTablet ? 'px-1' : 'px-5'">
          {{ $t("iu.ticket.noTicketsFound") }}
        </h4>
        <div v-if="$isMobile && selectedTicketId" class="arrow-outer p-3">
          <ChevronLeftCircle
            class="cursor-pointer"
            :size="29"
            fill-color="#4D4D4D"
            @click="onBack"
          />
        </div>
      </div>
    </template>
    <template v-else-if="loading">
      <div class="h-100 pt-5">
        <LoadingMessageList />
      </div>
    </template>
    <portal to="out-of-app-content">
      <Modal
        v-if="modalOpened"
        :with-confirmation-buttons="true"
        :hide-body="true"
        @close-modal="closeModal"
        @on-confirm="handleModalConfirm"
      >
        <b slot="header">
          {{ $t("modal.areYouSure") }}
        </b>
      </Modal>
    </portal>
  </div>
</template>

<script>
import TicketSendMessage from "@/components/IU/Tickets/Messaging/TicketSendMessage";
import TicketMessageList from "@/components/IU/Tickets/Messaging/TicketMessageList";
import LoadingMessageList from "@/components/IU/Tickets/Messaging/LoadingMessageList";
import Modal from "@/components/Misc/Modal";
import ChevronLeftCircle from "vue-material-design-icons/ChevronLeftCircle";

import SvgSupportBubble from "@/assets/svg/supportBubble.svg";

import {
  getTicket,
  resolveTicket,
  reopenTicket,
  replyToTicket,
} from "@/services/IU/iuTicketService";
import toastMixin from "@/mixins/toastMixin";

import * as availableStatuses from "@/dataObject/tickets/ticketStatusData";
import { getNextPage } from "@/services/generalService";
import { removeDuplicatesByKey } from "@/utils/generalUtils";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "Ticket",
  components: {
    TicketMessageList,
    TicketSendMessage,
    Modal,
    ChevronLeftCircle,
    LoadingMessageList,
    SvgSupportBubble,
  },
  mixins: [toastMixin, devicesMixin],
  props: {
    selectedTicketId: null,
  },
  data() {
    return initialState();
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
      if (!this.selectedTicketId) return (this.ticketNotFound = true);

      Object.assign(this.$data, initialState());
      this.loading = true;
      const response = await getTicket(this.selectedTicketId);
      this.loading = false;
      if (response.error) return (this.ticketNotFound = true);

      this.ticket = response.ticket;
      this.messageList = response.messages.data.reverse();
      this.nextPageMessageUrl = response.messages.next_page_url;
      this.ticketNotFound = false;
    },
    onResolveTicket() {
      this.modalMode = "resolve";
      this.modalOpened = true;
    },
    onReopenTicket() {
      this.modalMode = "reopen";
      this.modalOpened = true;
    },
    handleModalConfirm() {
      if (this.modalMode == "resolve") this.resolveTicket();
      else if (this.modalMode == "reopen") this.reopenTicket();
      this.modalOpened = false;
    },
    async resolveTicket() {
      const response = await resolveTicket(this.selectedTicketId);
      this.$displayServerResponse(response);

      if (response.error) return;

      this.$emit("status-change", this.availableStatuses.RESOLVED);
    },
    async reopenTicket() {
      const response = await reopenTicket(this.selectedTicketId);
      this.$displayServerResponse(response);

      if (response.error) return;

      this.$emit("status-change", this.availableStatuses.UNCLAIMED);
    },
    async sendMessage(formData) {
      const response = await replyToTicket(this.ticket.id, formData);

      if (response.error) return this.$displayServerResponse(response);

      response.data.message.forEach((message) =>
        this.messageList.push(message)
      );
      this.resetMessage = !this.resetMessage;
      this.toggleScrollBottomMessages = !this.toggleScrollBottomMessages;
    },
    async loadNextPageMessages() {
      if (!this.nextPageMessageUrl) return;

      const response = await getNextPage(this.nextPageMessageUrl);
      if (response.error) return this.$displayServerResponse(response);

      this.messageList = removeDuplicatesByKey(
        [...response.messages.data.reverse(), ...this.messageList],
        "id"
      );
      this.nextPageMessageUrl = response.messages.next_page_url;
    },
    closeModal() {
      this.modalOpened = false;
    },
    onBack() {
      this.$emit("on-back", true);
    },
    setDataChanged(bool) {
      this.$emit("set-data-changed", bool);
    },
  },
};

function initialState() {
  return {
    ticket: null,
    messageList: null,
    availableStatuses: availableStatuses,
    nextPageMessageUrl: null,
    resetMessage: false,
    toggleScrollBottomMessages: false,
    ticketNotFound: false,
    modalOpened: false,
    modalMode: "",
    loading: true,
  };
}
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.ticket-resolved-button {
  background: $green;
}
.ticket-reopen-button {
  background: $orange;
}
.ticket-messages-outer {
  height: calc(var(--vh, 1vh) * 100 - 340px);
}
.no-tickets-found {
  color: $gray;
}
.bg-gray {
  background-color: #bac6d8;
}
.full-rounded {
  border-radius: 100%;
}
.icon-size {
  width: 84.899px;
  height: 84.783px;
}
@media (min-width: $smallPhoneWidth) and (max-width: $laptopWidth) {
  .ticket-messages-outer {
    height: calc(var(--vh, 1vh) * 100 - 450px);
    min-height: 300px;
  }
  .arrow-outer {
    position: absolute;
    top: 2px;
    left: 15px;
  }
}
@media (max-width: $smallPhoneWidth) {
  .ticket-messages-outer {
    height: calc(var(--vh, 1vh) * 100 - 385px);
  }
  .arrow-outer {
    position: absolute;
    top: 2px;
    left: 15px;
  }
}
</style>
