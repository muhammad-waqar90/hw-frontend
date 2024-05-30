const IUDashboard = () =>
  import(/* webpackChunkName: "IUDashboardView"  */ "@/views/IU/Dashboard");
const Courses = () =>
  import(/* webpackChunkName: "IUCoursesView"  */ "@/views/IU/Courses");
const CoursesEnrolled = () =>
  import(
    /* webpackChunkName: "IUCoursesEnrolledView"  */ "@/views/IU/CoursesEnrolled"
  );
const CoursesAvailable = () =>
  import(
    /* webpackChunkName: "IUCoursesAvailableView"  */ "@/views/IU/CoursesAvailable"
  );
const CoursesTop = () =>
  import(/* webpackChunkName: "IUCoursesTopView"  */ "@/views/IU/CoursesTop");
const CoursesComingSoon = () =>
  import(
    /* webpackChunkName: "IUCoursesComingSoonView"  */ "@/views/IU/CoursesComingSoon"
  );
const Course = () =>
  import(/* webpackChunkName: "CommonCourseView"  */ "@/views/Common/Course");
const IULesson = () =>
  import(/* webpackChunkName: "IULessonView"  */ "@/views/IU/Lesson");
const IULessonQuiz = () =>
  import(
    /* webpackChunkName: "IULessonQuizView"  */ "@/views/IU/Quizzes/LessonQuiz"
  );
const IULessonQuizAttempt = () =>
  import(
    /* webpackChunkName: "IULessonQuizViewAttempt"  */ "@/views/IU/Quizzes/LessonQuizAttempt"
  );
const IUModuleQuiz = () =>
  import(
    /* webpackChunkName: "IUModuleQuizView"  */ "@/views/IU/Quizzes/ModuleQuiz"
  );
const IUModuleQuizAttempt = () =>
  import(
    /* webpackChunkName: "IUModuleQuizViewAttempt"  */ "@/views/IU/Quizzes/ModuleQuizAttempt"
  );
const IULevelQuiz = () =>
  import(
    /* webpackChunkName: "IULevelQuizView"  */ "@/views/IU/Quizzes/LevelQuiz"
  );
const IULevelQuizAttempt = () =>
  import(
    /* webpackChunkName: "IULevelQuizViewAttempt"  */ "@/views/IU/Quizzes/LevelQuizAttempt"
  );
const IUEBook = () =>
  import(/* webpackChunkName: "IUEBookView"  */ "@/views/IU/EBook");
const Events = () =>
  import(/* webpackChunkName: "IUEventsView"  */ "@/views/IU/Events");
const IuTicketDashboard = () =>
  import(
    /* webpackChunkName: "IuTicketDashboardView"  */ "@/views/IU/Tickets/TicketDashboard"
  );
const IuProfile = () =>
  import(
    /* webpackChunkName: "IuProfileView"  */ "@/views/IU/Profile/IuProfile"
  );
const IuProfileInfo = () =>
  import(
    /* webpackChunkName: "IuProfileInfoView"  */ "@/views/IU/Profile/IuProfileInfo"
  );
const IuSalaryScale = () =>
  import(
    /* webpackChunkName: "SalaryScaleView"  */ "@/views/IU/Profile/SalaryScale"
  );
const IuVerification = () =>
  import(
    /* webpackChunkName: "IuVerificationView"  */ "@/views/IU/Profile/Management/IuVerification"
  );
const IuChangePassword = () =>
  import(
    /* webpackChunkName: "IuChangePasswordView"  */ "@/views/IU/Profile/Management/IuChangePassword"
  );
const IuDeleteAccount = () =>
  import(
    /* webpackChunkName: "IuDeleteAccountView"  */ "@/views/IU/Profile/Management/IuDeleteAccount"
  );
const CommonFaqDashboard = () =>
  import(
    /* webpackChunkName: "CommonFaqDashboardView"  */ "@/views/Common/Faqs/FaqDashboard"
  );
const CommonFaq = () =>
  import(/* webpackChunkName: "CommonFaqView"  */ "@/views/Common/Faqs/Faq");
const IuPaymentMethod = () =>
  import(
    /* webpackChunkName: "IuPaymentView"  */ "@/views/IU/Profile/Payment/IuPaymentMethod"
  );
const IuPurchaseHistory = () =>
  import(
    /* webpackChunkName: "IuPurchaseHistoryView"  */ "@/views/IU/Profile/Payment/IuPurchaseHistory"
  );
const IuCertificatesDashboard = () =>
  import(
    /* webpackChunkName: "IuCertificatesDashboardView"  */ "@/views/IU/Profile/Certificates/CertificatesDashboard"
  );
const CommonCheckout = () =>
  import(
    /* webpackChunkName: "CommonCheckoutView"  */ "@/views/Common/Checkout"
  );
const IuGlobalNotification = () =>
  import(
    /* webpackChunkName: "IuGlobalNotificationView"  */ "@/views/IU/GlobalNotification"
  );

const BookShop = () =>
  import(
    /* webpackChunkName: "IuGlobalNotificationView"  */ "@/views/IU/Products/BookShop.vue"
  );

const ProductsAvailable = () =>
  import(
    /* webpackChunkName: "IuProductsAvailableView"  */ "@/views/IU/Products/ProductsAvailable.vue"
  );

const ProductsTop = () =>
  import(
    /* webpackChunkName: "IuProductsTopView"  */ "@/views/IU/Products/ProductsTop.vue"
  );

const Product = () =>
  import(
    /* webpackChunkName: "CommonProductsView" */ "@/views/Common/Product.vue"
  );

const routes = [
  {
    path: "dashboard",
    name: "iu-dashboard",
    component: IUDashboard,
    meta: {
      title: "Dashboard",
    },
  },
  {
    path: "shop/books/:id",
    name: "iu-book",
    component: Product,
    meta: {
      keepAlive: true,
      keepScrollPosition: true,
      title: "Book",
    },
  },
  {
    path: "courses",
    name: "iu-courses",
    component: Courses,
    meta: {
      title: "Courses",
    },
  },
  {
    path: "courses/enrolled",
    name: "iu-courses-enrolled",
    component: CoursesEnrolled,
    meta: {
      title: "Enrolled Courses",
    },
  },
  {
    path: "courses/available",
    name: "iu-courses-available",
    component: CoursesAvailable,
    meta: {
      title: "Available Courses",
    },
  },
  {
    path: "courses/top",
    name: "iu-courses-top",
    component: CoursesTop,
    meta: {
      title: "Top Courses",
    },
  },
  {
    path: "courses/coming-soon",
    name: "iu-courses-coming-soon",
    component: CoursesComingSoon,
    meta: {
      title: "Coming Soon Courses",
    },
  },
  {
    path: "courses/:id",
    name: "iu-course",
    component: Course,
    meta: {
      // keepAlive: false; required to destroy this component because of video-preview
      keepAlive: true,
      keepScrollPosition: true,
      title: "Course",
    },
  },
  {
    path: "courses/:courseId/lesson/:lessonId",
    name: "iu-lesson",
    component: IULesson,
    meta: {
      title: "Lecture",
      independentLayout: true,
    },
  },
  {
    path: "courses/:courseId/lesson/:lessonId/quiz",
    name: "iu-lesson-quiz",
    component: IULessonQuiz,
    meta: {
      title: "Quiz",
      independentLayout: true,
    },
  },
  {
    path: "courses/:courseId/lesson/:lessonId/quiz/attempt",
    name: "iu-lesson-quiz-attempt",
    component: IULessonQuizAttempt,
    meta: {
      title: "Quiz Attempt",
      independentLayout: true,
    },
  },
  {
    path: "courses/:courseId/lessons/:lessonId/ebook",
    name: "iu-ebook",
    component: IUEBook,
    meta: {
      title: "E-Notes",
      independentLayout: true,
    },
  },
  {
    path: "courses/:courseId/course-module/:courseModuleId/quiz",
    name: "iu-module-quiz",
    component: IUModuleQuiz,
    meta: {
      title: "Exam",
      independentLayout: true,
    },
  },
  {
    path: "courses/:courseId/course-module/:courseModuleId/quiz/attempt",
    name: "iu-module-quiz-attempt",
    component: IUModuleQuizAttempt,
    meta: {
      title: "Exam Attempt",
      independentLayout: true,
    },
  },
  {
    path: "courses/:courseId/course-level/:courseLevelId/quiz",
    name: "iu-level-quiz",
    component: IULevelQuiz,
    meta: {
      title: "Exam",
      independentLayout: true,
    },
  },
  {
    path: "courses/:courseId/course-level/:courseLevelId/quiz/attempt",
    name: "iu-level-quiz-attempt",
    component: IULevelQuizAttempt,
    meta: {
      title: "Exam Attempt",
      independentLayout: true,
    },
  },
  {
    path: "events",
    name: "iu-events",
    component: Events,
    meta: {
      title: "Events",
      independentLayout: true,
    },
  },
  {
    path: "tickets/:id?",
    name: "iu-ticket-dashboard",
    component: IuTicketDashboard,
    meta: {
      title: "Tickets",
      noMobilePadding: true,
    },
  },
  {
    path: "profile",
    name: "iu-profile",
    component: IuProfile,
    redirect: "profile/info",
    children: [
      {
        path: "info",
        name: "iu-profile-info",
        component: IuProfileInfo,
        meta: {
          title: "Profile Info",
          independentLayout: true,
        },
      },
      {
        path: "verification",
        name: "iu-verification",
        component: IuVerification,
        meta: {
          title: "Verification",
          independentLayout: true,
        },
      },
      {
        path: "change-password",
        name: "iu-change-password",
        component: IuChangePassword,
        meta: {
          title: "Change Password",
          independentLayout: true,
        },
      },
      {
        path: "delete-account",
        name: "iu-delete-account",
        component: IuDeleteAccount,
        meta: {
          title: "Delete Account",
          independentLayout: true,
        },
      },
      {
        path: "certificates/:id?",
        name: "iu-certificates-dashboard",
        component: IuCertificatesDashboard,
        meta: {
          title: "Certificates",
          independentLayout: true,
        },
      },
      {
        path: "payment",
        name: "iu-card-payment",
        component: IuPaymentMethod,
        meta: {
          title: "Payment Settings",
          independentLayout: true,
        },
      },
      {
        path: "history",
        name: "iu-card-history",
        component: IuPurchaseHistory,
        meta: {
          title: "Purchases",
          independentLayout: true,
        },
      },
      {
        path: "salary-scale",
        name: "iu-salary-scale-dashboard",
        component: IuSalaryScale,
        meta: {
          title: "Salary Scale",
          independentLayout: true,
        },
      },
    ],
  },
  {
    path: "faqs",
    name: "iu-faq-dashboard",
    component: CommonFaqDashboard,
    meta: {
      keepAlive: true,
      title: "Faqs",
    },
  },
  {
    path: "faqs/:id",
    name: "iu-faq",
    component: CommonFaq,
    meta: {
      title: "Faq",
    },
  },
  {
    path: "checkout",
    name: "iu-checkout",
    component: CommonCheckout,
    meta: {
      title: "Checkout",
      independentLayout: true,
    },
  },
  {
    path: "global/:id",
    name: "iu-global",
    component: IuGlobalNotification,
    meta: {
      title: "Global Notification",
    },
  },
  {
    path: "shop",
    name: "iu-shop",
    component: BookShop,
    meta: {
      title: "Books",
    },
  },
  {
    path: "shop/available",
    name: "iu-products-available",
    component: ProductsAvailable,
    meta: {
      title: "Available Books",
    },
  },
  {
    path: "shop/top",
    name: "iu-products-top",
    component: ProductsTop,
    meta: {
      title: "Top Books",
    },
  },
];

export default routes;
