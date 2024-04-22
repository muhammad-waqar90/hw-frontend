<template>
  <div class="d-flex">
    <div
      class="navigation-button profile cursor-pointer rounded-circle position-relative"
      @click="toggleDropdown"
    >
      <div class="position-absolute text-center" :title="userName">
        {{ userInitials }}
      </div>
    </div>
    <NavDropdown v-if="showDropdown" @close-dropdown="closeDropdown" />
  </div>
</template>

<script>
import NavDropdown from "@/components/Navigation/UserProfileNav/NavDropdown";

import { mapGetters } from "vuex";

export default {
  components: {
    NavDropdown,
  },
  data() {
    return {
      showDropdown: false,
    };
  },
  computed: {
    ...mapGetters({
      userInitials: "user/getInitials",
      userName: "user/getName",
    }),
    /* profileBackground () {
      return getColorFromString(this.userName);
    }, */
  },
  methods: {
    toggleDropdown() {
      setTimeout(() => {
        this.$store.dispatch("ui/setLeftNavigationActive", false);
        this.showDropdown = !this.showDropdown;
      }, 0);
    },
    closeDropdown() {
      setTimeout(() => {
        this.showDropdown = false;
      }, 0);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/shared/navButtons.scss";
@import "@/assets/sass/_variables.scss";
.profile {
  background-color: $blue;
  color: $static-white;
  border: 1px solid #ccd0db;
  outline-offset: 2px;
}
</style>
