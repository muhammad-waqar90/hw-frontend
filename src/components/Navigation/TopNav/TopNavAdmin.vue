<template>
  <div class="fixed-top">
    <nav class="navbar navbar-white nav-outer bg-white shadow-sm">
      <div class="container-fluid">
        <ul class="navbar-nav me-auto" />
        <NotificationNav class="me-3" />
        <UserProfileNav />
      </div>
    </nav>
  </div>
</template>

<script>
import NotificationNav from "@/components/Navigation/NotificationNav";
import UserProfileNav from "@/components/Navigation/UserProfileNav";

import userRoleMixin from "@/mixins/User/userRoleMixin";

export default {
  components: {
    NotificationNav,
    UserProfileNav,
  },
  mixins: [userRoleMixin],
  methods: {
    async logout(e) {
      e.preventDefault();
      await this.$store.dispatch("auth/logout");
      if (this.$route.name !== "homepage")
        this.$router.push({ name: "homepage" });
    },
  },
};
</script>

<style lang="scss" scoped>
.nav-outer {
  height: 56px;
  z-index: 1030;
  transition: all 0.3s ease;
}
</style>
