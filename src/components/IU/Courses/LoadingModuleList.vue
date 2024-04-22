<template>
  <div>
    <div
      class="animated-loading-background rounded-card-bottom loading-height mb-3"
    />
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.loading-height {
  height: 385px;
}

@media (max-width: $tabletWidth) {
  .loading-height {
    height: 738px;
  }
}
</style>
