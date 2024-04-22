<template>
  <div>
    <div>
      <div class="btn blue-btn rounded-pill px-5 disableEvent">
        £ {{ roundedPrice }}
      </div>
    </div>
    <div class="mt-3">
      <div
        class="btn green-btn rounded-pill px-5 text-uppercase"
        @click="addToCart"
      >
        {{ $t("iu.quiz.addToCart") }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    examDetails: {
      type: Object,
    },
  },
  computed: {
    roundedPrice() {
      return this.examDetails.price.toFixed(2);
    },
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart");
    },
  },
};
</script>

<style scoped>
.disableEvent {
  pointer-events: none;
}
</style>
