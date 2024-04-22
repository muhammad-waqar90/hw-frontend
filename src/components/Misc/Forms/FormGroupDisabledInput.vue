<template>
  <div class="form-group">
    <label class="text-secondary mb-1" :for="tKey">
      {{ $t(`${tModule}.labels.${tKey}`) }}
    </label>
    <input
      :id="tKey"
      :type="type"
      disabled
      class="form-control disabled"
      :placeholder="placeholder"
      :value="value"
    />
  </div>
</template>

<script>
export default {
  name: "FormGroupDisabledInput",
  props: {
    type: {
      type: String,
      default: "name",
    },
    tKey: {
      type: String,
      default: "",
    },
    tModule: {
      type: String,
      default: "",
    },
    value: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
};
</script>
