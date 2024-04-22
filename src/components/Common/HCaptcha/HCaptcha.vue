<template>
  <vue-hcaptcha
    ref="hcaptcha"
    :sitekey="siteKey"
    @verify="onVerify"
    @expired="$emit('on-expired')"
  />
</template>

<script>
import VueHcaptcha from "@hcaptcha/vue-hcaptcha";
export default {
  components: { VueHcaptcha },
  props: {
    toggleResetCaptcha: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      siteKey: process.env.VUE_APP_HCAPTCHA_SITE_KEY,
    };
  },
  watch: {
    toggleResetCaptcha(val) {
      val && this.$refs.hcaptcha.reset();
    },
  },
  methods: {
    onVerify(token) {
      this.$emit("on-verify", token);
    },
  },
};
</script>
