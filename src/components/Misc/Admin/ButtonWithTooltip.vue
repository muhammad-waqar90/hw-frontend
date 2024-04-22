<template>
  <span
    class="cursor-not-allowed d-inline-block"
    :class="{ 'cursor-not-allowed': disabled }"
    :title="disabled && message"
  >
    <button
      type="button"
      :class="btnClass"
      :disabled="disabled"
      @click="onClick"
    >
      {{ label }}
      <slot name="body" />
    </button>
  </span>
</template>

<script>
export default {
  name: "ButtonWithTooltip",
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    label: {
      type: String,
      default: "",
    },
    message: {
      type: String,
      default: "",
    },
    btnClass: {
      type: String,
      default: "btn blue-btn",
    },
  },
  methods: {
    onClick() {
      this.$emit("on-click");
    },
  },
};
</script>
