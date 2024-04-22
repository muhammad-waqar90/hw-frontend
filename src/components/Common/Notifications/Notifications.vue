<template>
  <div
    v-click-outside="closeDropdown"
    class="notification-dropdown rounded-card py-3 bg-white px-3 px-md-4 shadow"
  >
    <div
      class="notifications-header d-flex flex-column flex-md-row justify-content-between align-items-center"
    >
      <span class="mb-0 h4 font-weight-600 notification-dark">{{
        $t("notifications.notifications")
      }}</span>
      <div class="d-flex align-items-center">
        <button
          :disabled="!unreadNotifications"
          class="dismiss-notifications btn rounded-pill notification-dark text-uppercase px-4 font-weight-600 my-2 my-md-0"
          @click="markAllNotificationsAsRead"
        >
          {{ $t("notifications.markAllAsRead") }}
        </button>
        <Close class="red-cross-btn ms-4" @click="closeDropdown" />
      </div>
    </div>
    <hr class="d-none d-md-block" />
    <NotificationList
      :notifications="notifications"
      :show-observer="showObserver"
      :loading="loading"
      @load-more="loadMoreNotifications"
      @close-notification="closeDropdown"
    />
  </div>
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import NotificationList from "@/components/Common/Notifications/NotificationList";
import Close from "vue-material-design-icons/Close";
import { mapGetters } from "vuex";

export default {
  name: "Notifications",

  components: {
    NotificationList,
    Close,
  },

  mixins: [devicesMixin, toastMixin],

  props: {
    unreadNotifications: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      showObserver: true,
      loading: false,
    };
  },

  computed: {
    ...mapGetters({
      notifications: "notifications/getList",
      nextPageUrl: "notifications/getNextPageUrl",
    }),
  },

  watch: {
    notifications(oldVal, newVal) {
      if (!oldVal[0] || !newVal[0]) return;

      if (oldVal[0].id != newVal[0].id) this.$refs.outer.scrollTop = 1;

      setTimeout(() => {
        this.showObserver = true;
        this.loading = false;
      }, 100);
    },
  },

  methods: {
    loadMoreNotifications() {
      this.showObserver = false;

      if (!this.nextPageUrl) return;
      this.loading = true;

      this.$store.dispatch("notifications/loadMoreNotifications");
    },
    markAllNotificationsAsRead() {
      this.$store.dispatch("notifications/setAllNotificationsAsRead");
    },
    closeDropdown() {
      this.$emit("close-notifications-dropdown");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.notification-dropdown {
  position: absolute;
  right: 70px;
  font-family: "Montserrat", sans-serif;
  margin-top: 20px;
  width: 650px;
  max-height: 490px;
  .notification-dark {
    color: $darkgray;
  }
  hr {
    margin: 0.8rem 0;
  }
  .notifications-header {
    height: 38px;
    .dismiss-notifications {
      border-color: $darkgray;
      font-size: 0.8rem;
      &:hover {
        background: $blue;
        color: $static-white;
        border-color: $blue !important;
      }
    }
  }
  .notification {
    background: $lightgray;
    border-radius: 10px;
    &:hover {
      background: #e2e4ec;
    }
  }
}

@media (max-width: $tabletWidth) {
  .notification-dropdown {
    right: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 95%;
    top: 45px;
    max-height: unset;
    .notifications-header {
      height: 87px;
      .closeDropdown {
        position: absolute;
        top: 0;
        right: 0;
        padding: 20px;
      }
    }
    .notificationsContainer {
      max-height: calc(100vh - 249px);
    }
  }
}
</style>
