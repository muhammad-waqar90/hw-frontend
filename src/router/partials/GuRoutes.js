const Login = () =>
  import(/* webpackChunkName: "LoginView"  */ "@/views/Login");
const Register = () =>
  import(/* webpackChunkName: "RegisterView"  */ "@/views/Register");
const ForgotUsername = () =>
  import(
    /* webpackChunkName: "ForgotUsernameView"  */ "@/views/ForgotUsername"
  );
const ResetPassword = () =>
  import(/* webpackChunkName: "ResetPasswordView"  */ "@/views/ResetPassword");
const RegisterConfirm = () =>
  import(
    /* webpackChunkName: "RegisterConfirmView"  */ "@/views/RegisterConfirm"
  );
const RegisterResend = () =>
  import(
    /* webpackChunkName: "RegisterResendView"  */ "@/views/RegisterResendLink"
  );
const ResetPasswordConfirm = () =>
  import(
    /* webpackChunkName: "ResetPasswordConfirmView"  */ "@/views/ResetPasswordConfirm"
  );
const RestoreAccount = () =>
  import(
    /* webpackChunkName: "RestoreAccountView"  */ "@/views/RestoreAccount"
  );
const GuestTicket = () =>
  import(/* webpackChunkName: "GuestTicketView"  */ "@/views/GU/GuestTicket");
const CommonCheckout = () =>
  import(
    /* webpackChunkName: "CommonCheckoutView"  */ "@/views/Common/Checkout"
  );
const CommonFaqDashboard = () =>
  import(
    /* webpackChunkName: "CommonFaqDashboardView"  */ "@/views/Common/Faqs/FaqDashboard"
  );
const CommonFaq = () =>
  import(/* webpackChunkName: "CommonFaqView"  */ "@/views/Common/Faqs/Faq");
const Course = () =>
  import(/* webpackChunkName: "CommonCourseView"  */ "@/views/Common/Course");

const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Login",
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      title: "Register",
    },
  },
  {
    path: "/forgot-username",
    name: "forgot-username",
    component: ForgotUsername,
    meta: {
      title: "Forgot Username",
    },
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPassword,
    meta: {
      title: "Reset Password",
    },
  },
  {
    path: "/register-success/:identity",
    name: "register-confirmation-link",
    component: RegisterConfirm,
    meta: {
      title: "Register Success",
    },
  },
  {
    path: "/register-resend-link",
    name: "register-resend-link",
    component: RegisterResend,
    meta: {
      title: "Register Resend Link",
    },
  },
  {
    path: "/reset-password/:token",
    name: "reset-password-confirm",
    component: ResetPasswordConfirm,
    meta: {
      title: "Reset Password",
    },
  },
  {
    path: "/restore-account/:token",
    name: "restore-account",
    component: RestoreAccount,
    meta: {
      title: "Restore Account",
    },
  },
  {
    path: "/tickets",
    name: "gu-tickets",
    component: GuestTicket,
    meta: {
      title: "GU Tickets",
    },
  },
  {
    path: "checkout",
    name: "gu-checkout",
    component: CommonCheckout,
    meta: {
      title: "GU Checkout",
      independentLayout: true,
    },
  },
  {
    path: "faqs",
    name: "gu-faq-dashboard",
    component: CommonFaqDashboard,
    meta: {
      keepAlive: true,
      title: "GU Faqs",
    },
  },
  {
    path: "faqs/:id",
    name: "gu-faq",
    component: CommonFaq,
    meta: {
      title: "Gu Faq",
    },
  },
  {
    path: "courses/:id",
    name: "gu-course",
    component: Course,
    meta: {
      title: "GU Course",
      keepAlive: true,
      keepScrollPosition: true,
    },
  },
];

export default routes;
