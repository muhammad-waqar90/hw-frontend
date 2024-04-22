<template>
  <div class="d-flex align-item-center px-1">
    <div
      :class="[{ checked: checked }]"
      class="d-flex justify-content-center align-items-center cursor-pointer checkbox"
      @click="toggleCheck"
    >
      <svg-check v-if="checked" class="icon-checkbox" />
    </div>
    <div class="ms-2 d-flex align-items-center text-dark-gray">
      <span v-if="label" class="label">{{ label }}</span>
    </div>
  </div>
</template>

<script>
import SvgCheck from "@/assets/svg/check.svg";
export default {
  components: {
    SvgCheck,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    propChecked: {
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
    toggleCheck() {
      this.checked = !this.checked;
      this.emitChange();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.checkbox {
  width: 30px;
  height: 30px;
  color: $blue;
  border-radius: 10px;
  border: 2px solid $blue;
}
.icon-checkbox {
  width: 15px;
  height: 15px;
  fill: $static-white;
}
.checked {
  color: $static-white;
  background-color: $blue;
}
.label {
  font-size: 12px;
}
</style>
