<template>
  <div :title="isNightMode ? $t('themes.btnNight') : $t('themes.btnDay')">
    <light-moon
      v-if="!isNightMode"
      class="cursor-pointer"
      @click="toggleTheme"
    />
    <dark-moon v-if="isNightMode" class="cursor-pointer" @click="toggleTheme" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import DarkMoon from "@/assets/svg/LightAndDarkMode/dark-moon.svg";
import LightMoon from "@/assets/svg/LightAndDarkMode/light-moon.svg";

export default {
  components: { DarkMoon, LightMoon },
  computed: {
    ...mapGetters({
      isNightMode: "theme/isNightMode",
    }),
  },
  methods: {
    toggleTheme() {
      if (this.isNightMode) {
        this.$store.dispatch("theme/setThemeToDayMode");
      } else {
        this.$store.dispatch("theme/setThemeToNightMode");
      }
    },
  },
};
</script>
