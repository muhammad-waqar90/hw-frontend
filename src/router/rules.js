import store from "@/store/index";
import {
  INDEPENDENT_USER,
  ADMIN,
  HEAD_ADMIN,
  MASTER_ADMIN,
} from "@/dataObject/roles";

const rules = {
  isGuest(to, from, next) {
    if (store.getters["auth/getIsLoggedIn"]) {
      return next("/");
    }
    next();
  },
  isLoggedIn(to, from, next) {
    if (!store.getters["auth/getIsLoggedIn"]) {
      return next("/");
    }
    next();
  },
  isIndependentUser(to, from, next) {
    if (
      !store.getters["auth/getIsLoggedIn"] ||
      store.getters["user/getRoleId"] != INDEPENDENT_USER
    ) {
      return next(`/login?redirect=${to.path}`);
    }
    next();
  },
  isAdmin(to, from, next) {
    if (
      !store.getters["auth/getIsLoggedIn"] ||
      store.getters["user/getRoleId"] != ADMIN
    ) {
      return next(`/login?redirect=${to.path}`);
    }
    next();
  },
  isHeadAdmin(to, from, next) {
    if (
      !store.getters["auth/getIsLoggedIn"] ||
      store.getters["user/getRoleId"] != HEAD_ADMIN
    ) {
      return next(`/login?redirect=${to.path}`);
    }
    next();
  },
  isMasterAdmin(to, from, next) {
    if (
      !store.getters["auth/getIsLoggedIn"] ||
      store.getters["user/getRoleId"] != MASTER_ADMIN
    ) {
      return next(`/login?redirect=${to.path}`);
    }
    next();
  },

  isPermissable(to, from, next) {
    if (to.meta.permission) {
      if (!store.getters["permissions/" + to.meta.permission]) {
        return next("/");
      }
    }
    next();
  },

  isPermissableOr(to, from, next) {
    if (to.meta.permissions) {
      let intersection = [];
      to.meta.permissions.forEach((permission) => {
        if (store.getters["permissions/" + permission]) {
          intersection.push(permission);
        }
      });
      if (intersection.length == 0) return next("/");
    }
    next();
  },

  isPermissableAll(to, from, next) {
    if (to.meta.permissions) {
      to.meta.permissions.forEach((permission) => {
        if (!store.getters["permissions/" + permission]) {
          return next("/");
        }
      });
    }
    next();
  },

  saveScrollPosition(route) {
    if (route.meta.keepScrollPosition) {
      store.dispatch("ui/setScrollPosition", {
        x: document.querySelector("html").scrollLeft,
        y: document.querySelector("html").scrollTop,
        routeName: route.name,
      });
    }
  },

  updateScrollPosition(route) {
    if (route.meta.keepScrollPosition) {
      const scrollPosition = store.getters["ui/getScrollPosition"];

      if (scrollPosition[route.name]) {
        setTimeout(() => {
          window.scrollTo(
            scrollPosition[route.name].x,
            scrollPosition[route.name].y
          );
        }, 0);
      }
    } else if (!route.hash)
      setTimeout(() => {
        window.scrollTo(0, 0);
      }, 0);
  },
};

export default rules;
