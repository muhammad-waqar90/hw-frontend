<template>
  <div class="row rounded-card gray-container mx-1 px-2 py-2">
    <div class="col-12 col-md-8 text-center text-md-start">
      <h5 class="text-secondary m-0">
        {{ $t("iu.imageVerification.photoValidation") }}
      </h5>
    </div>
    <div
      class="col-12 col-md-4 text-center text-md-end text-green text-uppercase"
    >
      {{ $t("iu.imageVerification.status.completed") }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.text-green {
  color: $green;
}
.gray-container {
  background-color: $lightgray;
}
</style>
