import { mapGetters } from "vuex";

import {
  INDEPENDENT_USER,
  ADMIN,
  HEAD_ADMIN,
  MASTER_ADMIN,
} from "@/dataObject/roles";

export default {
  computed: {
    ...mapGetters({
      $userRoleId: "user/getRoleId",
      $isLoggedIn: "auth/getIsLoggedIn",
    }),
    $userIsIU() {
      return this.$userRoleId == INDEPENDENT_USER;
    },
    $userIsAF() {
      return this.$userRoleId == ADMIN;
    },
    $userIsHA() {
      return this.$userRoleId == HEAD_ADMIN;
    },
    $userIsMA() {
      return this.$userRoleId == MASTER_ADMIN;
    },
    $userIsGU() {
      return !this.$isLoggedIn;
    },
    $userIsAdmin() {
      return (
        this.$userRoleId == ADMIN ||
        this.$userRoleId == HEAD_ADMIN ||
        this.$userRoleId == MASTER_ADMIN
      );
    },
  },
};
