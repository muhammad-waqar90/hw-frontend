<template>
  <div class="text-dark-gray">
    <div>
      {{ $t("iu.imageVerification.instructions.title") }}
    </div>
    <div class="sections mt-3">
      <span class="number">{{
        $t("iu.imageVerification.instructions.number1")
      }}</span
      >{{ $t("iu.imageVerification.instructions.section1") }}
    </div>
    <div class="sections mt-3">
      <span class="number">{{
        $t("iu.imageVerification.instructions.number2")
      }}</span
      >{{ $t("iu.imageVerification.instructions.section2") }}
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.sections {
  font-size: 16px;
}
.number {
  font-weight: 700;
  color: $blue;
}
</style>
