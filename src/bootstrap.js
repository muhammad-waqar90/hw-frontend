import Vue from "vue";
import VueRouter from "vue-router";
import router from "./router/router";
import VueI18n from "vue-i18n";
import VueToast from "vue-toast-notification";
import VueGtag from "vue-gtag";
import PortalVue from "portal-vue";
import { langMessages } from "./lang/messages";
import { StripePlugin } from "@vue-stripe/vue-stripe";
import LottieAnimation from "lottie-vuejs/src/LottieAnimation.vue";
import { datadogRum } from "@datadog/browser-rum";
import { AwsRum } from "aws-rum-web";

import MaRoutes from "@/router/partials/MaRoutes";
import HaRoutes from "@/router/partials/HaRoutes";
import AfRoutes from "@/router/partials/AfRoutes";

export default {
  initRouter() {
    Vue.use(VueRouter);
    return router.getRoutes();
  },
  initDirectives() {
    Vue.directive("click-outside", {
      bind: function (el, binding, vnode) {
        el.clickOutsideEvent = function (event) {
          if (!(el == event.target || el.contains(event.target))) {
            vnode.context[binding.expression](event);
          }
        };
        document.body.addEventListener("click", el.clickOutsideEvent);
      },
      unbind: function (el) {
        document.body.removeEventListener("click", el.clickOutsideEvent);
      },
    });
    Vue.directive("html-directive", {
      bind(el, { value }) {
        el.innerHTML = value?.replace(/\r?\n/g, "<br />") || "";
      },
    });
  },
  initLangModule() {
    Vue.use(VueI18n);

    return new VueI18n({
      locale: "en",
      fallbackLocale: "en",
      messages: langMessages,
      silentTranslationWarn: process.env.NODE_ENV === "production",
    });
  },
  initToast() {
    Vue.use(VueToast, {
      position: "bottom",
      duration: 3000,
    });
  },
  initPortal() {
    Vue.use(PortalVue);
  },
  initStripe() {
    const options = {
      pk: process.env.VUE_APP_STRIPE_KEY,
      apiVersion: "2020-03-02",
    };
    Vue.use(StripePlugin, options);
  },
  initGA() {
    Vue.use(
      VueGtag,
      {
        pageTrackerExcludedRoutes: [
          ...getRouteNamesRecursive(MaRoutes),
          ...getRouteNamesRecursive(HaRoutes),
          ...getRouteNamesRecursive(AfRoutes),
        ],
        config: { id: process.env.VUE_APP_GA_KEY },
      },
      router.getRoutes()
    );
  },
  initLottie() {
    Vue.use(LottieAnimation);
  },
  initDatadogRum() {
    // TODO: secrets from env
    datadogRum.init({
      applicationId: "ecde2248-83a1-494d-9e08-7ec5b4311e98",
      clientToken: "pubb4c5a2b1cb078833165e01e4cc9f8cc1",
      site: "datadoghq.com",
      service: "hw-frontend",
      env: "dev",
      // Specify a version number to identify the deployed version of your application in Datadog     // version: '1.0.0',
      sessionSampleRate: 100,
      sessionReplaySampleRate: 100,
      trackUserInteractions: true,
      trackResources: true,
      trackLongTasks: true,
      defaultPrivacyLevel: "mask-user-input",
    });

    datadogRum.startSessionReplayRecording();
  },
  initAwsRum() {
    try {
      const config = {
        sessionSampleRate: 1,
        guestRoleArn: process.env.VUE_APP_AWS_RUM_ARN,
        identityPoolId: process.env.VUE_APP_AWS_RUM_POOL_ID,
        endpoint: process.env.VUE_APP_AWS_RUM_ENDPOINT,
        telemetries: ["performance", "errors", "http"],
        allowCookies: true,
        enableXRay: false,
      };

      const APPLICATION_ID = process.env.VUE_APP_AWS_RUM_APPLICATION_ID;
      const APPLICATION_VERSION = "1.0.0";
      const APPLICATION_REGION = "us-east-1";

      new AwsRum(
        APPLICATION_ID,
        APPLICATION_VERSION,
        APPLICATION_REGION,
        config
      );
    } catch (error) {
      // Ignore errors thrown during CloudWatch RUM web client initialization
    }
  },
};

//Doesn't seem to work for GA4, but will keep it for a while
function getRouteNamesRecursive(routes) {
  let names = [];
  for (let item of routes) {
    names.push(item.name);
    if (item.children) names.push(...getRouteNamesRecursive(item.children));
  }
  return names;
}
