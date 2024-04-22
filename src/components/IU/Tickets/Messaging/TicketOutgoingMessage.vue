<template>
  <div class="row">
    <div class="col-5" />
    <div class="col-7">
      <div class="item py-3 px-4 position-relative" :title="timestamp">
        {{ message.message }}
        <span class="timestamp">{{ timestamp }}</span>
      </div>
    </div>
  </div>
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

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.item {
  background-color: $blue;
  border-radius: 20px 20px 20px 20px;
  color: $static-white;
  .timestamp {
    position: absolute;
    right: 0;
    top: -15px;
    color: $gray;
    font-size: 11px;
  }
}
</style>
