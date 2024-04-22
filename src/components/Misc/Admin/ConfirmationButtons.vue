<template>
  <div
    class="px-5 py-3 bg-light w-100 d-flex align-items-center justify-content-end rounded w-100"
  >
    <button
      class="btn btn-light border me-4"
      type="button"
      :disabled="disabled"
      @click="onCancel"
    >
      {{ modalText.cancel }}
      <span
        v-if="disabled && cancelClicked"
        class="spinner-border spinner-border-sm mx-1"
        role="status"
        aria-hidden="true"
      />
    </button>
    <button
      class="btn blue-btn"
      :disabled="disabled"
      type="submit"
      @click="onConfirm"
    >
      {{ modalText.confirm }}
      <span
        v-if="disabled && confirmClicked"
        class="spinner-border spinner-border-sm mx-1"
        role="status"
        aria-hidden="true"
      />
    </button>
  </div>
</template>

<script>
import { modalText } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      modalText,
      cancelClicked: false,
      confirmClicked: false,
    };
  },
  methods: {
    onConfirm() {
      this.cancelClicked = false;
      this.confirmClicked = true;
      this.$emit("on-confirm");
    },
    onCancel() {
      this.confirmClicked = false;
      this.cancelClicked = true;
      this.$emit("on-cancel");
    },
  },
};
</script>
