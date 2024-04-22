<template>
  <section :class="{ 'breadcrumbs-wrapper': colorHierarchy }">
    <span
      v-for="(crumb, idx) in crumbs"
      :key="crumb.id"
      :class="customClass"
      class="text-capitalize"
    >
      {{ crumb.name }}
      <span v-if="idx !== crumbs.length - 1"> > </span>
    </span>
  </section>
</template>

<script>
export default {
  name: "BreadCrumbs",
  props: {
    crumbs: {
      type: Array,
    },
    colorHierarchy: {
      type: Boolean,
      default: false,
    },
    customClass: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/_variables.scss";
.breadcrumbs-wrapper {
  span {
    color: $darkgray;
  }
}

.small-font {
  font-size: 14px;
}
</style>
