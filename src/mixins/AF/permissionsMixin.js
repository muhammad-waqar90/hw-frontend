import { mapGetters } from "vuex";
import * as permissionData from "../../dataObject/permissions/permissionData";

export default {
  computed: {
    ...mapGetters({
      $isFaqManager: `permissions/${permissionData.FAQ_MANAGEMENT.name}`,
      $isTicketSubjectManager: `permissions/${permissionData.TICKET_SUBJECT_MANAGEMENT.name}`,
      $isTicketContentManager: `permissions/${permissionData.TICKET_CONTENT_MANAGEMENT.name}`,
      $isTicketSystemManager: `permissions/${permissionData.TICKET_SYSTEM_MANAGEMENT.name}`,
      $isFaqCategoryManager: `permissions/${permissionData.FAQ_CATEGORY_MANAGEMENT.name}`,
      $isUserManager: `permissions/${permissionData.USER_MANAGEMENT.name}`,
      $isAbleToDeleteUsers: `permissions/${permissionData.DELETE_USERS.name}`,
      $isAbleToViewUserPurchaseHistory: `permissions/${permissionData.VIEW_USERS_PURCHASE_HISTORY.name}`,
      $isTicketRefundManager: `permissions/${permissionData.TICKET_REFUND_MANAGEMENT.name}`,
      $isRefundsManager: `permissions/${permissionData.REFUNDS_MANAGEMENT.name}`,
      $isAbleToViewRefunds: `permissions/${permissionData.VIEW_REFUNDS.name}`,
      $isTicketTeamLeadership: `permissions/${permissionData.TICKET_TEAM_LEADERSHIP.name}`,
      $isGlobalNotificationsManager: `permissions/${permissionData.GLOBAL_NOTIFICATIONS_MANAGEMENT.name}`,
      $isAdvertManager: `permissions/${permissionData.ADVERT_MANAGEMENT.name}`,
      $isTicketGDPRManager: `permissions/${permissionData.TICKET_GDPR_MANAGEMENT.name}`,
      $isGDPRManager: `permissions/${permissionData.GDPR_MANAGEMENT.name}`,
      $isCategoryManager: `permissions/${permissionData.CATEGORY_MANAGEMENT.name}`,
      $isEventManager: `permissions/${permissionData.EVENT_MANAGEMENT.name}`,
      $isCourseManager: `permissions/${permissionData.COURSE_MANAGEMENT.name}`,
      $isAbleToUpdateCourseStatus: `permissions/${permissionData.UPDATE_COURSE_STATUS.name}`,
      $isAbleToBulkUploadQuizzes: `permissions/${permissionData.BULK_UPLOAD_QUIZZES.name}`,
      $isEbookManager: `permissions/${permissionData.EBOOK_MANAGEMENT.name}`,
      $isCouponManager: `permissions/${permissionData.COUPON_MANAGEMENT.name}`,
      $isTicketLessonQAManager: `permissions/${permissionData.TICKET_LESSON_QA_MANAGEMENT.name}`,
      $isPhysicalProductManager: `permissions/${permissionData.PHYSICAL_PRODUCT_MANAGMENT.name}`,
      $isSalaryScaleManager: `permissions/${permissionData.SALARY_SCALE_MANAGEMENT.name}`,
    }),
  },
};
