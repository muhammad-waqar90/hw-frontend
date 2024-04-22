<template>
  <div
    class="text-center"
    :title="timestamp"
    v-html-directive="message.message"
  />
</template>

<script>
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
export default {
  props: {
    message: {
      type: Object,
    },
  },
  computed: {
    timestamp() {
      return UTCtoLocalDateFormatted(this.message.updated_at);
    },
  },
};
</script>
