<template>
  <div class="item rounded-card animated-loading-background" />
</template>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item {
  display: inline-block;
  height: 100%;
  width: 100%;
}

@media (max-width: $tabletWidth) {
  .item {
    width: 100%;
    height: 100%;
  }
}
</style>
