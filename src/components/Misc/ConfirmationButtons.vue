<template>
  <div class="d-flex items-center justify-content-end rounded w-100">
    <button
      class="btn btn-secondary border me-4"
      type="button"
      @click="onCancel"
    >
      {{ $t("modal.cancel") }}
    </button>
    <button class="btn blue-btn" type="submit" @click="onConfirm">
      {{ $t("modal.confirm") }}
    </button>
  </div>
</template>

<script>
export default {
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
