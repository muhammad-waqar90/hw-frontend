const availableThemes = {
  nightMode: "night-mode",
  dayMode: "day-mode",
};

const nightModeColors = {
  white: "#131619",
  lightGray: "#282F39",
  darkGray: "#FFFFFF",
  stripeInput: "#e7eef7",
  stripeBackground: "#283141",
};

const lightModeColors = {
  white: "#FFFFFF",
  lightGray: "#F2F4FD",
  darkGray: "#808080",
  stripeInput: "#4d4d4d",
  stripeBackground: "#f5f7fc",
};

const getDefaultState = () => {
  return {
    mode: localStorage.getItem("theme")
      ? localStorage.getItem("theme")
      : "day-mode",
    colors:
      localStorage.getItem("theme") == "day-mode" ||
      localStorage.getItem("theme") == null
        ? lightModeColors
        : nightModeColors,
  };
};

const state = getDefaultState();

// getters
const getters = {
  getThemeMode: (state) => {
    return state.mode;
  },
  getColors: (state) => {
    return state.colors;
  },
  isNightMode: (state) => {
    return state.mode == availableThemes.nightMode || state.mode == null;
  },
};

// actions
const actions = {
  updateThemeClass({ commit }) {
    commit("updateThemeClass");
  },
  setThemeToNightMode({ commit }) {
    commit("setThemeToNightMode");
    commit("updateThemeClass");
  },
  setThemeToDayMode({ commit }) {
    commit("setThemeToDayMode");
    commit("updateThemeClass");
  },
};

// mutations
const mutations = {
  updateThemeClass(state) {
    state.mode === null || state.mode === availableThemes.nightMode
      ? (document.documentElement.className = availableThemes.nightMode)
      : (document.documentElement.className = availableThemes.dayMode);
  },
  setThemeToNightMode(state) {
    state.mode = availableThemes.nightMode;
    state.colors = nightModeColors;
    localStorage.setItem("theme", availableThemes.nightMode);
  },
  setThemeToDayMode(state) {
    state.mode = availableThemes.dayMode;
    state.colors = lightModeColors;
    localStorage.setItem("theme", availableThemes.dayMode);
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
