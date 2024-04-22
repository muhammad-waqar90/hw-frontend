import Vue from "vue";
import BackButtonPortal from "@/components/Misc/BackButtons/BackButtonPortal";
import userRoleMixin from "@/mixins/User/userRoleMixin";

var ComponentClass = Vue.extend(BackButtonPortal);
const dataObj = {
  hasBack: true,
  root: "app",
};
var instance = new ComponentClass({
  data() {
    return dataObj;
  },
});

export default {
  mixins: [userRoleMixin],

  data() {
    return {
      mixinDefaultBackRoute: null,
    };
  },
  beforeRouteLeave(to, from, next) {
    this.destroyBackButton();
    next();
  },
  created() {
    if (this.$userIsGU) this.setRoot("gu-layout");
  },
  mounted() {
    this.mountBackButton();
  },
  activated() {
    if (!dataObj.hasBack) this.mountBackButton();
  },
  methods: {
    mountBackButton() {
      dataObj.hasBack = true;
      instance.$mount();
      instance.$on("on-back", this.handleOnBack);
      dataObj.root == "app"
        ? document.getElementById("app").appendChild(instance.$el)
        : document.getElementById(dataObj.root).prepend(instance.$el);
    },
    async destroyBackButton() {
      dataObj.root = "app";
      dataObj.hasBack = false;
      await instance.$off();
      instance.$destroy();
    },
    handleOnBack() {
      dataObj.hasBack = false;
      this.mixinDefaultBackRoute
        ? this.$router.push({ name: this.mixinDefaultBackRoute })
        : this.$router.go(-1);
    },
    setDefaultRoute(route) {
      this.mixinDefaultBackRoute = route;
    },
    setRoot(elementId) {
      dataObj.root = elementId;
    },
  },
};
