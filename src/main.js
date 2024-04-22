import Vue from "vue";
import store from "./store";
import bootstrap from "./bootstrap";
import App from "./App.vue";

//init routes
const router = bootstrap.initRouter();

//Directives
bootstrap.initDirectives();

//Translations
const i18n = bootstrap.initLangModule();

//Portal
bootstrap.initPortal();

//Stripe
bootstrap.initStripe();

//Google Analytics
if (process.env.VUE_APP_ENV === "production") bootstrap.initGA();

//Misc
bootstrap.initToast();
bootstrap.initLottie();

//Datadog logs:: hold until approved service which have to use
// if (process.env.VUE_APP_ENV == "development") bootstrap.initDatadogRum();

if (process.env.VUE_APP_ENV == "production") bootstrap.initAwsRum();

Vue.config.productionTip = false;

new Vue({
  store,
  router,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
