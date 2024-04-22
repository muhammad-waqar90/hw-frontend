const getDefaultState = () => {
  return {
    leftNavigationActive: false,
    cartActive: false,
    notificationsActive: false,
    windowScroll: 0,
    scrollPosition: {},
    scrollDirection: "down",
    online: {
      isOnline: true,
      shakeToggle: false,
    },
  };
};

const state = getDefaultState();

// getters
const getters = {
  getLeftNavigationActive: (state) => {
    return state.leftNavigationActive;
  },
  getCartActive: (state) => {
    return state.cartActive;
  },
  getNotificationsActive: (state) => {
    return state.notificationsActive;
  },
  getWindowScroll: (state) => {
    return state.windowScroll;
  },
  getScrollPosition: (state) => {
    return state.scrollPosition;
  },
  getScrollDirection: (state) => {
    return state.scrollDirection;
  },
  getIsOnline: (state) => {
    return state.online.isOnline;
  },
  getOnlineShake: (state) => {
    return state.online.shakeToggle;
  },
};

// actions
const actions = {
  setLeftNavigationActive({ commit }, payload) {
    commit("setLeftNavigationActive", payload);
  },
  setCartActive({ commit }, payload) {
    commit("setCartActive", payload);
  },
  setNotificationsActive({ commit }, payload) {
    commit("setNotificationsActive", payload);
  },
  setWindowScroll({ commit }, payload) {
    if (Math.abs(payload - state.windowScroll) > 1)
      this.dispatch(
        "ui/setScrollDirection",
        payload > state.windowScroll ? "down" : "up"
      );
    commit("setWindowScroll", payload);
  },
  setScrollPosition({ commit }, payload) {
    commit("setScrollPosition", payload);
  },
  setScrollDirection({ commit }, payload) {
    commit("setScrollDirection", payload);
  },
  setIsOnline({ commit }, payload) {
    commit("setIsOnline", payload);
  },
  toggleOnlineShake({ commit }) {
    commit("toggleOnlineShake");
  },
  clear({ commit }) {
    commit("clear");
  },
};

// mutations
const mutations = {
  setLeftNavigationActive(state, payload) {
    state.leftNavigationActive = payload;
    if (payload) document.body.style.overflow = "hidden";
    else document.body.style.removeProperty("overflow");
  },
  setCartActive(state, payload) {
    state.cartActive = payload;
  },
  setNotificationsActive(state, payload) {
    state.notificationsActive = payload;
  },
  setWindowScroll(state, payload) {
    state.windowScroll = payload;
  },
  setScrollPosition(state, payload) {
    state.scrollPosition[payload.routeName] = { x: payload.x, y: payload.y };
  },
  setScrollDirection(state, payload) {
    state.scrollDirection = payload;
  },
  setIsOnline(state, payload) {
    state.online.isOnline = payload;
  },
  toggleOnlineShake(state) {
    state.online.shakeToggle = !state.online.shakeToggle;
  },
  clear(state) {
    Object.assign(state, getDefaultState());
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
