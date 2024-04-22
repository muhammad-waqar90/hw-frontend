<template>
  <div>
    <div class="text-center title font-weight-600">
      {{ $t("iu.ebook.haveTriedYet") }}
    </div>
    <div class="text-center mt-3 text-secondary">
      {{ $t("iu.ebook.desc") }}
    </div>
    <div class="mt-5 d-flex justify-content-center">
      <button
        class="btn btn-outline-secondary rounded-card buttons me-4 text-uppercase"
        @click="onDismiss"
      >
        {{ $t("iu.ebook.dismiss") }}
      </button>
      <button
        class="btn blue-btn text-white rounded-card buttons text-uppercase"
        @click="onBuy"
      >
        {{ $t("iu.ebook.buy") }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onBuy() {
      this.$emit("on-buy");
    },
    onDismiss() {
      this.$emit("on-cancel");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.buttons {
  width: 150px;
}
.title {
  color: $blue;
  font-size: 20px;
}

@media (max-width: $tabletWidth) {
  .buttons {
    width: 120px;
  }
}
</style>
