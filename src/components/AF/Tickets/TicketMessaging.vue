<template>
  <div
    class="messaging bg-white pt-4 pb-3 px-2 position-relative"
    :class="{ 'border-bottom': !chatEnabled }"
  >
    <div
      ref="outer"
      class="messageContainer position-relative scrollbar-blue pe-2"
    >
      <Observer
        v-if="showObserver"
        :on-observed="loadMoreMessages"
        :custom-css="observerCustomCss"
      />
      <div v-for="message in messages" :key="message.id">
        <TicketMessage :message="message" />
      </div>
    </div>
    <div v-if="messages.length && chatEnabled" class="mt-2">
      <UploadScreenshots
        v-if="$route.name != 'af-lesson-qa-ticket' && hasUploadScreenshot"
        class="my-2"
        :reset="resetImages"
        @get-images="getImages"
      />
      <form @submit.prevent="sendMessage">
        <div class="form-group">
          <textarea
            v-model="textMessage"
            placeholder="Type in your message..."
            class="rounded bg-light border py-4 form-control"
            rows="2"
          />
        </div>
        <div class="d-flex justify-content-between mt-2">
          <div>
            <span :class="{ 'text-danger': textMessage.length > 4000 }">{{
              textMessage.length
            }}</span>
            / 4000
          </div>

          <button
            type="submit"
            :disabled="
              (!textMessage.length || textMessage.length > 4000) && !loadingSend
            "
            class="btn blue-btn"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import TicketMessage from "@/components/AF/Tickets/TicketMessage";
import UploadScreenshots from "@/components/Ticket/UploadScreenshots";
import Observer from "@/components/Misc/Observer";

import * as availableMessageTypes from "@/dataObject/tickets/ticketMessageTypeData";

import toastMixin from "@/mixins/toastMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  name: "TicketMessaging",

  components: { TicketMessage, UploadScreenshots, Observer },
  mixins: [toastMixin, dompurifyMixin],

  props: {
    messages: {
      type: Array,
      default: () => {},
    },

    chatEnabled: {
      type: Boolean,
      default: true,
    },

    toggleScrollBottomMessages: {
      type: Boolean,
    },

    toggleMessaging: {
      type: Boolean,
    },
    toggleMessage: {
      type: Boolean,
    },
    hasUploadScreenshot: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      textMessage: "",
      showObserver: true,
      observerCustomCss: "top: 50px; bottom: unset; height: 10px",
      hasInit: false,
      loadingSend: false,
      availableMessageTypes,
      uploadedImages: [],
      resetImages: false,
    };
  },

  watch: {
    messages(oldVal, newVal) {
      //if messages don't fit the screen, load more will trigger hence the scrolling could be messed up
      if (!this.hasInit)
        this.$nextTick(() => {
          this.scrollBottom();
        });
      //only if list is changed by loadMore and not by sending message
      else if (oldVal?.[0]?.id != newVal?.[0]?.id)
        this.$refs.outer.scrollTop = 1;

      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
    toggleScrollBottomMessages() {
      this.$nextTick(() => {
        this.scrollBottom();
      });
    },
    toggleMessage() {
      this.textMessage = "";
    },
  },

  mounted() {
    this.scrollBottom();
    this.$nextTick(() => {
      this.showObserver = true;
    });
    setTimeout(() => {
      this.hasInit = true;
    }, 300);
  },

  methods: {
    sendMessage() {
      if (!this.sanitizeWithBusinesslogic(this.textMessage))
        return this.$displayErrorToast(this.$t("errors.invalidFieldAlert"));
      this.loadingSend = true;
      let formData = new FormData();
      formData.append("message", this.textMessage);
      for (let i = 0; i < this.uploadedImages.length; i++) {
        formData.append("assets[]", this.uploadedImages[i]);
      }
      this.textMessage = "";
      this.uploadedImages = [];
      this.resetImages = !this.resetImages;
      this.$emit("on-submit", formData);
      this.loadingSend = false;
    },

    scrollBottom() {
      this.$refs.outer.scrollTop = this.$refs.outer.scrollHeight;
    },
    loadMoreMessages() {
      this.$emit("load-more-messages");
      this.showObserver = false;
    },
    getImages(images) {
      this.uploadedImages = images;
    },
  },
};
</script>

<style lang="scss" scoped>
.messageContainer {
  height: 38vh;
  overflow-y: auto;
  word-break: break-word;
}
</style>
