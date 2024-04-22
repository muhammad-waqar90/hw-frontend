<template>
  <div class="my-2 d-flex justify-content-end">
    <div class="d-flex">
      <div class="position-relative ms-4 d-flex align-items-baseline">
        <label class="me-5"
          ><b>Selected Items: {{ selectedItemsCount }} </b></label
        >
        <button
          :disabled="selectedItemsCount <= 0"
          class="btn blue-btn"
          @click="onProceedToRefund"
        >
          Proceed To Refund
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProceedToRefund",
  props: {
    selectedItemsCount: { type: Number },
  },
  methods: {
    onProceedToRefund() {
      this.$emit("on-proceed-to-refund");
    },
  },
};
</script>
