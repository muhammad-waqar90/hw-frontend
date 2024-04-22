<template>
  <div
    class="d-flex"
    :class="[
      { 'justify-content-end': isAdmin },
      { 'justify-content-start': isUser },
      { 'justify-content-center': isSystem },
    ]"
  >
    <div
      v-if="isSystem"
      class="d-flex flex-column text-center mx-5 my-2 text-dark"
    >
      <h6 class="system-message mb-0" v-html-directive="message.message" />
      <h6 class="system-message font-weight-400 mb-0">
        {{ dateFormat(message.created_at) }}
      </h6>
    </div>
    <div v-else class="d-flex flex-column mb-1">
      <h5 class="timestamp mb-0">
        {{ dateFormat(message.created_at) }}
      </h5>
      <div
        :class="[
          { 'border-radius-right': isAdmin },
          { 'border-radius-left': isUser },
          { 'bg-blue py-2 px-3': isAdmin && !isImage },
          { 'bg-gray py-2 px-3': isUser && !isImage },
        ]"
        class="message-body text-white font-weight-500"
      >
        <img
          v-if="isImage"
          :src="message.img"
          :alt="message.message"
          class="w-100 rounded-card cursor-pointer py-2 px-3 bg-light-gray"
          @click="imagePopUp = true"
        />
        <span v-else v-html-directive="message.message" />
      </div>
    </div>

    <portal v-if="isImage" to="out-of-app-content">
      <ModalTransparent
        v-if="imagePopUp"
        :hide-footer="true"
        :hide-header="true"
        @close-modal="imagePopUp = false"
      >
        <template slot="body">
          <div class="w-100 text-center">
            <img
              class="mt-3 view-image"
              :src="message.img"
              :alt="message.message"
            />
          </div>
        </template>
      </ModalTransparent>
    </portal>
  </div>
</template>

<script>
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
import * as availableMessageTypes from "@/dataObject/tickets/ticketMessageTypeData";

export default {
  name: "TicketMessage",
  components: {
    ModalTransparent: () =>
      import(
        /* webpackChunkName: "ModalTransparentComponent" */ "@/components/Misc/ModalTransparent"
      ),
  },
  props: {
    message: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      imagePopUp: false,
    };
  },
  computed: {
    isAdmin() {
      return (
        this.message.type == availableMessageTypes.ADMIN_MESSAGE ||
        this.message.type == availableMessageTypes.ADMIN_ASSET_MESSAGE
      );
    },
    isUser() {
      return (
        this.message.type == availableMessageTypes.USER_MESSAGE ||
        this.message.type == availableMessageTypes.USER_ASSET_MESSAGE
      );
    },
    isSystem() {
      return (
        this.message.type == availableMessageTypes.SYSTEM_MESSAGE ||
        this.message.type == availableMessageTypes.ADMIN_ONLY_SYSTEM_MESSAGE
      );
    },
    isImage() {
      return (
        this.message.type == availableMessageTypes.ADMIN_ASSET_MESSAGE ||
        this.message.type == availableMessageTypes.USER_ASSET_MESSAGE
      );
    },
  },
  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.bg-blue {
  background-color: $blue;
}
.bg-gray {
  background-color: $gray;
}
.bg-light-gray {
  background-color: $lightgray;
}
.message-body {
  font-family: "Montserrat";
  max-width: 300px;
  word-break: break-word;
}
.system-message {
  font-size: 14px;
  color: $gray;
}
.border-radius-right {
  border-radius: 20px 0 20px 20px;
}
.border-radius-left {
  border-radius: 0px 20px 20px 20px;
}
.timestamp {
  font-size: 12px;
  font-family: "Montserrat";
  color: $gray;
}
.view-image {
  max-height: calc(100vh - 3rem);
  max-width: calc(100vh - 5rem);
}
</style>
