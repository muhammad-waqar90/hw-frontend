<template>
  <div class="py-4 text-color text-center">
    <div class="mb-4">
      <Close :size="72" />
    </div>
    <div class="mx-2 text-uppercase">
      <h5>{{ $t(`iu.imageVerification.action.${status}`) }}</h5>
    </div>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/Close";
export default {
  components: {
    Close,
  },
  props: {
    status: String,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.text-color {
  color: $red;
}
</style>
