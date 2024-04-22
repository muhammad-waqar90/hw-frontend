<template>
  <div
    class="d-flex"
    :class="[
      { 'justify-content-start': isAdmin },
      { 'justify-content-end': isUser },
      { 'justify-content-center': isSystem },
    ]"
  >
    <div
      v-if="isSystem"
      class="text-center"
      :title="timestamp"
      v-html-directive="message.message"
    />
    <div v-else class="d-flex flex-column mb-1" :title="timestamp">
      <h5 class="timestamp mb-0">
        {{ dateFormat(message.created_at) }}
      </h5>
      <div class="font-weight-500">
        <img
          v-if="isImage"
          :src="message.img"
          :alt="message.message"
          class="w-100 rounded-card cursor-pointer py-2 px-3 bg-gray message-image"
          @click="imagePopUp = true"
        />
        <div
          v-else
          :class="[
            { 'bg-blue text-white': isUser },
            { 'bg-gray text-dark-gray': isAdmin },
          ]"
          class="py-2 px-3 message-text"
          v-html-directive="message.message"
        />
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
    timestamp() {
      return UTCtoLocalDateFormatted(this.message.updated_at);
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
  background-color: $lightgray;
}
.message-text {
  font-family: "Montserrat";
  word-break: break-word;
  max-width: 300px;
  border-radius: 20px 20px 20px 20px;
}
.message-image {
  max-width: 300px;
}
.system-message {
  font-size: 14px;
  color: $gray;
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
