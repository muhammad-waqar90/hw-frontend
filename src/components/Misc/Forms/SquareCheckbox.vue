<template>
  <div>
    <label class="checkbox-button">
      <div class="row">
        <div class="col-8">
          <span v-if="label" class="checkbox-button__label">{{ label }}</span>
        </div>
        <div class="col-4">
          <div class="d-flex align-items-center h-100">
            <input
              v-model="checked"
              type="checkbox"
              class="checkbox-button__input"
              @change="emitChange"
            />
            <span class="checkbox-button__control" />
          </div>
        </div>
      </div>
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
  },
  data() {
    return {
      checked: false,
    };
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
  color: $blue;
  font-size: 18px;
}
.checkbox-button {
  cursor: pointer;
}

input[type="checkbox"] {
  box-sizing: border-box;
  padding: 0;
}

input {
  font-size: 1rem;
  line-height: 1.5;
  padding: 11px 23px;
  border: 1px solid $blue;
  border-radius: 0;
  outline: 0;
  background-color: transparent;
}

.checkbox-button__input {
  opacity: 0;
  position: absolute;
}

.checkbox-button__control {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 36px;
  margin-right: 12px;
  vertical-align: middle;
  background-color: inherit;
  color: $blue;
  border: 2px solid $blue;
}

.checkbox-button__input:checked + .checkbox-button__control:after {
  content: "";
  display: block;
  position: absolute;
  top: 6px;
  left: 6px;
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
</style>
