import VueRouter from "vue-router";
import rules from "./rules";
import { metaTagsUpdate } from "./metaTagsUpdate";

const Homepage = () =>
  import(/* webpackChunkName: "HomepageView"  */ "@/views/Homepage");

// Guest User
const PageNotFound = () =>
  import(/* webpackChunkName: "PageNotFoundView"  */ "@/views/PageNotFound");

const GenericRouterView = () =>
  import(
    /* webpackChunkName: "GenericRouterView"  */ "@/views/GenericRouterView"
  );

// Independent User
const IuLayout = () =>
  import(/* webpackChunkName: "IuLayout"  */ "@/layouts/IuLayout");
import IuRoutes from "@/router/partials/IuRoutes";

// Admin
const AfLayout = () =>
  import(/* webpackChunkName: "AfLayout"  */ "@/layouts/AfLayout");
import AfRoutes from "@/router/partials/AfRoutes";

const HaLayout = () =>
  import(/* webpackChunkName: "HaLayout"  */ "@/layouts/HaLayout");
import HaRoutes from "@/router/partials/HaRoutes";

// Master Admin
const MaLayout = () =>
  import(/* webpackChunkName: "MaLayout"  */ "@/layouts/MaLayout");
import MaRoutes from "@/router/partials/MaRoutes";

// Guest User
const GuLayout = () =>
  import(/* webpackChunkName: "GuLayout"  */ "@/layouts/GuLayout");
import GuRoutes from "@/router/partials/GuRoutes";

import store from "@/store";

export default {
  getRoutes() {
    let router = new VueRouter({
      mode: "history",
      base: process.env.BASE_URL,
      routes: [
        {
          path: "/",
          name: "homepage",
          component: Homepage,
          meta: { layout: GuLayout },
        },
        {
          path: "",
          name: "gu",
          component: GenericRouterView,
          meta: { layout: GuLayout },
          beforeEnter: rules.isGuest,
          children: GuRoutes,
        },
        {
          path: "/iu",
          name: "iu",
          component: GenericRouterView,
          meta: { layout: IuLayout },
          beforeEnter: rules.isIndependentUser,
          redirect: "/iu/dashboard",
          children: IuRoutes,
        },
        {
          path: "/af",
          name: "af",
          component: GenericRouterView,
          meta: { layout: AfLayout },
          beforeEnter: rules.isAdmin,
          redirect: "/af/dashboard",
          children: AfRoutes,
        },
        {
          path: "/ha",
          name: "ha",
          component: GenericRouterView,
          meta: { layout: HaLayout },
          beforeEnter: rules.isHeadAdmin,
          redirect: "/ha/dashboard",
          children: HaRoutes,
        },
        {
          path: "/ma",
          name: "ma",
          component: GenericRouterView,
          meta: { layout: MaLayout },
          beforeEnter: rules.isMasterAdmin,
          redirect: "/ma/dashboard",
          children: MaRoutes,
        },
        {
          path: "/404",
          name: "pageNotFound",
          component: PageNotFound,
        },
        {
          path: "*",
          redirect: "/404",
        },
      ],
    });

    router.onError((error) => {
      if (error.name === "ChunkLoadError") console.log("store.dispatch");
      store.dispatch("ui/toggleOnlineShake");
    });

    router.beforeEach((to, from, next) => {
      rules.saveScrollPosition(from);

      router.prevRoute = from;
      metaTagsUpdate(to, from, next);
    });

    router.afterEach((to) => {
      rules.updateScrollPosition(to);

      store.dispatch("ui/setCartActive", false);
      store.dispatch("ui/setNotificationsActive", false);
    });

    return router;
  },
};
