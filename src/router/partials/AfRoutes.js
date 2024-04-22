import rules from "../rules";
import * as permissionData from "../../dataObject/permissions/permissionData";

const GenericRouterView = () =>
  import(
    /* webpackChunkName: "GenericRouterView"  */ "@/views/GenericRouterView"
  );

const AFDashboard = () =>
  import(/* webpackChunkName: "AFDashboardView"  */ "@/views/AF/Dashboard");
const AFPlatformUsers = () =>
  import(
    /* webpackChunkName: "AFPlatformUsersView"  */ "@/views/AF/PlatformUsers"
  );
const AFCertificates = () =>
  import(
    /* webpackChunkName: "AFCertificatesView"  */ "@/views/AF/Certificates"
  );
const SupportTicketList = () =>
  import(
    /* webpackChunkName: "AFSupportTicketList"  */ "@/views/AF/SupportTicketList"
  );

const AFSupportTicket = () =>
  import(
    /* webpackChunkName: "AFSupportTicketView"  */ "@/views/AF/SupportTicket"
  );

const AFMySupportTickets = () =>
  import(
    /* webpackChunkName: "AFMySupportTicketsView"  */ "@/views/AF/MySupportTickets"
  );

const AFLessonQAList = () =>
  import(
    /* webpackChunkName: "AFLessonQAListView"  */ "@/views/AF/LessonQAs/LessonQAList"
  );

const AFLessonQA = () =>
  import(
    /* webpackChunkName: "AFLessonQAView"  */ "@/views/AF/LessonQAs/LessonQA"
  );

const TicketSubject = () =>
  import(
    /* webpackChunkName: "AFTicketSubjectView"  */ "@/views/AF/TicketSubject"
  );

const CreateTicketSubject = () =>
  import(
    /* webpackChunkName: "AFCreateTicketSubjectView"  */ "@/views/AF/CreateTicketSubject"
  );

const EditTicketSubject = () =>
  import(
    /* webpackChunkName: "AFEditTicketSubjectView"  */ "@/views/AF/EditTicketSubject"
  );

/* --- EVENTS SECTION --- */
const AfEventsOverview = () =>
  import(
    /* webpackChunkName: "AfEventsOverviewView"  */ "@/views/AF/Events/EventsOverview"
  );
const AfEventsCreate = () =>
  import(
    /* webpackChunkName: "AfEventsCreateView"  */ "@/views/AF/Events/EventsCreate"
  );
const AfEventsEdit = () =>
  import(
    /* webpackChunkName: "AfEventsEditView"  */ "@/views/AF/Events/EventsEdit"
  );
/* --- /EVENTS SECTION --- */

const AFAdvertisementBlocks = () =>
  import(
    /* webpackChunkName: "AFaAdvertisementBlocksView"  */ "@/views/AF/AdvertisementBlocks"
  );
const AFTransactions = () =>
  import(
    /* webpackChunkName: "AFTransactionsView"  */ "@/views/AF/Transactions"
  );
const AFCourseAccessManagement = () =>
  import(
    /* webpackChunkName: "AFCourseAccessManagementView"  */ "@/views/AF/CourseAccessManagement"
  );

const AFOrdersOverview = () =>
  import(
    /* webpackChunkName: "AFOrdersOverviewView"  */ "@/views/AF/OrdersOverview"
  );

const AFExamAccessManagement = () =>
  import(
    /* webpackChunkName: "AFExamAccessManagementView"  */ "@/views/AF/ExamAccessManagement"
  );

/* --- FAQS SECTION --- */
const AfFaqsCategoriesOverview = () =>
  import(
    /* webpackChunkName: "AfFaqsCategoriesOverviewView"  */ "@/views/AF/Faqs/Categories/FaqCategoriesOverview"
  );
const AfFaqsCategoriesCreate = () =>
  import(
    /* webpackChunkName: "AfFaqsCategoriesCreateView"  */ "@/views/AF/Faqs/Categories/FaqCategoriesCreate"
  );
const AfFaqsCategoriesEdit = () =>
  import(
    /* webpackChunkName: "AfFaqsCategoriesEditView"  */ "@/views/AF/Faqs/Categories/FaqCategoriesEdit"
  );
const AfFaqsOverview = () =>
  import(
    /* webpackChunkName: "AfFaqsOverview"  */ "@/views/AF/Faqs/Entries/FaqsOverview"
  );
const AfFaqsCreate = () =>
  import(
    /* webpackChunkName: "AfFaqsCreateView"  */ "@/views/AF/Faqs/Entries/FaqsCreate"
  );
const AfFaqsEdit = () =>
  import(
    /* webpackChunkName: "AfFaqsEditView"  */ "@/views/AF/Faqs/Entries/FaqsEdit"
  );
/* --- /FAQS SECTION --- */

const AFExternalLoginIssues = () =>
  import(
    /* webpackChunkName: "AFExternalLoginIssuesView"  */ "@/views/AF/ExternalLoginIssues"
  );
const AFStockRequestsOverview = () =>
  import(
    /* webpackChunkName: "AFStockRequestsOverviewView"  */ "@/views/AF/StockRequestsOverview"
  );
const AFInstitutions = () =>
  import(
    /* webpackChunkName: "AFInstitutionsView"  */ "@/views/AF/Institutions"
  );
const AFClassesOverview = () =>
  import(
    /* webpackChunkName: "AFClassesOverviewView"  */ "@/views/AF/ClassesOverview"
  );
const AFPendingApprovalRequests = () =>
  import(
    /* webpackChunkName: "AFPendingApprovalRequestsView"  */ "@/views/AF/PendingApprovalRequests"
  );

/* --- COURSES SECTION --- */
const AFCoursesOverview = () =>
  import(
    /* webpackChunkName: "AFCoursesOverviewView"  */ "@/views/AF/Courses/CoursesOverview"
  );
const AFCourseCreate = () =>
  import(
    /* webpackChunkName: "AFCoursesCreateView"  */ "@/views/AF/Courses/CourseCreate"
  );
const AFCourseEdit = () =>
  import(
    /* webpackChunkName: "AFCoursesEditView"  */ "@/views/AF/Courses/CourseEdit"
  );
/* --- /COURSES SECTION --- */

const AFShopCategories = () =>
  import(
    /* webpackChunkName: "AFShopCategoriesView"  */ "@/views/AF/ShopCategories"
  );
const AFShopDistributors = () =>
  import(
    /* webpackChunkName: "AFShopDistributorsView"  */ "@/views/AF/ShopDistributors"
  );
const AFProductsOverview = () =>
  import(
    /* webpackChunkName: "AFProductsOverviewView"  */ "@/views/AF/ProductsOverview"
  );

/* --- USERS SECTION --- */
const AfUsersOverview = () =>
  import(
    /* webpackChunkName: "AFUsersOverviewView"  */ "@/views/AF/Users/UsersOverview"
  );
const AfUserDetails = () =>
  import(
    /* webpackChunkName: "AfUserDetailsView"  */ "@/views/AF/Users/UserDetails"
  );
/* --- /USERS SECTION --- */

const AfRefundsOverview = () =>
  import(
    /* webpackChunkName: "AfRefundsOverviewView"  */ "@/views/AF/RefundsOverview"
  );

/* --- GLOBAL NOTIFICATIONS SECTION --- */
const AfGlobalNotificationsOverview = () =>
  import(
    /* webpackChunkName: "AfGlobalNotificationsOverviewView"  */ "@/views/AF/GlobalNotifications/GlobalNotificationsOverview"
  );
const AfGlobalNotificationsCreate = () =>
  import(
    /* webpackChunkName: "AfGlobalNotificationsCreateView"  */ "@/views/AF/GlobalNotifications/GlobalNotificationsCreate"
  );
const AfGlobalNotificationsEdit = () =>
  import(
    /* webpackChunkName: "AfGlobalNotificationsEditView"  */ "@/views/AF/GlobalNotifications/GlobalNotificationsEdit"
  );
/* --- /GLOBAL NOTIFICATIONS SECTION --- */

/* --- ADVERT SECTION --- */
const AfAdvertOverview = () =>
  import(
    /* webpackChunkName: "AfAdvertOverviewView"  */ "@/views/AF/Advert/AdvertOverview"
  );
const AfAdvertCreate = () =>
  import(
    /* webpackChunkName: "AfAdvertCreateView"  */ "@/views/AF/Advert/AdvertCreate"
  );
const AfAdvertEdit = () =>
  import(
    /* webpackChunkName: "AfAdvertEditView"  */ "@/views/AF/Advert/AdvertEdit"
  );
/* --- /ADVERT SECTION --- */

/* --- CATEGORY SECTION --- */
const AfCategoryOverview = () =>
  import(
    /* webpackChunkName: "AfCategoryOverviewView"  */ "@/views/AF/Category/CategoryOverview"
  );
const AfCategoryCreate = () =>
  import(
    /* webpackChunkName: "AfCategoryCreateView"  */ "@/views/AF/Category/CategoryCreate"
  );
const AfCategoryEdit = () =>
  import(
    /* webpackChunkName: "AfCategoryEditView"  */ "@/views/AF/Category/CategoryEdit"
  );
/* --- /CATEGORY SECTION --- */

/*  --- /PRODUCTS SECTION --- */
const AFProductOverview = () =>
  import(
    /* webpackChunkName: "AFProductOverview" */ "@/views/AF/Products/ProductsOverview.vue"
  );

const AFProductCreate = () =>
  import(
    /* webpackChunkName: "AFProductCreate" */ "@/views/AF/Products/ProductCreate.vue"
  );

const AFProductEdit = () =>
  import(
    /* webpackChunkName: "AFProductEdit" */ "@/views/AF/Products/ProductEdit.vue"
  );

/*  --- /PRODUCTS SECTION --- */

/* --- COUPON SECTION --- */
const AfCouponOverview = () =>
  import(
    /* webpackChunkName: "AfCouponOverviewView"  */ "@/views/AF/Coupon/CouponOverview"
  );
const AfCouponCreate = () =>
  import(
    /* webpackChunkName: "AfCouponCreateView"  */ "@/views/AF/Coupon/CouponCreate"
  );
const AfCouponEdit = () =>
  import(
    /* webpackChunkName: "AfCouponEditView"  */ "@/views/AF/Coupon/CouponEdit"
  );
/* --- /COUPON SECTION --- */

const routes = [
  {
    path: "dashboard",
    name: "af-dashboard",
    component: AFDashboard,
  },
  {
    path: "platform-users",
    name: "af-platform-users",
    component: AFPlatformUsers,
  },
  {
    path: "certificates",
    name: "af-certificates",
    component: AFCertificates,
  },
  {
    path: "tickets",
    name: "af-support-tickets",
    component: SupportTicketList,
    meta: {
      permissions: [
        permissionData.TICKET_CONTENT_MANAGEMENT.name,
        permissionData.TICKET_SYSTEM_MANAGEMENT.name,
      ],
    },
    beforeEnter: rules.isPermissableOr,
  },
  {
    path: "tickets/me/:id?",
    name: "af-my-support-tickets",
    component: AFMySupportTickets,
    meta: {
      permissions: [
        permissionData.TICKET_CONTENT_MANAGEMENT.name,
        permissionData.TICKET_SYSTEM_MANAGEMENT.name,
      ],
    },
    beforeEnter: rules.isPermissableOr,
  },
  {
    path: "tickets/subjects",
    name: "af-tickets-subjects",
    component: TicketSubject,
    meta: { permission: permissionData.TICKET_SUBJECT_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
  },
  {
    path: "tickets/subjects/create",
    name: "af-tickets-subjects-create",
    component: CreateTicketSubject,
    meta: { permission: permissionData.TICKET_SUBJECT_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
  },
  {
    path: "tickets/subjects/:id",
    name: "af-tickets-subjects-edit",
    component: EditTicketSubject,
    meta: { permission: permissionData.TICKET_SUBJECT_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
  },
  {
    path: "tickets/:id",
    name: "af-support-ticket",
    component: AFSupportTicket,
    meta: {
      permissions: [
        permissionData.TICKET_CONTENT_MANAGEMENT.name,
        permissionData.TICKET_SYSTEM_MANAGEMENT.name,
      ],
    },
    beforeEnter: rules.isPermissableOr,
  },
  {
    path: "lesson/qas", // Q&As
    name: "af-lesson-qa-tickets",
    component: AFLessonQAList,
    meta: { permissions: [permissionData.TICKET_LESSON_QA_MANAGEMENT.name] },
    beforeEnter: rules.isPermissableOr,
  },
  {
    path: "lesson/qas/:id",
    name: "af-lesson-qa-ticket",
    component: AFLessonQA,
    meta: { permissions: [permissionData.TICKET_LESSON_QA_MANAGEMENT.name] },
    beforeEnter: rules.isPermissableOr,
  },
  {
    path: "events",
    name: "af-events",
    component: GenericRouterView,
    meta: { permission: permissionData.EVENT_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
    redirect: "/af/events/overview",
    children: [
      {
        path: "overview",
        name: "af-events-overview",
        meta: { permission: permissionData.EVENT_MANAGEMENT.name },
        component: AfEventsOverview,
      },
      {
        path: "create",
        name: "af-events-create",
        meta: { permission: permissionData.EVENT_MANAGEMENT.name },
        component: AfEventsCreate,
      },
      {
        path: ":id",
        name: "af-events-edit",
        meta: { permission: permissionData.EVENT_MANAGEMENT.name },
        component: AfEventsEdit,
      },
    ],
  },
  {
    path: "advertisement-blocks",
    name: "af-advertisement-blocks",
    component: AFAdvertisementBlocks,
  },
  {
    path: "transactions",
    name: "af-transactions",
    component: AFTransactions,
  },
  {
    path: "course-access-management",
    name: "af-course-access-management",
    component: AFCourseAccessManagement,
  },
  {
    path: "orders-overview",
    name: "af-orders-overview",
    component: AFOrdersOverview,
  },
  {
    path: "exam-access-management",
    name: "af-exam-access-management",
    component: AFExamAccessManagement,
  },
  {
    path: "faqs",
    name: "af-faqs",
    component: GenericRouterView,
    children: [
      {
        path: "categories",
        name: "af-faqs-categories",
        component: GenericRouterView,
        meta: { permission: permissionData.FAQ_CATEGORY_MANAGEMENT.name },
        beforeEnter: rules.isPermissable,
        redirect: "/af/faqs/categories/overview",
        children: [
          {
            path: "overview",
            name: "af-faqs-categories-overview",
            meta: { permission: permissionData.FAQ_CATEGORY_MANAGEMENT.name },
            component: AfFaqsCategoriesOverview,
          },
          {
            path: "create",
            name: "af-faqs-categories-create",
            meta: { permission: permissionData.FAQ_CATEGORY_MANAGEMENT.name },
            component: AfFaqsCategoriesCreate,
          },
          {
            path: ":id",
            name: "af-faqs-categories-edit",
            meta: { permission: permissionData.FAQ_CATEGORY_MANAGEMENT.name },
            component: AfFaqsCategoriesEdit,
          },
        ],
      },
      {
        path: "entries",
        name: "af-faqs-entries",
        component: GenericRouterView,
        meta: { permission: permissionData.FAQ_MANAGEMENT.name },
        beforeEnter: rules.isPermissable,
        redirect: "/af/faqs/entries/overview",
        children: [
          {
            path: "overview",
            name: "af-faqs-entries-overview",
            meta: { permission: permissionData.FAQ_MANAGEMENT.name },
            component: AfFaqsOverview,
          },
          {
            path: "create",
            name: "af-faqs-entries-create",
            meta: { permission: permissionData.FAQ_MANAGEMENT.name },
            component: AfFaqsCreate,
          },
          {
            path: ":id",
            name: "af-faqs-entries-edit",
            meta: { permission: permissionData.FAQ_MANAGEMENT.name },
            component: AfFaqsEdit,
          },
        ],
      },
    ],
  },
  {
    path: "external-login-issues",
    name: "af-external-login-issues",
    component: AFExternalLoginIssues,
  },
  {
    path: "stock-requests-overview",
    name: "af-stock-requests-overview",
    component: AFStockRequestsOverview,
  },
  {
    path: "institutions",
    name: "af-institutions",
    component: AFInstitutions,
  },
  {
    path: "classes-overview",
    name: "af-classes-overview",
    component: AFClassesOverview,
  },
  {
    path: "pending-approval-requests",
    name: "af-pending-approval-requests",
    component: AFPendingApprovalRequests,
  },
  {
    path: "courses",
    name: "af-courses",
    redirect: "/af/courses",
    component: GenericRouterView,
    children: [
      {
        path: "",
        component: GenericRouterView,
        meta: { permission: permissionData.COURSE_MANAGEMENT.name },
        beforeEnter: rules.isPermissable,
        redirect: "/af/courses/overview",
        children: [
          {
            path: "overview",
            name: "af-course-overview",
            meta: { permission: permissionData.COURSE_MANAGEMENT.name },
            component: AFCoursesOverview,
          },
          {
            path: "create",
            name: "af-course-create",
            meta: { permission: permissionData.COURSE_MANAGEMENT.name },
            component: AFCourseCreate,
          },
          {
            path: ":id",
            name: "af-course-edit",
            meta: { permission: permissionData.COURSE_MANAGEMENT.name },
            component: AFCourseEdit,
          },
        ],
      },
    ],
  },
  {
    path: "categories",
    name: "af-category",
    component: GenericRouterView,
    meta: { permission: permissionData.CATEGORY_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
    redirect: "/af/categories/overview",
    children: [
      {
        path: "overview",
        name: "af-category-overview",
        meta: {
          permission: permissionData.CATEGORY_MANAGEMENT.name,
        },
        component: AfCategoryOverview,
      },
      {
        path: "create",
        name: "af-category-create",
        meta: {
          permission: permissionData.CATEGORY_MANAGEMENT.name,
        },
        component: AfCategoryCreate,
      },
      {
        path: ":id",
        name: "af-category-edit",
        meta: {
          permission: permissionData.CATEGORY_MANAGEMENT.name,
        },
        component: AfCategoryEdit,
      },
    ],
  },
  {
    path: "products",
    name: "af-products",
    redirect: "/af/products",
    component: GenericRouterView,
    children: [
      {
        path: "",
        component: GenericRouterView,
        meta: { permission: permissionData.PHYSICAL_PRODUCT_MANAGMENT.name },
        beforeEnter: rules.isPermissable,
        redirect: "/af/products/overview",
        children: [
          {
            path: "overview",
            name: "af-product-overview",
            meta: {
              permission: permissionData.PHYSICAL_PRODUCT_MANAGMENT.name,
            },
            component: AFProductOverview,
          },
          {
            path: "create",
            name: "af-product-create",
            meta: {
              permission: permissionData.PHYSICAL_PRODUCT_MANAGMENT.name,
            },
            component: AFProductCreate,
          },
          {
            path: ":id",
            name: "af-product-edit",
            meta: {
              permission: permissionData.PHYSICAL_PRODUCT_MANAGMENT.name,
            },
            component: AFProductEdit,
          },
        ],
      },
    ],
  },
  {
    path: "shop-categories",
    name: "af-shop-categories",
    component: AFShopCategories,
  },
  {
    path: "shop-distributors",
    name: "af-shop-distributors",
    component: AFShopDistributors,
  },
  {
    path: "products-overview",
    name: "af-products-overview",
    component: AFProductsOverview,
  },
  {
    path: "users",
    name: "af-users",
    component: GenericRouterView,
    meta: { permission: permissionData.USER_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
    redirect: "/af/users/overview",
    children: [
      {
        path: "overview",
        name: "af-users-overview",
        meta: { permission: permissionData.USER_MANAGEMENT.name },
        component: AfUsersOverview,
      },
      {
        path: ":id",
        name: "af-user-details",
        meta: { permission: permissionData.USER_MANAGEMENT.name },
        component: AfUserDetails,
      },
    ],
  },
  {
    path: "refunds",
    name: "af-refunds",
    component: AfRefundsOverview,
    meta: { permission: permissionData.VIEW_REFUNDS.name },
    beforeEnter: rules.isPermissable,
  },
  {
    path: "global-notifications",
    name: "af-global-notifications",
    component: GenericRouterView,
    meta: { permission: permissionData.GLOBAL_NOTIFICATIONS_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
    redirect: "/af/global-notifications/overview",
    children: [
      {
        path: "overview",
        name: "af-global-notifications-overview",
        meta: {
          permission: permissionData.GLOBAL_NOTIFICATIONS_MANAGEMENT.name,
        },
        component: AfGlobalNotificationsOverview,
      },
      {
        path: "create",
        name: "af-global-notifications-create",
        meta: {
          permission: permissionData.GLOBAL_NOTIFICATIONS_MANAGEMENT.name,
        },
        component: AfGlobalNotificationsCreate,
      },
      {
        path: ":id",
        name: "af-global-notifications-edit",
        meta: {
          permission: permissionData.GLOBAL_NOTIFICATIONS_MANAGEMENT.name,
        },
        component: AfGlobalNotificationsEdit,
      },
    ],
  },
  {
    path: "adverts",
    name: "af-adverts",
    component: GenericRouterView,
    meta: { permission: permissionData.ADVERT_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
    redirect: "/af/adverts/overview",
    children: [
      {
        path: "overview",
        name: "af-adverts-overview",
        meta: { permission: permissionData.ADVERT_MANAGEMENT.name },
        component: AfAdvertOverview,
      },
      {
        path: "create",
        name: "af-adverts-create",
        meta: { permission: permissionData.ADVERT_MANAGEMENT.name },
        component: AfAdvertCreate,
      },
      {
        path: ":id",
        name: "af-adverts-edit",
        meta: { permission: permissionData.ADVERT_MANAGEMENT.name },
        component: AfAdvertEdit,
      },
    ],
  },
  {
    path: "coupons",
    name: "af-coupons",
    component: GenericRouterView,
    meta: { permission: permissionData.COUPON_MANAGEMENT.name },
    beforeEnter: rules.isPermissable,
    redirect: "/af/coupons/overview",
    children: [
      {
        path: "overview",
        name: "af-coupons-overview",
        meta: { permission: permissionData.COUPON_MANAGEMENT.name },
        component: AfCouponOverview,
      },
      {
        path: "create",
        name: "af-coupons-create",
        meta: { permission: permissionData.COUPON_MANAGEMENT.name },
        component: AfCouponCreate,
      },
      {
        path: ":id",
        name: "af-coupons-edit",
        meta: { permission: permissionData.COUPON_MANAGEMENT.name },
        component: AfCouponEdit,
      },
    ],
  },
];

export default routes;
