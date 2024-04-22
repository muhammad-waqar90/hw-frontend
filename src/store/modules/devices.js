const state = {
  windowWidth: null,
  desktopWidth: 1200,
  desktopBigWidth: 1650,
  laptopWidth: 992,
  tabletWidth: 768,
  bigPhoneWidth: 576,
  smallPhoneWidth: 450,
};

// getters
const getters = {
  getWindowWidth: (state) => {
    return state.windowWidth;
  },
  getIsDesktop: (state) => {
    return state.windowWidth >= state.desktopWidth;
  },
  getIsDesktopBig: (state) => {
    return state.windowWidth >= state.desktopBigWidth;
  },
  getDesktopWidth: (state) => {
    return state.desktopBigWidth;
  },
  getIsLaptop: (state) => {
    return (
      state.windowWidth >= state.laptopWidth &&
      state.windowWidth < state.desktopWidth
    );
  },
  getLaptopWidth: (state) => {
    return state.laptopWidth;
  },
  getIsMobile: (state) => {
    return state.windowWidth < state.laptopWidth;
  },
  getIsTablet: (state) => {
    return (
      state.windowWidth >= state.tabletWidth &&
      state.windowWidth < state.desktopWidth
    );
  },
  getTabletWidth: (state) => {
    return state.tabletWidth;
  },
  getIsBigPhone: (state) => {
    return (
      state.windowWidth >= state.bigPhoneWidth &&
      state.windowWidth < state.tabletWidth
    );
  },
  getBigPhoneWidth: (state) => {
    return state.bigPhoneWidth;
  },
  getIsSmallPhone: (state) => {
    return state.windowWidth < state.bigPhoneWidth;
  },
  getIsPhone: (state) => {
    return state.windowWidth < state.tabletWidth;
  },
  getSmallPhoneWidth: (state) => {
    return state.windowWidth < state.smallPhoneWidth;
  },
};

// actions
const actions = {
  setWindowWidth({ commit }, payload) {
    if (payload > state.laptopWidth)
      commit("ui/setLeftNavigationActive", false, { root: true });
    commit("setWindowWidth", payload);
  },
};

// mutations
const mutations = {
  setWindowWidth(state, payload) {
    state.windowWidth = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
