<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">Ticket ID</th>
          <th scope="col">
            {{ subject }}
          </th>
          <th scope="col">User</th>
          <th scope="col">Category</th>
          <th scope="col">Status</th>
          <th scope="col">Created At</th>
          <th class="text-end pe-5">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td>{{ ticket.id }}</td>
          <td>{{ ticket.subject }}</td>
          <td>{{ ticket.user }}</td>
          <td>
            {{ ticket.category_name }}
          </td>
          <td :class="ticketStatusClass(ticket.status)">
            {{ ticket.status }}
          </td>
          <td>{{ dateFormat(ticket.created_at) }}</td>
          <td>
            <div class="d-flex justify-content-end">
              <button
                v-if="ticket.claimable && to !== '/af/lesson/qas/'"
                :disabled="claimingDisabled"
                :class="{ disabled: claimingDisabled }"
                class="btn blue-btn mx-1 claimButtons"
                @click="claimTicket(ticket)"
              >
                Claim
              </button>
              <router-link
                :to="to + ticket.id"
                class="me-2 text-dark btn btn-light border border-secondary mx-1"
              >
                Show
              </router-link>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";

export default {
  props: {
    subject: { type: String, default: "Ticket Subject" },
    tickets: { type: Array },
    to: { type: String, default: "/af/tickets/" },
  },

  data() {
    return {
      claimingDisabled: false,
    };
  },

  methods: {
    claimTicket(ticket) {
      this.claimingDisabled = true;
      this.$emit("on-ticket-claim", ticket);
      setTimeout(() => {
        this.claimingDisabled = false;
      }, 500);
    },

    ticketStatusClass(status) {
      if (status == "unclaimed") {
        return "text-warning";
      } else if (status == "in_progress") {
        return "text-blue";
      } else if (status == "resolved") {
        return "text-success";
      } else if (status == "on_hold") {
        return "text-info";
      } else {
        return "text-danger";
      }
    },

    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
  },
};
</script>

<style lang="scss" scoped>
.claimButtons {
  width: 85px;
}
</style>
