<template>
  <div
    class="d-flex flex-column align-items-center justify-content-center h-100 no-tickets-found pb-5"
  >
    <div class="bg-gray full-rounded p-4 mb-4">
      <svg-support-bubble class="icon-size" />
    </div>
    <h4>
      {{ $t("iu.ticket.noTicketsFound") }}
    </h4>
  </div>
</template>

<script>
import SvgSupportBubble from "@/assets/svg/supportBubble.svg";

export default {
  components: {
    SvgSupportBubble,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.no-tickets-found {
  color: $gray;
}
.bg-gray {
  background-color: #bac6d8;
}
.full-rounded {
  border-radius: 100%;
}
.icon-size {
  width: 84.899px;
  height: 84.783px;
}
</style>
