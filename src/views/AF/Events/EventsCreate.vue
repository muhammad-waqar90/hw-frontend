<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Event - Create</h3>
      </div>
      <div class="py-3">
        <EventCreateEdit
          mode="create"
          @on-save="createEvent"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import EventCreateEdit from "@/components/AF/Event/EventCreateEdit.vue";
import { createEvent } from "@/services/AF/afEventService";

export default {
  name: "AFEventsCreate",
  components: { EventCreateEdit },
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
    async createEvent(data) {
      let response = await createEvent(data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-events" });
    },
  },
};
</script>
