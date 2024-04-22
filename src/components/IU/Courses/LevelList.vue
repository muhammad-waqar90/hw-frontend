<template>
  <div
    class="d-flex justify-content-between justify-content-lg-start align-items-center text-uppercase overflow-auto scrollbar-blue"
  >
    <span
      v-for="level in levels"
      :key="level.value"
      :class="[level.value === active ? 'orange-btn' : 'gray-btn-text']"
      class="btn font-btn rounded-card position-relative truncate font-weight-600 cursor-pointer mb-2 mx-2 py-1 px-4"
      @click="activate(level)"
    >
      {{ level.name }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    courseLevels: [],
    disabled: false,
  },
  data() {
    return {
      levels: [],
      active: 1,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.levels = [];
      this.courseLevels.forEach((level) => {
        this.levels.push({
          name: level.name,
          value: level.value,
          enabled: !this.disabled,
        });
      });
    },
    activate(level) {
      if (this.active === level.value || !level.enabled) return;
      this.active = level.value;
      this.$emit("level-change", level.value);
    },
  },
};
</script>

<style lang="scss" scoped>
.font-btn {
  font-size: 13px;
}
</style>
