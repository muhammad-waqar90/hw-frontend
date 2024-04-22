<template>
  <div
    class="ms-4 item rounded-card animated-loading-background"
    :class="{ 'w-75': $isPhone }"
  />
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  mixins: [devicesMixin],
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item {
  height: 250px;
  width: 91.5%;
}

@media (max-width: $tabletWidth) {
  .item {
    height: 450px;
  }
}
</style>
