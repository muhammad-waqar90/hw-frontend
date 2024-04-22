<template>
  <span
    class="cursor-pointer d-flex align-items-center"
    @click="$emit('on-back')"
  >
    <svg-go-back class="back-icon" />
  </span>
</template>

<script>
import SvgGoBack from "@/assets/svg/goBack.svg";

export default {
  components: {
    SvgGoBack,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.back-icon {
  width: 40px;
  height: 40px;
}
</style>
