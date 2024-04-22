<template>
  <div
    class="bg-white p-3 cursor-pointer"
    :class="{ 'selected-border': isSelected }"
    @click="showDetails"
  >
    <h5 class="ticket-subject">
      <CheckboxBlankCircle v-if="!seenByMe" :size="10" /> {{ ticket.subject }}
    </h5>
    <h6 class="ticket-details">
      <span>ID: </span>{{ ticket.id }} <span>User: </span>{{ ticket.user }}
      <span>Status: </span>
      <span
        :class="{
          'text-warning':
            ticket.ticket_status_id == availableStatuses.IN_PROGRESS,
          'text-info': ticket.ticket_status_id == availableStatuses.ON_HOLD,
          'text-success': ticket.ticket_status_id == availableStatuses.RESOLVED,
        }"
      >
        {{ ticket.status }}
      </span>
    </h6>
    <h6 class="ticket-details">
      <span>Date: </span>{{ dateFormat(ticket.created_at) }}
    </h6>
    <h6 class="ticket-details">
      <span>Last message: </span>{{ ticket.latest_ticket_message }}
    </h6>
    <h6 class="ticket-details mb-0">
      <span>Category: </span>{{ ticket.category_name }}
    </h6>
  </div>
</template>

<script>
import CheckboxBlankCircle from "vue-material-design-icons/CheckboxBlankCircle";

import { UTCtoLocalDateFormatted, getDateFrom } from "@/utils/dateTimeUtils";

import * as availableStatuses from "@/dataObject/tickets/ticketStatusData";

export default {
  name: "AdminSingleTicket",

  components: { CheckboxBlankCircle },

  props: {
    ticket: {
      type: Object,
      default: () => {},
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      seenByMe: true,
      availableStatuses,
    };
  },

  computed: {
    dateFrom() {
      return getDateFrom(this.ticket.updated_at);
    },
  },

  created() {
    if (!this.ticket.seen_by_me) {
      this.seenByMe = false;
    }
  },

  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },

    showDetails() {
      this.seenByMe = true;
      this.$emit("show-details", this.ticket.id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.selected-border {
  border: 2px solid $blue;
}
.ticket-subject {
  font-size: 18px;
  font-weight: 600;
  color: $blue;
}
.ticket-details {
  font-size: 16px;
  font-weight: 400;
  color: #757575;

  span {
    color: $blue;
  }
}
</style>
