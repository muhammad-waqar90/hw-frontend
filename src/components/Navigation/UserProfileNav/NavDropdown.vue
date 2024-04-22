<template>
  <div
    v-click-outside="closeDropdown"
    class="position-absolute border-light bg-lightgray shadow dropdown-outer py-3 px-3 rounded-card text-end"
    :class="{
      'mob-tab-dropdown-outer rounded-4 text-start': $isPhone || $isTablet,
    }"
    @click="closeDropdown"
  >
    <!--     <template v-if="$userIsIU">
      <div class="mb-2">
        <router-link
          to="/iu/profile"
          class="cursor-pointer subtle-link item-link d-block"
        >
          <span class="link-text">
            {{ $t("iu.navigation.profile") }}
          </span>
          <span class="ms-3 icon-outer rounded-circle">
            <AccountOutline :size="24" />
          </span>
        </router-link>
      </div>
      <div class="mb-2">
        <router-link
          :to="{ name: 'iu-settings' }"
          class="cursor-pointer subtle-link item-link d-block"
        >
          <span class="link-text">
            {{ $t("iu.navigation.setting") }}
          </span>
          <span class="ms-3 icon-outer rounded-circle">
            <CogOutline :size="24" />
          </span>
        </router-link>
      </div>
      <div
        class="mb-2"
        @click="closeDropdown"
      >
        <a
          href="#"
          class="cursor-pointer subtle-link item-link d-block"
        >
          <span class="link-text">
            {{ $t("iu.navigation.shop") }}
          </span>
          <span class="ms-3 icon-outer rounded-circle">
            <CartOutline :size="24" />
          </span>
        </a>
      </div>
    </template> -->
    <div>
      <a
        href="#"
        class="cursor-pointer subtle-link item-link d-block"
        :class="{ 'py-1': $isPhone, 'py-2 px-2': $isTablet }"
        @click="logout"
      >
        <span class="link-text">
          {{ $t("navigation.logout") }}
        </span>
        <span
          class="ms-3 icon-outer rounded-circle"
          :class="{ 'mob-tab-icon-outer': $isPhone || $isTablet }"
        >
          <LogoutIcon :size="iconSize" />
        </span>
      </a>
    </div>
  </div>
</template>

<script>
import LogoutIcon from "vue-material-design-icons/LogoutVariant";
// import AccountOutline from 'vue-material-design-icons/AccountOutline'
// import CogOutline from 'vue-material-design-icons/CogOutline'
// import CartOutline from 'vue-material-design-icons/CartOutline'
import userRoleMixin from "@/mixins/User/userRoleMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    LogoutIcon,
    // AccountOutline,
    // CogOutline,
    // CartOutline
  },

  mixins: [userRoleMixin, devicesMixin],

  data() {
    return {
      showNotifications: false,
    };
  },
  computed: {
    iconSize() {
      return this.$isPhone ? 16 : this.$isTablet ? 18 : 24;
    },
  },

  methods: {
    async logout(e) {
      e.preventDefault();
      await this.$store.dispatch("auth/logout");
      if (this.$route.name !== "homepage")
        this.$router.push({ name: "homepage" });
    },

    closeDropdown() {
      this.$emit("close-dropdown");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.bg-lightgray {
  background-color: $lightgray;
}

.dropdown-outer {
  right: 11px;
  top: 66px;
  width: 200px;
  box-shadow: 1px 1px 10px #9e9e9e, 1px 1px 10px #9e9e9e;
}
.mob-tab-dropdown-outer {
  right: 11px;
  top: 52px;
  width: auto;
  box-shadow: 1px 1px 10px #9e9e9e, 1px 1px 10px #9e9e9e;
  padding: 0.25rem 0.5rem !important;
}
.icon-outer {
  background: $blue;
  color: $static-white;
  padding: 6px 7px;
}
.mob-tab-icon-outer {
  padding: 0px 5px 4px 5px;
}

.link-text {
  font-family: "Montserrat";
  font-size: 14px;
  font-weight: 600;
  color: $darkgray;
}
.item-link {
  span {
    display: inline-block;
  }
}
.border-light {
  border: 1px solid $darkgray;
}
</style>
