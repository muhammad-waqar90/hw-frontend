<template>
  <div class="d-flex items-center justify-content-center rounded w-100">
    <button
      v-if="!onlyConfirm"
      class="btn white-btn-hollow rounded-card me-4"
      type="button"
      @click="onCancel"
    >
      {{ $t("modal.cancel") }}
    </button>
    <button
      class="btn white-btn-orange-text rounded-card px-4"
      :class="[confirmColor]"
      type="submit"
      @click="onConfirm"
    >
      OK
    </button>
  </div>
</template>

<script>
export default {
  props: { color: null, onlyConfirm: false },
  computed: {
    confirmColor() {
      if (this.color == "green") return "white-btn-green-text";
      if (this.color == "orange") return "white-btn-orange-text";
      return "white-btn-blue-text";
    },
  },
  methods: {
    onConfirm() {
      this.$emit("on-confirm");
    },
    onCancel() {
      this.$emit("on-cancel");
    },
  },
};
</script>
