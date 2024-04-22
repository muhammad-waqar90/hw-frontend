<template>
  <div
    class="fixed-top"
    :style="$computedNavigationOffset"
    :class="{ container: $isDesktop || $isLaptop }"
  >
    <nav
      class="navbar navbar-white nav-outer"
      :class="{
        'bg-white shadow-sm': $isMobile,
        'glass-blur nav-outer--blur-active': $isDesktop || $isLaptop,
      }"
    >
      <div class="container-fluid px-3 px-lg-1">
        <template v-if="$isMobile">
          <div>
            <Menu :size="30" @click="toggleLeftNavigation" />
          </div>
        </template>
        <template v-else>
          <portal-target name="top-nav-left" />
          <div
            v-if="
              enableSalaryScale &&
              !salaryScale &&
              currentRouteName === 'iu-dashboard'
            "
            class="discount-section"
            :key="$router?.currentRoute?.path"
          >
            <span
              >You may be entitled to course discounts based on affordability
              criteria.&nbsp;&nbsp;<u
                @click="openSalaryScaleDialog()"
                class="cursor-pointer"
                >Click here to learn more</u
              ></span
            >
          </div>
        </template>
        <ul class="navbar-nav me-auto" />
        <span v-if="$userIsIU" class="welcome-user d-none d-lg-block me-3"
          >{{ greeting }} {{ firstName }}</span
        >
        <ToggleDayNightMode class="me-3" />
        <NotificationNav class="me-3" />
        <CartNav v-if="$userIsIU" class="me-3" />
        <UserProfileNav />
      </div>
    </nav>
    <div v-if="bottom" class="bottom border border-1">
      <BottomPrivacyPolicy />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import Menu from "vue-material-design-icons/Menu";
import CartNav from "@/components/Navigation/CartNav";
import BottomPrivacyPolicy from "@/components/Navigation/BottomPrivacyPolicy";
import NotificationNav from "@/components/Navigation/NotificationNav";
import UserProfileNav from "@/components/Navigation/UserProfileNav";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import userRoleMixin from "@/mixins/User/userRoleMixin";
import navigationOffsetMixin from "@/mixins/Misc/navigationOffsetMixin";
import ToggleDayNightMode from "@/components/Misc/ToggleDayNightMode.vue";

import { getHours } from "date-fns";

export default {
  components: {
    Menu,
    CartNav,
    BottomPrivacyPolicy,
    NotificationNav,
    UserProfileNav,
    ToggleDayNightMode,
  },
  mixins: [devicesMixin, userRoleMixin, navigationOffsetMixin],
  data() {
    return {
      currentHour: null,
      bottom: false,
    };
  },
  computed: {
    ...mapGetters({
      leftNavigationActive: "ui/getLeftNavigationActive",
      isLoggedIn: "auth/getIsLoggedIn",
      windowScroll: "ui/getWindowScroll",
      firstName: "user/getFirstName",
      salaryScale: "user/getSalaryScale",
      enableSalaryScale: "user/getEnableSalaryScale",
    }),
    greeting() {
      if (this.currentHour === null) return null;
      if (this.currentHour >= 0 && this.currentHour < 12)
        return this.$t("iu.navigation.greetings.goodMorning");
      if (this.currentHour >= 12 && this.currentHour < 18)
        return this.$t("iu.navigation.greetings.goodAfternoon");
      if (this.currentHour >= 18)
        return this.$t("iu.navigation.greetings.goodEvening");
      return null;
    },
    currentRouteName() {
      return this.$route.name;
    },
  },
  watch: {
    $route() {
      this.updateHour();
    },
  },
  mounted() {
    this.updateHour();
  },
  methods: {
    updateHour() {
      this.currentHour = getHours(new Date());
    },
    async logout(e) {
      e.preventDefault();
      await this.$store.dispatch("auth/logout");
      if (this.$route.name !== "homepage")
        this.$router.push({ name: "homepage" });
    },
    toggleLeftNavigation() {
      this.$store.dispatch(
        "ui/setLeftNavigationActive",
        !this.leftNavigationActive
      );
    },
    openSalaryScaleDialog() {
      this.$store.dispatch("user/setSalaryScalePopupFlag", true);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.discount-section {
  background: $blue;
  padding: 10px;
  color: $static-white;
  font-weight: 600;
  text-align: center;
  margin-left: 116px;
  border-radius: 10px;
}
.welcome-user {
  font-family: "Montserrat";
  font-weight: 600;
  color: $darkgray;
}

.nav-outer {
  height: 56px;
  z-index: 1030;
  transition: all 0.3s ease;
}
.mobile-title {
  font-size: 22px;
  position: absolute;
  left: 0;
  right: 0;
  margin: auto;
  width: 50%;
  font-family: "Montserrat", sans-serif;
}
.mobile-blue {
  color: $blue;
}
.nav-outer--blur-active {
  background-color: rgba($lightgray, 0.85);
}

@media (max-width: $laptopWidth) {
  .nav-outer {
    border-radius: 0px;
  }
}
.bottom {
  padding: 20px;
  background-color: white;
  margin-left: 65px;
  position: fixed;
  height: 110px;
  bottom: 0;
  width: 45%;
  border-radius: 25px 25px 0px 0px;
}
</style>
