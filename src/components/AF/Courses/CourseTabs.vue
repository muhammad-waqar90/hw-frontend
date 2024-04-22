<template>
  <div class="d-flex justify-content-between py-4">
    <div class="d-flex">
      <div>
        <span
          :class="[
            tab === 'course_info'
              ? 'active-tab rounded fw-bold'
              : 'inactive-tab text-dark border',
          ]"
          class="p-3 cursor-pointer"
          @click.prevent="!(tab === 'course_info') && setTab('course_info')"
          >COURSE INFO</span
        >
      </div>
      <div>
        <span
          :class="[
            tab === 'course_content'
              ? 'active-tab rounded fw-bold'
              : 'inactive-tab text-dark border',
            mode === 'create' && 'disabled-tab',
          ]"
          class="p-3 cursor-pointer"
          @click.prevent="
            !(tab === 'course_content' || mode === 'create') &&
              setTab('course_content')
          "
          >COURSE CONTENT</span
        >
      </div>
      <div>
        <span
          :class="[
            tab === 'course_exam'
              ? 'active-tab rounded fw-bold'
              : 'inactive-tab text-dark border',
            mode === 'create' && 'disabled-tab',
          ]"
          class="p-3 cursor-pointer"
          @click.prevent="
            !(tab === 'course_exam' || mode === 'create') &&
              setTab('course_exam')
          "
          >BULK UPLOAD</span
        >
      </div>
      <div v-if="$isSalaryScaleManager">
        <span
          :class="[
            tab === 'course_discount'
              ? 'active-tab rounded fw-bold'
              : 'inactive-tab text-dark border',
            mode === 'create' && 'disabled-tab',
          ]"
          class="p-3 cursor-pointer"
          @click.prevent="!(mode === 'create') && setTab('course_discount')"
          >COURSE DISCOUNT</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import permissionsMixin from "@/mixins/AF/permissionsMixin.js";

export default {
  name: "CourseTabs",
  mixins: [permissionsMixin],
  props: {
    tab: {
      type: String,
      default: "course_info",
    },
    mode: {
      type: String,
      default: "",
    },
  },
  methods: {
    setTab(item) {
      this.$emit("set-tab", item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.active-tab {
  background-color: $blue;
  border-color: $blue;
  color: $static-white;
}
.inactive-tab {
  background-color: $lightgray;
}
.disabled-tab {
  color: #d4d4d4 !important;
  cursor: not-allowed !important;
  pointer-events: none;
}
</style>
