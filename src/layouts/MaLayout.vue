<template>
  <section class="background-texture--gradient">
    <div class="app-content background-texture">
      <side-navigation :mini="miniNav" />
      <div
        :style="miniNav ? 'margin-left: 100px' : 'margin-left: 250px'"
        style="transition: 0.5s"
      >
        <router-view />
      </div>
    </div>
  </section>
</template>

<script>
import SideNavigation from "@/components/MA/Navigations/SideNavigation";
export default {
  name: "MaLayout",

  components: { SideNavigation },

  data() {
    return {
      miniNav: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.$store.dispatch("theme/setThemeToDayMode");
    },
  },
};
</script>
