import Vue from "vue";
import Vuex from "vuex";

import auth from "./modules/auth";
import devices from "./modules/devices";
import user from "./modules/user";
import permissions from "./modules/permissions";
import ui from "./modules/ui";
import cart from "./modules/cart";
import notifications from "./modules/notifications";
import theme from "./modules/theme";
import product from "./modules/product";

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    auth,
    devices,
    user,
    permissions,
    ui,
    cart,
    notifications,
    theme,
    product,
  },
  strict: debug,
});
