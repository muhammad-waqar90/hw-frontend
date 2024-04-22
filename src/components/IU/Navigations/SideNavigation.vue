<template>
  <nav
    class="side-navigation side-navigation-wide"
    :class="{
      'side-navigation-small': displayMini,
      'side-navigation-mobile': displayMobile,
      'side-navigation-mobile--active': displayMobile && leftNavigationActive,
    }"
  >
    <div
      class="bg-white mb-5"
      :class="{
        'p-2 mini-rounded-bottom': displayMini,
        'px-3 pt-3 pb-2 full-rounded-bottom': !displayMini,
      }"
    >
      <router-link
        :to="{ name: 'iu-dashboard' }"
        class="navbar-brand"
        :title="'Hijaz World'"
        @click.native="closeLeftNavigation"
      >
        <img
          :src="displayMini ? '/img/logo-small.png' : '/img/logo.png'"
          width="30"
          height="30"
          alt=""
        />
      </router-link>
    </div>
    <ul class="ps-0 list-unstyled">
      <li class="mb-2">
        <router-link
          :to="{ name: 'iu-dashboard' }"
          class="nav-link"
          :title="$t('iu.navigation.home')"
          @click.native="closeLeftNavigation"
        >
          <span class="icon-circle">
            <svg-home class="icon-small" />
          </span>
          <div v-if="!displayMini" class="nav-link-text">
            {{ $t("iu.navigation.home") }}
          </div>
        </router-link>
      </li>

      <li class="mb-2">
        <router-link
          :to="{ name: 'iu-courses' }"
          class="nav-link"
          :title="$t('iu.navigation.course')"
          @click.native="closeLeftNavigation"
        >
          <span class="icon-circle">
            <svg-course class="icon-small" />
          </span>
          <div v-if="!displayMini" class="nav-link-text">
            {{ $t("iu.navigation.course") }}
          </div>
        </router-link>
      </li>

      <li class="mb-2">
        <router-link
          :to="{ name: 'iu-shop' }"
          class="nav-link"
          :title="$t('iu.navigation.book')"
          @click.native="closeLeftNavigation"
        >
          <span class="icon-circle">
            <svg-book class="icon-small" />
          </span>
          <div v-if="!displayMini" class="nav-link-text">
            {{ $t("iu.navigation.book") }}
          </div>
        </router-link>
      </li>

      <li class="mb-2">
        <router-link
          :to="{ name: 'iu-events' }"
          class="nav-link"
          :title="$t('iu.navigation.event')"
          @click.native="closeLeftNavigation"
        >
          <span class="icon-circle">
            <svg-event class="icon-small" />
          </span>
          <div v-if="!displayMini" class="nav-link-text">
            {{ $t("iu.navigation.event") }}
          </div>
        </router-link>
      </li>

      <li class="mb-2">
        <router-link
          :to="{ name: 'iu-faq-dashboard' }"
          class="nav-link"
          :title="$t('iu.navigation.support')"
          @click.native="closeLeftNavigation"
        >
          <span class="icon-circle">
            <svg-support class="icon-small" />
          </span>
          <div v-if="!displayMini" class="nav-link-text">
            {{ $t("iu.navigation.support") }}
          </div>
        </router-link>
      </li>

      <li class="mb-2">
        <router-link
          :to="{ name: 'iu-profile' }"
          class="nav-link"
          :title="$t('iu.navigation.profile')"
          @click.native="closeLeftNavigation"
        >
          <span class="icon-circle">
            <svg-profile class="icon-small" />
          </span>
          <div v-if="!displayMini" class="nav-link-text">
            {{ $t("iu.navigation.profile") }}
          </div>
        </router-link>
      </li>
    </ul>

    <div class="mt-auto">
      <div v-if="displayMini" class="ex-nav-link nav-link-text beta-label">
        {{ $t("iu.navigation.beta") }}
      </div>
      <div v-if="!displayMini" class="ex-nav-link nav-link-text beta-label">
        {{ $t("iu.navigation.betaRelease") }}
      </div>
    </div>
  </nav>
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { mapGetters } from "vuex";

import SvgHome from "@/assets/svg/home.svg";
import SvgBook from "@/assets/svg/book.svg";
import SvgEvent from "@/assets/svg/event.svg";
import SvgSupport from "@/assets/svg/support.svg";
import SvgProfile from "@/assets/svg/profile.svg";
import SvgCourse from "@/assets/svg/course.svg";

export default {
  name: "SideNavigation",
  components: {
    SvgHome,
    SvgCourse,
    SvgBook,
    SvgEvent,
    SvgSupport,
    SvgProfile,
    // SvgCart,
  },
  mixins: [devicesMixin],
  computed: {
    ...mapGetters({
      leftNavigationActive: "ui/getLeftNavigationActive",
    }),
    displayFull() {
      return this.$isBigDesktop;
    },
    displayMini() {
      return (this.$isLaptop || this.$isDesktop) && !this.$isBigDesktop;
    },
    displayMobile() {
      return this.$isMobile;
    },
  },
  methods: {
    closeLeftNavigation() {
      this.$store.dispatch("ui/setLeftNavigationActive", false);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.font-16 {
  font-size: 16px;
}
.icon-circle {
  background-color: transparent;
  color: $static-white;
  fill: $static-white;
  border: 1.5px solid $static-white;
  border-radius: 100%;
  padding: 0.5rem;
  line-height: 0;
}
.full-rounded-bottom {
  border-radius: 0 0 30px 30px;
}
.mini-rounded-bottom {
  border-radius: 0 0 50px 50px;
}
.bg-white {
  background-color: $static-white !important;
}
.side-navigation {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1030;
  top: 0;
  left: 0;
  overflow-x: hidden;
  transition: 0.5s;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  text-align: center;
  background-color: $primaryblue;
  /*   @media(min-width: $bigDesktopWidth) {
    left: 50%;
    //658 because (1320 + 24 / 2) - 2px
    // -2px because of diff in spacing 16 and 12
    transform: translate(calc(-50% - 658px), 0);
  } */

  .navbar-brand {
    margin: 0;

    img {
      width: 100%;
      height: 70px;
      object-fit: contain;
    }
  }

  &.side-navigation-wide {
    width: 250px;
    text-align: left;

    .navbar-brand {
      img {
        height: 70px;
      }
    }
  }

  &.side-navigation-small {
    padding-left: 14px;
    padding-right: 14px;
    width: 110px;
    text-align: center;

    .nav-link {
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }

    .ex-nav-link {
      width: fit-content;
      margin-left: auto;
      margin-right: auto;
    }
  }
  &.side-navigation-mobile {
    width: 40vw;
    transform: translateX(-40vw);
    padding-top: 0px;
    margin-top: 56px;
    padding-bottom: 75px;
  }
  @media (max-width: $bigPhoneWidth) {
    &.side-navigation-mobile {
      width: 70vw;
      transform: translateX(-70vw);
    }
  }
  &.side-navigation-mobile--active {
    transform: translateX(0);
  }
}
.nav-link {
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 50px;
}
.nav-link-text {
  color: $static-white;
  margin-left: 1em;
}
.beta-label {
  background-color: $red !important;
  font-size: 14px;
  font-weight: bold;
  justify-content: center;
}
.nav-link.router-link-active {
  background-color: #0a4e82;
}
.router-link-active {
  .icon-circle {
    border: none;
    background-color: $orange;
  }
}

.ex-nav-link {
  text-decoration: none;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 50px;
  background-color: $orange;
}
</style>
