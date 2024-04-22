import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  mixins: [devicesMixin],
  computed: {
    $computedMainContentOffset() {
      if (this.$sideNavFull) return "padding-left: 250px";
      if (this.$sideNavMini) return "padding-left: 110px";
      return "padding-left: 0px";
    },
    $computedNavigationOffset() {
      if (this.$sideNavFull) return "left: 250px; width: calc(100% - 250px)";
      if (this.$sideNavMini) return "left: 110px; width: calc(100% - 110px)";
      return "left: 0px";
    },
    $sideNavFull() {
      return this.$isBigDesktop;
    },
    $sideNavMini() {
      return (this.$isLaptop || this.$isDesktop) && !this.$isBigDesktop;
    },
  },
};
