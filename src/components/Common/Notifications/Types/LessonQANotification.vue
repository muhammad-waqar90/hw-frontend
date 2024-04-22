<template>
  <div
    class="support-notification d-flex align-items-center mx-2 me-3 px-3 py-4 cursor-pointer"
    @click="onNotificationClick"
  >
    <CommentTextMultiple
      class="d-none d-md-block ms-2 me-4"
      :class="notification.read ? 'text-secondary' : 'text-active'"
      :size="32"
    />
    <div class="d-flex flex-column w-100">
      <span
        class="notification-header fw-bold d-flex flex-row-reverse flex-md-row align-items-center"
      >
        <span v-if="!notification.read" class="active-circle me-md-2" />
        <span
          class="notification-title h5 my-0 font-weight-600"
          :class="notification.read ? 'text-secondary' : 'text-dark'"
          >{{ capitalizeFirstLetter(notification.title) }}</span
        >
        <CommentTextMultiple
          class="d-block d-md-none"
          :class="notification.read ? 'text-secondary' : 'text-active'"
          :size="32"
        />
      </span>
      <span
        class="h6 mt-3 mt-md-2 mb-0 notification-description"
        :class="notification.read ? 'text-secondary' : 'text-dark'"
        >{{ notification.description }}</span
      >
      <span
        class="h6 font-weight-600 mt-3 mt-md-2 text-center text-md-start"
        :class="notification.read ? 'text-secondary' : 'text-active'"
        >{{ dateFrom + " ago" }}</span
      >
    </div>
  </div>
</template>

<script>
import CommentTextMultiple from "vue-material-design-icons/CommentTextMultiple";
import { getDateFrom } from "@/utils/dateTimeUtils";
import { capitalizeFirstLetter } from "@/utils/stringUtils";

export default {
  name: "LessonQANotification",
  components: {
    CommentTextMultiple,
  },
  props: {
    notification: {
      type: Object,
      default: () => {},
    },
  },

  computed: {
    dateFrom() {
      return getDateFrom(this.notification.created_at);
    },
  },
  methods: {
    onNotificationClick() {
      this.$emit("mark-notification-as-read", this.notification);

      if (!this.notification.action)
        return this.$emit("push-route", { name: "iu-lesson" });

      if (
        this.notification.action.redirect &&
        this.notification.action.redirect.courseId &&
        this.notification.action.redirect.lessonId
      )
        return this.$emit("push-route", {
          name: "iu-lesson",
          params: {
            courseId: this.notification.action.redirect.courseId.toString(),
            lessonId: this.notification.action.redirect.lessonId.toString(),
          },
          hash: "#qa",
          query: {},
        });

      this.$emit("push-route", { name: "homepage" });
    },
    capitalizeFirstLetter,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.support-notification {
  text-decoration: none;
  .notification-header {
    justify-content: flex-start;
    .active-circle {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      display: block;
      background: $blue;
    }
  }
}

.text-active {
  color: $green;
}

.notification-title {
  font-size: 1.1rem;
}
.notification-description {
  font-size: 0.95rem;
}

@media (max-width: $tabletWidth) {
  .support-notification {
    .notification-header {
      justify-content: space-between;
      .notification-title {
        max-width: 78%;
        margin: auto;
      }
    }
  }
}
</style>
