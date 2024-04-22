<template>
  <div>
    <TopNavUser v-if="isLoggedIn && $userIsIU" />
    <TopNavAdmin v-else-if="isLoggedIn && $userIsAdmin" />
    <TopNavGuest v-else />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import TopNavUser from "@/components/Navigation/TopNav/TopNavUser";
import TopNavAdmin from "@/components/Navigation/TopNav/TopNavAdmin";
import TopNavGuest from "@/components/Navigation/TopNav/TopNavGuest";

import userRoleMixin from "@/mixins/User/userRoleMixin";

export default {
  components: {
    TopNavUser,
    TopNavAdmin,
    TopNavGuest,
  },
  mixins: [userRoleMixin],
  computed: {
    ...mapGetters({
      isLoggedIn: "auth/getIsLoggedIn",
    }),
  },
};
</script>
