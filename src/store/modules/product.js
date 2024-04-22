const state = {
  lectureNotesAccess: [],
  openModal: false,
};
const getters = {
  getLectureNotesAccess: (state) => {
    return state.lectureNotesAccess;
  },
  isModalOpen: (state) => {
    if (state.lectureNotesAccess.length > 0) {
      state.openModal = true;
    } else {
      state.openModal = false;
    }
    return state.openModal;
  },
};

const actions = {
  fetchLectureNotes({ commit }, payload) {
    commit("setLectureNotes", payload);
  },
  setOpenModal({ commit }) {
    commit("updateOpenModal");
  },
};
const mutations = {
  setLectureNotes(state, payload) {
    state.lectureNotesAccess = payload;
  },
  updateOpenModal(state) {
    if (state.lectureNotesAccess.length > 0) {
      state.openModal = true;
    } else {
      state.openModal = false;
    }
  },
};
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
