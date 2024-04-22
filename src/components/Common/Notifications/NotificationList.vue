<template>
  <div
    ref="outer"
    class="notificationsContainer scrollbar-blue position-relative"
  >
    <div v-if="notifications && notifications.length">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="d-flex flex-column notification mt-3"
      >
        <GlobalNotification
          v-if="notification.type == availableTypes.GLOBAL"
          :notification="notification"
          @mark-notification-as-read="markNotificationAsRead"
          @push-route="routePush"
        />
        <SupportNotification
          v-else-if="notification.type == availableTypes.SUPPORT_TICKET"
          :notification="notification"
          @mark-notification-as-read="markNotificationAsRead"
          @push-route="routePush"
        />
        <CertificateNotification
          v-else-if="notification.type == availableTypes.CERTIFICATE"
          :notification="notification"
          @mark-notification-as-read="markNotificationAsRead"
          @push-route="routePush"
        />
        <LessonQANotification
          v-else-if="notification.type == availableTypes.LESSON_QA_TICKET"
          :notification="notification"
          @mark-notification-as-read="markNotificationAsRead"
          @push-route="routePush"
        />
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="loadMoreNotifications"
        :custom-css="observerCustomCss"
      />
      <LoadingNotification v-if="loading" :number-of-items="3" />
    </div>
    <div v-else class="text-secondary">
      {{ $t("notifications.noNotificationsFound") }}
    </div>
  </div>
</template>

<script>
import GlobalNotification from "@/components/Common/Notifications/Types/GlobalNotification";
import SupportNotification from "@/components/Common/Notifications/Types/SupportNotification";
import CertificateNotification from "@/components/Common/Notifications/Types/CertificateNotification";
import LessonQANotification from "@/components/Common/Notifications/Types/LessonQANotification";

import Observer from "@/components/Misc/Observer";
import LoadingNotification from "@/components/Common/Notifications/LoadingNotification";
import { isSameRoute } from "@/utils/routerUtils";

import * as availableTypes from "@/dataObject/notifications/notificationTypeData";

export default {
  name: "NotificationList",

  components: {
    GlobalNotification,
    SupportNotification,
    CertificateNotification,
    LessonQANotification,
    Observer,
    LoadingNotification,
  },

  props: {
    notifications: {
      type: Array,
      default: () => {},
    },

    showObserver: {
      type: Boolean,
      default: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      observerCustomCss:
        "height: 0px; width: 50px; position: relative; bottom: 20px",
      availableTypes,
    };
  },

  methods: {
    loadMoreNotifications() {
      this.$emit("load-more");
    },
    markNotificationAsRead(notification) {
      if (!notification.read)
        this.$store.dispatch(
          "notifications/setNotificationAsRead",
          notification
        );
    },
    routePush(to) {
      // Todo: Need to optimize this check to avoid redundant navigation
      if (
        isSameRoute(
          this.$route.name,
          this.$route.params,
          this.$route.query,
          this.$route.hash,
          to.name,
          to.params,
          to.query,
          to.hash
        )
      ) {
        return this.$emit("close-notification");
      }
      this.$router.push(to);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.notificationsContainer {
  max-height: 402px;
  width: 100%;
  overflow-y: auto;
  word-break: break-word;
}
.notification {
  background: $lightgray;
  border-radius: 10px;
  &:hover {
    opacity: 0.7;
  }
}

@media (max-width: $tabletWidth) {
  .notificationsContainer {
    max-height: calc(100vh - 249px);
  }
}
</style>
