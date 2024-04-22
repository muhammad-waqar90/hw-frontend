<template>
  <div
    class="fade-outer"
    :style="leftNavigationActive ? 'visibility: visible; opacity: 1' : ''"
    @click="closeLeftNavigation"
  />
</template>

<script>
import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      leftNavigationActive: "ui/getLeftNavigationActive",
    }),
  },
  methods: {
    closeLeftNavigation() {
      this.$store.dispatch("ui/setLeftNavigationActive", false);
    },
  },
};
</script>

<style lang="scss" scoped>
.fade-outer {
  position: fixed;
  left: 0;
  top: 56px;
  width: 100vw;
  height: 120vh;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1020;
  transition: visibility 0s, opacity 0.5s linear;
  visibility: hidden;
  opacity: 0;
}
</style>
