import * as permissionData from "@/dataObject/permissions/permissionData";

const state = {
  list: localStorage.getItem("permissions")
    ? JSON.parse(localStorage.getItem("permissions"))
    : [],
};

const getters = {
  isFaqManager: (state) => {
    return state.list.includes(permissionData.FAQ_MANAGEMENT.value);
  },

  isTicketSubjectManager: (state) => {
    return state.list.includes(permissionData.TICKET_SUBJECT_MANAGEMENT.value);
  },

  isTicketContentManager: (state) => {
    return state.list.includes(permissionData.TICKET_CONTENT_MANAGEMENT.value);
  },

  isTicketSystemManager: (state) => {
    return state.list.includes(permissionData.TICKET_SYSTEM_MANAGEMENT.value);
  },

  isFaqCategoryManager: (state) => {
    return state.list.includes(permissionData.FAQ_CATEGORY_MANAGEMENT.value);
  },

  isUserManager: (state) => {
    return state.list.includes(permissionData.USER_MANAGEMENT.value);
  },

  isAbleToDeleteUsers: (state) => {
    return state.list.includes(permissionData.DELETE_USERS.value);
  },

  isAbleToViewUserPurchaseHistory: (state) => {
    return state.list.includes(
      permissionData.VIEW_USERS_PURCHASE_HISTORY.value
    );
  },

  isTicketRefundManager: (state) => {
    return state.list.includes(permissionData.TICKET_REFUND_MANAGEMENT.value);
  },

  isRefundsManager: (state) => {
    return state.list.includes(permissionData.REFUNDS_MANAGEMENT.value);
  },

  isAbleToViewRefunds: (state) => {
    return state.list.includes(permissionData.VIEW_REFUNDS.value);
  },

  isTicketTeamLeadership: (state) => {
    return state.list.includes(permissionData.TICKET_TEAM_LEADERSHIP.value);
  },

  isGlobalNotificationsManager: (state) => {
    return state.list.includes(
      permissionData.GLOBAL_NOTIFICATIONS_MANAGEMENT.value
    );
  },

  isAdvertManager: (state) => {
    return state.list.includes(permissionData.ADVERT_MANAGEMENT.value);
  },

  isTicketGDPRManager: (state) => {
    return state.list.includes(permissionData.TICKET_GDPR_MANAGEMENT.value);
  },

  isGDPRManager: (state) => {
    return state.list.includes(permissionData.GDPR_MANAGEMENT.value);
  },

  isCategoryManager: (state) => {
    return state.list.includes(permissionData.CATEGORY_MANAGEMENT.value);
  },

  isEventManager: (state) => {
    return state.list.includes(permissionData.EVENT_MANAGEMENT.value);
  },

  isCourseManager: (state) => {
    return state.list.includes(permissionData.COURSE_MANAGEMENT.value);
  },

  isAbleToUpdateCourseStatus: (state) => {
    return state.list.includes(permissionData.UPDATE_COURSE_STATUS.value);
  },

  isAbleToBulkUploadQuizzes: (state) => {
    return state.list.includes(permissionData.BULK_UPLOAD_QUIZZES.value);
  },

  isEbookManager: (state) => {
    return state.list.includes(permissionData.EBOOK_MANAGEMENT.value);
  },

  isCouponManager: (state) => {
    return state.list.includes(permissionData.COUPON_MANAGEMENT.value);
  },

  isTicketLessonQAManager: (state) => {
    return state.list.includes(
      permissionData.TICKET_LESSON_QA_MANAGEMENT.value
    );
  },

  isPhysicalProductManager: (state) => {
    return state.list.includes(permissionData.PHYSICAL_PRODUCT_MANAGMENT.value);
  },

  isSalaryScaleManager: (state) => {
    return state.list.includes(permissionData.SALARY_SCALE_MANAGEMENT.value);
  },
};

const actions = {
  setList({ commit }, payload) {
    commit("setList", payload);
  },
};

const mutations = {
  setList(state, payload) {
    state.list = payload;
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
