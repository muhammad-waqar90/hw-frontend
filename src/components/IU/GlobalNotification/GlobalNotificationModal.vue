<template>
  <portal to="out-of-app-content">
    <Modal
      :hide-footer="true"
      :hide-header="true"
      :close-on-click-outside="false"
      :hide-close-button="false"
      @close-modal="handleCloseModal"
    >
      <template slot="body">
        <h3>Latest Global Notifications</h3>
        <NotificationList class="mt-3 pe-3" :notifications="notifications" />
      </template>
    </Modal>
  </portal>
</template>

<script>
import { mapGetters } from "vuex";

import NotificationList from "@/components/Common/Notifications/NotificationList";
import Modal from "@/components/Misc/Modal";

export default {
  components: {
    NotificationList,
    Modal,
  },
  computed: {
    ...mapGetters({
      notifications: "notifications/getGNotificationsList",
    }),
  },
  watch: {
    $route() {
      this.$emit("close-gn-modal");
    },
  },
  methods: {
    handleCloseModal() {
      this.$emit("close-gn-modal");
    },
  },
};
</script>

<style scoped></style>
