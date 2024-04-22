<template>
  <div class="color-gray py-5 my-5">
    <div class="pb-2 mt-4 py-2 text-center">
      <span class="pb-2 mt-4 text-center nav-icon">
        <svg-no-data class="icon-xx-large" />
      </span>
    </div>
    <h3 class="col-12 pb-3 my-4 text-center certificate-text">
      {{ text }}
    </h3>
  </div>
</template>

<script>
import SvgNoData from "@/assets/svg/noData.svg";

export default {
  components: {
    SvgNoData,
  },
  props: {
    text: {
      type: String,
      default: null,
    },
  },
};
</script>

<style lang="scss" scoped>
.certificate-text {
  color: rgb(186, 198, 216);
  font-size: 26px;
}
</style>
