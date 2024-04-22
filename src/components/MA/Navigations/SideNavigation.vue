<template>
  <nav
    class="side-navigation side-navigation-wide"
    :class="{ 'side-navigation-wide': !mini }"
  >
    <ul class="nav flex-column">
      <router-link :to="{ name: 'ma-dashboard' }" class="navbar-brand mb-4">
        <img
          :src="mini ? '/img/logo-small.png' : '/img/logo.png'"
          width="30"
          height="30"
          alt=""
        />
      </router-link>

      <li class="nav-item">
        <!-- TODO: use router link and translations -->
        <router-link to="/ma/dashboard" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Dashboard</div>
        </router-link>
        <router-link to="/ma/creation-requests" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Creation Requests</div>
        </router-link>
        <router-link to="/ma/ha" class="nav-link">
          <account-group :size="33" />
          <div class="nav-link-text">Head Administrators</div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import ViewDashboardIcon from "vue-material-design-icons/ViewDashboard";
import AccountGroup from "vue-material-design-icons/AccountGroup";

export default {
  name: "AdminSideNavigation",

  components: {
    ViewDashboardIcon,
    AccountGroup,
  },

  props: { mini: true },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.side-navigation {
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #fff;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;

  .navbar-brand {
    margin: 0;

    img {
      width: 100%;
      height: 70px;
      object-fit: contain;
    }
  }

  .nav-link {
    color: #d4d4d4;
    cursor: pointer;
    &.router-link-active {
      color: $orange;
    }
  }

  .nav-link-text {
    display: none;
  }

  &.side-navigation-wide {
    width: 250px;
    padding-left: 30px;
    padding-right: 30px;
    text-align: left;

    .navbar-brand {
      img {
        height: 70px;
      }
    }

    .nav-link {
      padding: 3px 8px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .nav-link-text {
        color: #b3b3b3;
        margin-left: 7.5px;
        font-weight: 500;
      }

      &.router-link-active {
        color: $orange;
        background-color: $blue;
        border-radius: 50px;
        .nav-link-text {
          color: #fff;
        }
      }
    }
    .nav-link-text {
      display: block;
    }
  }
}
</style>
