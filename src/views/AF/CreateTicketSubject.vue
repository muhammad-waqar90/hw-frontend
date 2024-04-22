<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Ticket Subject - Create</h3>
      </div>
      <div class="py-3">
        <CreateEditTicketSubject
          mode="create"
          @on-save="createTicketSubject"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CreateEditTicketSubject from "@/components/AF/Tickets/CreateEditTicketSubject";
import { createTicketSubject } from "@/services/AF/afTicketService";

export default {
  name: "TicketSubjectCreate",

  components: { CreateEditTicketSubject },

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
    };
  },

  methods: {
    async createTicketSubject(data) {
      let response = await createTicketSubject(data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-tickets-subjects" });
    },
  },
};
</script>
