<template>
  <button
    v-if="propagination"
    :disabled="loading || disabled"
    @click="$emit('action')"
  >
    <slot />
    <span
      v-show="loading"
      class="spinner-border"
      :class="smallSpinner ? 'spinner-border-xsm' : 'spinner-border-sm'"
      role="status"
      aria-hidden="true"
    />
  </button>
  <button
    v-else-if="!isSubmit"
    :disabled="loading || disabled"
    @click.stop="$emit('action')"
  >
    <slot />
    <span
      v-show="loading"
      class="spinner-border"
      :class="smallSpinner ? 'spinner-border-xsm' : 'spinner-border-sm'"
      role="status"
      aria-hidden="true"
    />
  </button>
  <button v-else-if="isSubmit" :disabled="loading || disabled" type="submit">
    <slot />
    <span
      v-show="loading"
      class="spinner-border"
      :class="smallSpinner ? 'spinner-border-xsm' : 'spinner-border-sm'"
      role="status"
      aria-hidden="true"
    />
  </button>
</template>

<script>
export default {
  name: "ButtonWithLoading",
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
    smallSpinner: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      defautl: false,
    },
    isSubmit: {
      type: Boolean,
      default: false,
    },
    propagination: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style>
.spinner-border-xsm {
  --bs-spinner-width: 0.6rem !important;
  --bs-spinner-height: 0.6rem;
  --bs-spinner-border-width: 0.2em;
}
</style>
