import { loginService, logoutService } from "@/services/authService";

const state = {
  isLoggedIn: !!localStorage.getItem("token"),
  registerUsername: "",
  registerEmail: "",
  isParentVerified: true,
  // isParentVerified: localStorage.getItem('isParentVerified') === null ? true : JSON.parse(localStorage.getItem('isParentVerified'))
};

// getters
const getters = {
  getIsLoggedIn: (state) => {
    return state.isLoggedIn;
  },
  getRegisterUsername: (state) => {
    return state.registerUsername;
  },
  getRegisterEmail: (state) => {
    return state.registerEmail;
  },
  getIsParentVerified: (state) => {
    return state.isParentVerified;
  },
};

// actions
const actions = {
  async login({ commit }, payload) {
    const response = await loginService(payload);
    if (response.error) {
      commit("setIsLoggedIn", false);
      return response;
    }

    localStorage.setItem("token", "Bearer " + response.access_token);
    commit("setIsLoggedIn", true);
    return response;
  },

  async logout({ commit }, payload) {
    if (!payload?.blockLogoutService) await logoutService();

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("permissions");
    localStorage.removeItem("isParentVerified");
    localStorage.removeItem("username");

    commit("setIsLoggedIn", false);
    commit("user/clear", null, { root: true });
    commit("notifications/clear", null, { root: true });
    commit("cart/clear", null, { root: true });

    return true;
  },

  setRegisterUsername({ commit }, payload) {
    commit("setRegisterUsername", payload);
  },
  setRegisterEmail({ commit }, payload) {
    commit("setRegisterEmail", payload);
  },
  setIsParentVerified({ commit }, payload) {
    commit("setIsParentVerified", payload);
  },
};

// mutations
const mutations = {
  setIsLoggedIn(state, payload) {
    state.isLoggedIn = payload;
  },
  setRegisterUsername(state, payload) {
    state.registerUsername = payload;
  },
  setRegisterEmail(state, payload) {
    state.registerEmail = payload;
  },
  setIsParentVerified(state, payload) {
    state.isParentVerified = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
