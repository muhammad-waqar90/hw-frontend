<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Global Notification - Create</h3>
      </div>
      <div class="py-3">
        <GlobalNotificationCreateEdit
          mode="create"
          @on-save="createGlobalNotification"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import GlobalNotificationCreateEdit from "@/components/AF/GlobalNotifications/GlobalNotificationCreateEdit.vue";
import { createGlobalNotification } from "@/services/AF/afGlobalNotificationService";
import { ACTIVE as archiveActiveStatus } from "@/dataObject/globalNotifications/archiveStatusData.js";

export default {
  name: "GlobalNotificationCreate",
  components: { GlobalNotificationCreateEdit },
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
    async createGlobalNotification(data) {
      let response = await createGlobalNotification(data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({
        name: "af-global-notifications",
        query: { archiveStatus: archiveActiveStatus.value },
      });
    },
  },
};
</script>
