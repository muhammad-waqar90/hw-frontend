<template>
  <nav
    class="navbar navbar-white bg-white text-dark-gray fixed-top nav-outer shadow-sm py-0"
  >
    <div class="container px-3">
      <router-link
        :to="{ name: 'homepage' }"
        class="navbar-brand mb-0 h1 fw-bold subtle-link"
      >
        <img
          :src="darkMode ? '/img/dark-logo.png' : '/img/logo.png'"
          width="30"
          height="30"
          alt="Hijaz World"
        />
      </router-link>
      <ul class="navbar-nav me-auto" />
      <ToggleDayNightMode class="me-3" />
      <CartNav class="me-3" />
      <router-link
        id="navigationLogin"
        class="my-2 my-lg-0 me-3 cursor-pointer subtle-link"
        :to="{ name: 'login' }"
      >
        {{ $t("navigation.login") }}
      </router-link>
      <router-link
        id="navigationRegister"
        class="my-2 my-lg-0 cursor-pointer subtle-link"
        :to="{ name: 'register' }"
      >
        {{ $t("navigation.register") }}
      </router-link>
    </div>
  </nav>
</template>

<script>
import CartNav from "@/components/Navigation/CartNav";
import ToggleDayNightMode from "@/components/Misc/ToggleDayNightMode.vue";
import { mapGetters } from "vuex";

export default {
  components: {
    CartNav,
    ToggleDayNightMode,
  },
  computed: {
    darkMode() {
      return this.theme == "night-mode" ? true : false;
    },
    ...mapGetters({
      theme: "theme/getThemeMode",
    }),
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.nav-outer {
  height: 56px;
  z-index: 1030;
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

.navbar-brand {
  margin: 0;

  img {
    width: 90px;
    height: 40px;
    object-fit: contain;
  }
}
</style>
