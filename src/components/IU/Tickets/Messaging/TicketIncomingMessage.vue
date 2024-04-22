<template>
  <div class="row">
    <div class="col-7">
      <div class="item text-dark-gray position-relative p-3" :title="timestamp">
        {{ message.message }}
        <span class="timestamp">{{ timestamp }}</span>
      </div>
    </div>
    <div class="col-5" />
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
  background-color: $lightgray;
  border-radius: 20px 20px 20px 20px;
  .timestamp {
    position: absolute;
    left: 0;
    top: -20px;
    color: $gray;
    font-size: 11px;
  }
}
</style>
