import * as availableTypes from "@/dataObject/notifications/notificationTypeData";
import { INDEPENDENT_USER } from "@/dataObject/roles";
import {
  getNotificationList,
  getNotificationListAdmin,
  markAllNotificationsAsRead,
  markAllNotificationsAsReadAdmin,
  markNotificationAsRead,
  markAllGlobalNotificationsAsRead,
  markGlobalNotificationAsRead,
  markGlobalNotificationsAsModalRead,
} from "@/services/Common/notificationService";

import { getNextPage } from "@/services/generalService";

import { removeDuplicatesByKey } from "@/utils/generalUtils";

const getDefaultState = () => {
  return {
    list: null,
    globalModalList: null,
    nextPageUrl: null,
    unreadCount: 0,
    gnModalCount: 0,
  };
};

const state = getDefaultState();

// getters
const getters = {
  getList: (state) => {
    return state.list;
  },

  getGNotificationsList: (state) => {
    return state.globalModalList;
  },

  getTotalNotifications: (state) => {
    return state.list ? state.list.length : 0;
  },

  getGNModalCount: (state) => {
    return state.gnModalCount;
  },

  getUnreadCount: (state) => {
    return state.unreadCount;
  },

  getNextPageUrl: (state) => {
    return state.nextPageUrl;
  },
};

// actions
const actions = {
  setList({ commit }, payload) {
    commit("setList", payload);
  },
  setNextPage({ commit }, payload) {
    commit("setNextPage", payload);
  },
  clear({ commit }) {
    commit("clear");
  },

  async getNotifications({ commit, rootState }) {
    const service =
      rootState.user.roleId === INDEPENDENT_USER
        ? getNotificationList
        : getNotificationListAdmin;

    const response = await service();

    commit("setUnreadCount", response.count_unread_notifications);
    commit("setList", response.data);
    commit("setNextPage", response.next_page_url);

    commit("setGlobalModalList", response.global_notification_modal);
    commit(
      "setGNModalCount",
      response.global_notification_modal
        ? response.global_notification_modal.length
        : 0
    );
  },

  async setNotificationAsRead({ commit }, payload) {
    let response;

    if (payload.type == availableTypes.GLOBAL)
      response = await markGlobalNotificationAsRead(payload.id);
    else response = await markNotificationAsRead(payload.id);

    if (response.error) return response;

    commit("setNotificationAsRead", payload.id);
    commit("setDecreaseUnreadCount");

    return response;
  },

  async setAllNotificationsAsRead({ commit, rootState }) {
    const service =
      rootState.user.roleId === INDEPENDENT_USER
        ? markAllNotificationsAsRead
        : markAllNotificationsAsReadAdmin;

    const response = await service();

    if (response.error) return response;

    commit("setAllNotificationsAsRead");
    commit("setUnreadCount", 0);

    return response;
  },

  async setAllGNotificationsAsRead({ commit }) {
    const response = await markAllGlobalNotificationsAsRead();

    if (response.error) return response;

    commit("setAllGNotificationsAsRead");
    commit("setUnreadCount", response.currentUnreadCount);

    return response;
  },

  async setAllGNotificationsAsModalRead({ commit }) {
    const response = await markGlobalNotificationsAsModalRead();

    if (response.error) return response;

    commit("setAllGNotificationsAsRead");
    commit("setGNModalCount", 0);

    return response;
  },

  async loadMoreNotifications({ commit }) {
    const response = await getNextPage(state.nextPageUrl);

    if (response.error) return response;

    commit(
      "setList",
      removeDuplicatesByKey([...state.list, ...response.data], "id")
    );
    commit("setNextPage", response.next_page_url);
  },
};

// mutations
const mutations = {
  setList(state, payload) {
    state.list = payload;
  },
  setGlobalModalList(state, payload) {
    state.globalModalList = payload;
  },
  setUnreadCount(state, payload) {
    state.unreadCount = payload;
  },
  setGNModalCount(state, payload) {
    state.gnModalCount = payload;
  },
  setDecreaseUnreadCount(state) {
    state.unreadCount--;
  },
  setNextPage(state, payload) {
    state.nextPageUrl = payload;
  },
  setAllNotificationsAsRead(state) {
    state.list.forEach((item) => (item.read = true));
  },
  setAllGNotificationsAsRead(state) {
    state.list = state.list.map((item) => {
      if (item.type == availableTypes.GLOBAL) item.modal_read = true;
      return item;
    });
  },
  setNotificationAsRead(state, payload) {
    state.list = state.list.map((item) => {
      if (item.id == payload) item.read = true;
      return item;
    });
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
