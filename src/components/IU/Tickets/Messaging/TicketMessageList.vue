<template>
  <div
    ref="outer"
    class="h-100 overflow-auto container-fluid position-relative word-break-word message-font scrollbar-blue"
  >
    <Observer
      v-if="showObserver"
      :on-observed="loadMoreMessages"
      :custom-css="observerCustomCss"
    />
    <div v-for="message in messageList" :key="message.id">
      <TicketMessage
        :message="message"
        :class="[
          message.type == availableMessageTypes.SYSTEM_MESSAGE
            ? 'my-3 text-dark-gray text-grayed-out'
            : 'my-3',
        ]"
      />
    </div>
  </div>
</template>

<script>
import TicketMessage from "./TicketMessage.vue";
import Observer from "@/components/Misc/Observer";

import * as availableMessageTypes from "@/dataObject/tickets/ticketMessageTypeData";
export default {
  components: {
    TicketMessage,
    Observer,
  },
  props: {
    messageList: {
      type: Array,
    },
    toggleScrollBottomMessages: {
      type: Boolean,
    },
  },
  data() {
    return {
      availableMessageTypes: availableMessageTypes,
      observerCustomCss: "top: 50px; bottom: unset; height: 10px",
      showObserver: false,
      hasInit: false,
    };
  },
  watch: {
    messageList(oldVal, newVal) {
      //if messages don't fit the screen, load more will trigger hence the scrolling could be messed up
      if (!this.hasInit)
        this.$nextTick(() => {
          this.scrollBottom();
        });
      //only if list is changed by loadMore and not by sending message
      else if (oldVal[0].id != newVal[0].id) this.$refs.outer.scrollTop = 1;

      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
    toggleScrollBottomMessages() {
      this.$nextTick(() => {
        this.scrollBottom();
      });
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
    scrollBottom() {
      this.$refs.outer.scrollTop = this.$refs.outer.scrollHeight;
    },
    loadMoreMessages() {
      this.$emit("load-more-messages");
      this.showObserver = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.word-break-word {
  word-break: break-word;
}
.message-font {
  font-size: 13px;
}
</style>
