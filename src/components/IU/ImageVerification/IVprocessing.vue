<template>
  <div class="py-4 text-color text-center">
    <div class="mb-4">
      <ClockOutline :size="72" />
    </div>
    <div class="mx-2 text-uppercase">
      <h5>{{ $t(`iu.imageVerification.action.${status}`) }}</h5>
    </div>
  </div>
</template>

<script>
import ClockOutline from "vue-material-design-icons/ClockOutline";
export default {
  components: {
    ClockOutline,
  },
  props: {
    status: String,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.text-color {
  color: $gray;
}
</style>
