import { ADMIN, INDEPENDENT_USER } from "@/dataObject/roles";
import { getUserDataService } from "@/services/authService";

const getDefaultState = () => {
  return {
    id: "",
    name: "",
    email: "",
    roleId: localStorage.getItem("role"),
    firstName: "",
    lastName: "",
    discountPercentage: 0,
    salaryScale: {},
    enableSalaryScale: null,
    salaryScalePopup: null,
  };
};

const state = getDefaultState();

// getters
const getters = {
  getUserId: (state) => {
    return state.id;
  },
  getRoleId: (state) => {
    return state.roleId;
  },
  getName: (state) => {
    return state.name;
  },
  getInitials: (state) => {
    if (!state.name) return "";
    const splitted = state.name.split("_");
    return splitted[0][0].toUpperCase() + splitted[1][0].toUpperCase();
  },
  getFirstName: (state) => {
    return state.firstName;
  },
  getLastName: (state) => {
    return state.lastName;
  },
  getDiscountPercentage: (state) => {
    return state.discountPercentage;
  },
  getSalaryScale: (state) => {
    return state.salaryScale;
  },
  getEnableSalaryScale: (state) => {
    return state.enableSalaryScale;
  },
  getSalaryScalePopupFlag: (state) => {
    return state.salaryScalePopup;
  },
};

// actions
const actions = {
  setId({ commit }, payload) {
    commit("setId", payload);
  },
  setName({ commit }, name) {
    commit("setName", name);
  },
  setEmail({ commit }, payload) {
    commit("setEmail", payload);
  },
  setRoleId({ commit }, role) {
    commit("setRoleId", role);
  },
  setFirstName({ commit }, payload) {
    commit("setFirstName", payload);
  },
  setLastName({ commit }, payload) {
    commit("setLastName", payload);
  },
  setSalaryScalePopupFlag({ commit }, payload) {
    commit("setSalaryScalePopupFlag", payload);
  },
  clear({ commit }) {
    commit("clear");
  },
  async setUserData({ commit, dispatch }) {
    const response = await getUserDataService();
    if (response.error) return response;
    commit("setId", response.id);
    commit("setName", response.name);
    commit("setEmail", response.email);
    commit("setRoleId", response.role_id);
    commit("setEnableSalaryScale", response.user_profile?.enable_salary_scale);
    localStorage.setItem("role", response.role_id);

    if (response.role_id === ADMIN) {
      commit("permissions/setList", response.permissions, { root: true });
      localStorage.setItem("permissions", JSON.stringify(response.permissions));
    }
    if (response.role_id === INDEPENDENT_USER) {
      commit("setFirstName", response.first_name);
      commit("setLastName", response.last_name);
      if (response?.salary_scale) {
        commit(
          "setDiscountPercentage",
          response?.salary_scale?.discounted_country_range?.discount_percentage
        );
      } else {
        commit("setDiscountPercentage", 0);
      }
      commit("setSalaryScale", response?.salary_scale);
    }

    dispatch("notifications/getNotifications", null, { root: true });
    return response;
  },
};

// mutations
const mutations = {
  setId(state, payload) {
    state.id = payload;
  },
  setName(state, name) {
    state.name = name;
  },
  setEmail(state, payload) {
    state.email = payload;
  },
  setRoleId(state, role) {
    state.roleId = role;
  },
  setFirstName(state, payload) {
    state.firstName = payload;
  },
  setLastName(state, payload) {
    state.lastName = payload;
  },
  setDiscountPercentage(state, payload) {
    state.discountPercentage = payload;
  },
  setSalaryScale(state, payload) {
    state.salaryScale = payload;
  },
  setEnableSalaryScale(state, payload) {
    state.enableSalaryScale = payload;
  },
  setSalaryScalePopupFlag(state, payload) {
    state.salaryScalePopup = payload;
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
