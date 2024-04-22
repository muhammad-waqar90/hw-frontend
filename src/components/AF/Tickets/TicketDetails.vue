<template>
  <div class="details px-4 py-5">
    <div class="d-flex">
      <Key :size="20" class="me-2" />
      <span class="lead">
        ID:
        <span class="fw-bold">{{ ticket.id }}</span>
      </span>
    </div>
    <div class="d-flex">
      <Shape :size="20" class="me-2" />
      <span class="lead">
        Category:
        <span class="fw-bold text-lowercase">{{
          getTicketCategory(ticket)
        }}</span>
      </span>
    </div>
    <div class="d-flex">
      <User :size="20" class="me-2" />
      <span class="lead">
        User:
        <span class="fw-bold">{{ ticket.user }}</span>
      </span>
    </div>
    <div class="d-flex">
      <Alarm :size="20" class="me-2" />
      <span class="lead">
        Created At:
        <span class="fw-bold">{{ dateFormat(ticket.created_at) }} </span>
      </span>
    </div>
    <div class="d-flex">
      <Status :size="20" class="me-2" />
      <span class="lead">
        Status:
        <span class="fw-bold">{{ ticket.status }} </span>
      </span>
    </div>
    <div class="d-flex flex-column mt-4">
      <button
        v-if="ticket.claimable == true"
        class="btn blue-btn my-2"
        @click="
          isOpen = true;
          modalMode = 'claimTicket';
        "
      >
        Claim Ticket
      </button>
      <button
        v-if="
          (ticket.ticket_status_id == inProgress ||
            ticket.ticket_status_id == onHold) &&
          ticket.assigned_to_current_user == true
        "
        class="btn btn-danger my-2"
        @click="
          isOpen = true;
          modalMode = 'unclaimTicket';
        "
      >
        Unclaim Ticket
      </button>

      <button
        v-if="
          ticket.ticket_status_id == inProgress &&
          ticket.assigned_to_current_user == true &&
          ticket.ticket_category_id != availableCategories.LECTURE_QA
        "
        class="btn btn-info my-2 text-white"
        @click="
          isOpen = true;
          modalMode = 'onHoldTicket';
        "
      >
        On Hold Ticket
      </button>

      <button
        v-if="
          ticket.ticket_status_id != resolved &&
          ticket.ticket_category_id != availableCategories.LECTURE_QA &&
          ticket.ticket_status_id
        "
        class="btn green-btn my-2"
        @click="openChangeTicketTypeModal"
      >
        Change Ticket Category
      </button>
      <button
        v-if="
          ticket.user_id &&
          (ticket.ticket_status_id == inProgress ||
            ticket.ticket_status_id == onHold) &&
          ticket.assigned_to_current_user == true &&
          ticket.ticket_category_id != availableCategories.LECTURE_QA
        "
        class="btn btn-secondary my-2"
        @click="
          isOpen = true;
          modalMode = 'resolveTicket';
        "
      >
        Mark As Resolved
      </button>
      <ButtonWithTooltip
        v-else-if="
          (ticket.ticket_status_id == inProgress ||
            ticket.ticket_status_id == onHold) &&
          ticket.assigned_to_current_user == true
        "
        :disabled="true"
        label="Mark As Resolved"
        message="Ticket will auto resolved once admin reply"
        btn-class="btn btn-secondary my-2 w-100"
      />

      <button
        v-if="ticket.user_id && ticket.can_save_as_lesson_faq"
        class="btn green-btn my-2"
        @click="
          isOpen = true;
          modalMode = 'saveLessonFaq';
        "
      >
        Save As Lecture FAQ
      </button>

      <div class="text-center mt-4">
        <button class="btn blue-btn" @click="backToTickets">
          <div class="d-flex">
            <arrow-left :size="23" class="me-2 d-flex" />
            Back To Tickets
          </div>
        </button>
      </div>
    </div>
    <!-- TODO: requried to replace with ChangeTicketCategoryModalContent -->
    <Modal
      v-if="isOpen && modalMode == 'changeTicketType'"
      title="Change Ticket Category"
      :min-height="'300px'"
      @close-modal="isOpen = false"
    >
      <div class="form-group w-100 pt-2 h5">
        <label class="form-label">Ticket Category:</label>
        <select v-model="ticketType" class="form-select text-lowercase">
          <option
            v-for="(category, index) in parsedAvailableCategories"
            :key="index"
            :disabled="ticket.ticket_category_id == category.value"
            :value="category"
          >
            {{ category.name }}
          </option>
        </select>
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-confirm="submitTicketType"
          @on-cancel="cancel"
        />
      </template>
    </Modal>
    <modal
      v-if="
        isOpen &&
        (modalMode == 'unclaimTicket' ||
          modalMode == 'claimTicket' ||
          modalMode == 'saveLessonFaq' ||
          modalMode == 'onHoldTicket' ||
          modalMode == 'resolveTicket')
      "
      :title="title"
      :min-height="'300px'"
      @close-modal="isOpen = false"
    >
      <div class="w-100 pt-2 h5 d-flex flex-column">
        <span> Are you sure you want to proceed with this action? </span>
      </div>
      <template slot="footer">
        <confirmation-buttons @on-confirm="confirm" @on-cancel="cancel" />
      </template>
    </modal>
  </div>
</template>

<script>
import Alarm from "vue-material-design-icons/Alarm";
import Status from "vue-material-design-icons/ListStatus";
import Key from "vue-material-design-icons/KeyVariant";
import ArrowLeft from "vue-material-design-icons/ArrowLeft";
import User from "vue-material-design-icons/Account";
import Shape from "vue-material-design-icons/Shape";

import Modal from "@/components/Misc/Admin/AdminModal";
import {
  UNCLAIMED,
  IN_PROGRESS,
  RESOLVED,
  REOPENED,
  ON_HOLD,
} from "@/dataObject/tickets/ticketStatusData";

import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";

import * as availableCategories from "@/dataObject/tickets/ticketCategoryData";

export default {
  name: "TicketDetails",

  components: {
    Alarm,
    User,
    Status,
    Key,
    ArrowLeft,
    Shape,
    Modal,
    ConfirmationButtons,
    ButtonWithTooltip,
  },

  props: {
    ticket: {
      type: Object,
      default: () => {},
    },
    toggleTicketing: {
      type: Boolean,
    },
    backTo: {
      type: String,
      default: "support",
    },
  },

  data() {
    return {
      isOpen: false,
      inProgress: IN_PROGRESS,
      unclaimed: UNCLAIMED,
      resolved: RESOLVED,
      reopened: REOPENED,
      onHold: ON_HOLD,
      modalMode: "unclaimTicket",
      ticketType: {},
      availableCategories,
    };
  },

  computed: {
    title() {
      return this.modalMode === "unclaimTicket"
        ? "Unclaim Ticket"
        : this.modalMode == "claimTicket"
        ? "Claim Ticket"
        : this.modalMode == "saveLessonFaq"
        ? "Save As Lecture FAQ"
        : this.modalMode == "onHoldTicket"
        ? "On Hold Ticket"
        : "Resolve Ticket";
    },
    parsedAvailableCategories() {
      return Object.entries(this.availableCategories)
        .map(([key, value]) => {
          return { name: key, value };
        })
        .filter((item) => {
          if (item.value != this.availableCategories.LECTURE_QA) return true;
          else return false;
        });
    },
  },

  watch: {
    toggleTicketing() {
      this.$nextTick(() => {
        this.reset();
      });
    },
  },

  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },

    openChangeTicketTypeModal() {
      this.mapCategories();
      this.isOpen = true;
      this.modalMode = "changeTicketType";
    },

    mapCategories() {
      this.parsedAvailableCategories.forEach((category) => {
        if (category.value === this.ticket.ticket_category_id) {
          this.ticketType = category;
        }
      });
    },

    backToTickets() {
      this.backTo === "support"
        ? this.backToSupportTickets()
        : this.backToLessonQATickets();
    },

    backToSupportTickets() {
      if (this.$router.prevRoute?.name === "af-support-tickets")
        return this.$router.push(this.$router.prevRoute);
      this.$router.push({
        name: "af-support-tickets",
        query: { status: this.unclaimed },
      });
    },

    backToLessonQATickets() {
      if (this.$router.prevRoute?.name === "af-lesson-qa-tickets")
        return this.$router.push(this.$router.prevRoute);
      this.$router.push({
        name: "af-lesson-qa-tickets",
        query: { status: this.unclaimed },
      });
    },

    reset() {
      this.isOpen = false;
    },

    confirm() {
      const data = {
        mode: this.modalMode,
      };

      this.$emit("on-confirm", data);
    },

    submitTicketType() {
      if (!this.ticketType) return;
      const data = {
        mode: this.modalMode,
        categoryId: this.ticketType.value,
      };

      this.$emit("on-confirm", data);
    },

    cancel() {
      this.isOpen = false;
    },
    getTicketCategory(item) {
      return Object.keys(this.availableCategories).find(
        (key) => this.availableCategories[key] === item.ticket_category_id
      );
    },
  },
};
</script>
