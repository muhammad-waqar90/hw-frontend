<template>
  <!-- TODO: full screen application global level loader -->
  <div v-if="!isLoggedIn" class="container">
    <main role="main" class="inner cover mt-5">
      <h1 class="cover-heading text-dark-gray text-center">
        <!-- {{ $t("homepage.welcome") }} -->
      </h1>
      <p class="lead" />
    </main>
  </div>
</template>

<script>
import {
  ADMIN,
  HEAD_ADMIN,
  INDEPENDENT_USER,
  MASTER_ADMIN,
} from "@/dataObject/roles";
import { mapState } from "vuex";
export default {
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      if (!vm.$store.getters["auth/getIsLoggedIn"]) {
        next("/login");
        return;
      }
      if (vm.$store.getters["user/getRoleId"] == INDEPENDENT_USER) {
        next("/iu");
        return;
      }
      if (vm.$store.getters["user/getRoleId"] == ADMIN) {
        next("/af");
        return;
      }
      if (vm.$store.getters["user/getRoleId"] == HEAD_ADMIN) {
        next("/ha");
        return;
      }
      if (vm.$store.getters["user/getRoleId"] == MASTER_ADMIN) {
        next("/ma");
        return;
      }

      next();
    });
  },
  computed: {
    ...mapState("auth", ["isLoggedIn"]),
  },
};
</script>
