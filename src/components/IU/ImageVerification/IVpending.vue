<template>
  <div class="py-4 text-color text-center">
    <div class="mb-4">
      <FileImageOutline :size="72" />
    </div>
    <div class="mx-2 text-uppercase">
      <h5>{{ $t(`iu.imageVerification.action.${status}`) }}</h5>
    </div>
  </div>
</template>

<script>
import FileImageOutline from "vue-material-design-icons/FileImageOutline";
export default {
  components: {
    FileImageOutline,
  },
  props: {
    status: String,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.text-color {
  color: $blue;
}
</style>
