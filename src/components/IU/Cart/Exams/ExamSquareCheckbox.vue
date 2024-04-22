<template>
  <div>
    <label class="checkbox-button">
      <input
        v-model="checked"
        type="checkbox"
        class="checkbox-button__input"
        :class="{ 'checkbox-button__input--disabled': disabled }"
        :disabled="disabled"
        @change="emitChange"
      />
      <span
        class="checkbox-button__control"
        :class="{ 'checkbox-button__control--disabled': disabled }"
        :style="checkboxStyle"
      />
      <span
        v-if="label"
        class="checkbox-button__label"
        :class="{
          'checkbox-button__label--disabled': disabled,
          'font-weight-600': bold,
        }"
        >{{ label }}</span
      >
    </label>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: "",
    },
    propChecked: {
      type: Boolean,
      default: false,
    },
    bold: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    checkboxStyle: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      checked: false,
    };
  },
  watch: {
    propChecked() {
      this.checked = this.propChecked;
    },
  },
  mounted() {
    this.checked = this.propChecked;
  },
  methods: {
    emitChange() {
      this.$emit("on-change", this.checked);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.checkbox-button__label {
  color: $darkgray;
}
.checkbox-button {
  cursor: pointer;
}

input[type="checkbox"] {
  box-sizing: border-box;
  padding: 0;
}

.checkbox-button__input {
  opacity: 0;
  position: absolute;
  font-size: 1rem;
  line-height: 1.5;
  padding: 11px 23px;
  border: 1px solid $blue;
  border-radius: 0;
  outline: 0;
  background-color: transparent;
}

.checkbox-button__control {
  position: relative;
  display: inline-block;
  width: 30px;
  height: 30px;
  margin-right: 4px;
  vertical-align: middle;
  background-color: inherit;
  color: $blue;
  border: 2px solid $blue;
}

.checkbox-button__input:checked + .checkbox-button__control:after {
  content: "";
  display: block;
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  background-color: $blue;
}

.checkbox-button__input:checked + .checkbox-button__control {
  border-color: $blue;
}

.checkbox-button__control {
  transform: scale(0.75);
}

.checkbox-button__input--disabled {
  border: 1px solid $static-gray;
}

.checkbox-button__control--disabled {
  color: $static-gray;
  border: 2px solid $static-gray;
}

.checkbox-button__input--disabled:checked
  + .checkbox-button__control--disabled:after {
  background-color: $static-gray;
}

.checkbox-button__input--disabled:checked
  + .checkbox-button__control--disabled {
  border-color: $static-gray;
}
</style>
