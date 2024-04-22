<template>
  <!-- When manually creating the component, props passed are reactive when defined as an data in the instance where its created -->
  <!-- Making data here will result in unwanted behaviour -->
  <!-- NOTE: This component is meant to be used ONLY IF MANUALLY MADE -->
  <portal v-if="root == 'app' && hasBack" to="top-nav-left">
    <span
      class="cursor-pointer d-flex align-items-center"
      @click.stop="$emit('on-back')"
    >
      <svg-go-back class="back-icon" />
    </span>
  </portal>
  <div v-else-if="hasBack" class="d-flex">
    <div class="cursor-pointer col-auto mb-3" @click.stop="$emit('on-back')">
      <svg-go-back class="back-icon" />
    </div>
  </div>
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
