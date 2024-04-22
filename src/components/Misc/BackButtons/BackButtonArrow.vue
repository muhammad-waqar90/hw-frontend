<template>
  <span>
    <button
      class="btn btn-secondary btn-arrow-left text-white px-5 text-uppercase rounded-card"
      @click="$emit('on-back')"
    >
      {{ $t("general.back") }}
    </button>
  </span>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
</style>
