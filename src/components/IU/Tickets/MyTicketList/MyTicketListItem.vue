<template>
  <div>
    <div :class="ticket.seen_by_me == 0 && 'fw-bold'">
      <div class="row">
        <div class="col d-flex align-items-center">
          <progressCheck
            v-if="ticket.status == 'in_progress'"
            class="p-0 me-2 d-flex align-items-center justify-content-center btn white-btn"
            :size="16"
          />
          <HandBackRightOutline
            v-if="ticket.status == 'on_hold'"
            class="p-0 me-2 d-flex align-items-center ticket-status-icon justify-content-center btn gray-btn"
            :size="16"
          />
          <check
            v-if="ticket.status == 'resolved'"
            class="p-0 me-2 d-flex align-items-center justify-content-center ticket-status-icon text-light btn green-btn"
            :size="16"
          />
          <alarm
            v-if="ticket.status == 'unclaimed' || ticket.status == 'reopened'"
            class="alarm-padding me-2 d-flex align-items-center justify-content-center ticket-status-icon text-light btn orange-btn"
            :size="14"
          />
          <h5 class="mb-0 my-ticket-title">
            {{ ticket.subject }}
          </h5>
        </div>
        <div class="col-auto d-flex align-items-center text-end font-12">
          {{ " #" + ticket.id }}
        </div>
      </div>
      <div class="row">
        <div class="col d-flex align-items-center mt-2 latest-message">
          <span v-if="isImage"
            ><Paperclip :size="15" class="me-1" />{{
              $t("iu.uploadScreenshots.attachment")
            }}</span
          >
          <span v-else>{{ ticket.latest_ticket_message }}</span>
        </div>
        <div class="col-auto d-flex text-end font-12">
          {{ dateFrom }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Alarm from "vue-material-design-icons/Alarm";
import Check from "vue-material-design-icons/Check";
import Paperclip from "vue-material-design-icons/Paperclip";
import ProgressCheck from "vue-material-design-icons/ProgressCheck";
import HandBackRightOutline from "vue-material-design-icons/HandBackRightOutline";
import * as availableMessageTypes from "@/dataObject/tickets/ticketMessageTypeData";

import { getDateFrom } from "@/utils/dateTimeUtils";

export default {
  components: {
    Alarm,
    Check,
    Paperclip,
    ProgressCheck,
    HandBackRightOutline,
  },
  props: {
    ticket: {
      type: Object,
    },
  },

  computed: {
    dateFrom() {
      return getDateFrom(this.ticket.updated_at);
    },
    isImage() {
      return (
        this.ticket.type == availableMessageTypes.USER_ASSET_MESSAGE ||
        this.ticket.type == availableMessageTypes.ADMIN_ASSET_MESSAGE
      );
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.font-12 {
  font-size: 12px;
}

.ticket-status-icon {
  border-radius: 5px;
}
.alarm-padding {
  padding: 2px;
}

.router-link-active .ticket-status-icon {
  background: $white !important;
  color: #343a40 !important;
}

.latest-message {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  font-size: 14px;
}
.my-ticket-title {
  font-size: 17px;
}
</style>
