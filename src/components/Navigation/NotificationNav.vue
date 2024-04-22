<template>
  <div>
    <div
      class="navigation-button notification-button cursor-pointer text-white rounded-circle position-relative d-flex justify-content-center align-items-center"
      @click="toggleNotifications"
    >
      <span>
        <svg-notification class="icon-small" />
      </span>
      <span v-if="unreadNotifications" class="count">
        {{ unreadNotificationsCount }}
      </span>
    </div>
    <Notifications
      v-if="notificationsActive"
      :unread-notifications="unreadNotifications"
      @close-notifications-dropdown="closeNotificationsDropdown"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Notifications from "@/components/Common/Notifications/Notifications";

import SvgNotification from "@/assets/svg/notification.svg";

export default {
  components: {
    Notifications,
    SvgNotification,
  },
  computed: {
    ...mapGetters({
      unreadNotifications: "notifications/getUnreadCount",
      totalNotifications: "notifications/getTotalNotifications",
      nextPageUrl: "notifications/getNextPageUrl",
      notificationsActive: "ui/getNotificationsActive",
    }),
    unreadNotificationsCount() {
      return this.unreadNotifications == this.totalNotifications &&
        this.nextPageUrl
        ? this.unreadNotifications + "+"
        : this.unreadNotifications;
    },
  },
  methods: {
    toggleNotifications() {
      setTimeout(() => {
        this.$store.dispatch("ui/setLeftNavigationActive", false);
        this.$store.dispatch(
          "ui/setNotificationsActive",
          !this.notificationsActive
        );
      }, 0);
    },
    closeNotificationsDropdown() {
      setTimeout(() => {
        this.$store.dispatch("ui/setNotificationsActive", false);
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/shared/navButtons.scss";

.notification-button {
  background: #f2a000;
  line-height: 0;
  .count {
    background-color: #e8505b;
  }
}
</style>
