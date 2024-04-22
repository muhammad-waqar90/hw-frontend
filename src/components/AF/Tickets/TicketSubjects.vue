<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="ticket in tickets" :key="ticket.id">
          <td>{{ ticket.name }}</td>
          <td>
            <router-link
              :to="'/af/tickets/subjects/' + ticket.id"
              class="me-2 text-dark"
            >
              <pen class="cursor-pointer" :size="20" />
            </router-link>

            <trash-can
              class="cursor-pointer"
              :size="20"
              @click="onTicketDelete(ticket)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TrashCan from "vue-material-design-icons/TrashCan";
import Pen from "vue-material-design-icons/Pen";

export default {
  name: "TicketSubjects",

  components: {
    TrashCan,
    Pen,
  },
  props: {
    tickets: { type: Array },
  },

  methods: {
    onTicketDelete(ticket) {
      this.$emit("on-ticket-delete", ticket);
    },
  },
};
</script>

<style lang="scss" scoped>
.claimButtons {
  width: 85px;
}
</style>
