const getDefaultState = () => {
  return {
    entity: "",
    mode: "",
    entityData: {},
    hooks: {}, // anything required for CRUD request fulfilment.
    isAllowAddDelete: true,
    hasEntityChanged: false, // change create/edit entity form
    selectedEntityData: {} /** {
        entity: 'module' || 'lecture',
        list: [],
        entityParentId: module_id || level_id
    } */,
    isCreatingEditingLessonFaq: false,
  };
};

const state = getDefaultState();

// getters
const getters = {
  getEntity: (state) => {
    return state.entity;
  },
  getMode: (state) => {
    return state.mode;
  },
  getEntityData: (state) => {
    return state.entityData;
  },
  getHooks: (state) => {
    return state.hooks;
  },
  getSelectedEntityData: (state) => {
    return state.selectedEntityData;
  },
  getIsAllowAddDelete: (state) => {
    return state.isAllowAddDelete;
  },
  getHasEntityChanged: (state) => {
    return state.hasEntityChanged;
  },
  getIsCreatingEditingLessonFaq: (state) => {
    return state.isCreatingEditingLessonFaq;
  },
};

// actions
const actions = {
  setEntity: ({ commit }, payload) => {
    commit("setEntity", payload);
  },
  setMode: ({ commit }, payload) => {
    commit("setMode", payload);
  },
  setEntityData: ({ commit }, payload) => {
    commit("setEntityData", payload);
  },
  setHooks: ({ commit }, payload) => {
    commit("setHooks", payload);
  },
  setSelectedEntityData: ({ commit }, payload) => {
    commit("setSelectedEntityData", payload);
  },
  setIsAllowAddDelete: ({ commit }, payload) => {
    commit("setIsAllowAddDelete", payload);
  },
  setHasEntityChanged: ({ commit }, payload) => {
    commit("setHasEntityChanged", payload);
  },
  setIsCreatingEditingLessonFaq: ({ commit }, payload) => {
    commit("setIsCreatingEditingLessonFaq", payload);
  },
  clear({ commit }) {
    commit("clear");
  },
};

// mutations
const mutations = {
  setEntity: (state, payload) => {
    state.entity = payload;
  },
  setMode: (state, payload) => {
    state.mode = payload;
  },
  setEntityData: (state, payload) => {
    state.entityData = payload;
  },
  setHooks: (state, payload) => {
    state.hooks = payload;
  },
  setSelectedEntityData: (state, payload) => {
    state.selectedEntityData = payload;
  },
  setIsAllowAddDelete: (state, payload) => {
    state.isAllowAddDelete = payload;
  },
  setHasEntityChanged: (state, payload) => {
    state.hasEntityChanged = payload;
  },
  setIsCreatingEditingLessonFaq: (state, payload) => {
    state.isCreatingEditingLessonFaq = payload;
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
