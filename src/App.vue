<template>
  <div id="app" v-if="authenticationHandled">
    <TopNav />
    <NavigationFade v-if="$isMobile" />
    <OnlineStatus />
    <div>
      <component :is="layout">
        <keep-alive max="5">
          <router-view v-if="$route.meta.keepAlive" :key="$route.fullPath" />
        </keep-alive>
        <router-view v-if="!$route.meta.keepAlive" />
      </component>
    </div>
    <portal-target name="out-of-app-content" multiple />
    <MobileViewModal v-if="!isAnyDesktopOrTabSize" />
  </div>
</template>

<script>
import TopNav from "@/components/Navigation/TopNav.vue";
import toastMixin from "@/mixins/toastMixin";
import OnlineStatus from "@/components/Misc/OnlineStatus.vue";
import MobileViewModal from "@/components/Misc/MobileViewModal/MobileModal.vue";
import {
  validateEmailService,
  validateAgeService,
} from "./services/authService";

import devicesMixin from "@/mixins/Misc/devicesMixin";

import { throttle } from "lodash";

export default {
  components: {
    TopNav,
    OnlineStatus,
    MobileViewModal,
    NavigationFade: () =>
      import(
        /* webpackChunkName: "NavigationFadeComponent" */ "@/components/Navigation/NavigationFade"
      ),
  },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      authenticationHandled: false,
    };
  },

  computed: {
    layout() {
      let layout = null;
      for (const match of this.$route.matched)
        if (match.meta && match.meta.layout) layout = match.meta.layout;

      if (layout) return layout;
      return "div";
    },
    isAnyDesktopOrTabSize() {
      return [
        this.$windowWidth,
        this.$isBigDesktop,
        this.$isDesktop,
        this.$isLaptop,
        this.$isTablet,
      ].some((value) => value === true);
    },
  },

  created() {
    this.onResize();
    const params = new URLSearchParams(window.location.search);
    this.checkValidationToken(params);
    if (localStorage.getItem("token")) this.getUserData();
    else this.authenticationHandled = true;

    this.$store.dispatch("theme/updateThemeClass");
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      window.addEventListener("resize", this.onResize);
      if (!this.$isMobile) window.addEventListener("scroll", this.onScroll);
    },
    checkValidationToken(params) {
      if (params.get("verification_token")) return this.validateEmail(params);
      if (params.get("age_verification_token")) return this.validateAge(params);
    },
    async validateEmail(params) {
      const token = params.get("verification_token");
      const response = await validateEmailService({ token });
      this.$displayServerResponse(response);
      if (!response.error) this.$router.push({ name: "login" });
    },
    async validateAge(params) {
      const token = params.get("age_verification_token");
      const response = await validateAgeService({ token });
      this.$displayServerResponse(response);
      if (!response.error) this.$router.push({ name: "login" });
    },
    async getUserData() {
      await this.$store.dispatch("user/setUserData");
      this.authenticationHandled = true;
    },
    onResize() {
      // set property for dynamic vh changes
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
      //set window width in store
      return this.$store.dispatch("devices/setWindowWidth", window.innerWidth);
    },
    onScroll: throttle(function () {
      this.$store.dispatch("ui/setWindowScroll", window.scrollY);
    }, 50),
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/app.scss";
</style>
