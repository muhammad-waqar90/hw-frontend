<template>
  <div v-if="param" class="d-flex flex-column text-red pt-2">
    <small v-for="message in paramMessage" :key="message">
      {{ message }}
    </small>
  </div>
</template>

<script>
export default {
  props: {
    param: null,

    withRequiredMessage: {
      type: Boolean,
      default: true,
    },
  },

  computed: {
    paramMessage() {
      var message = [];

      if (this.param.required === false && this.withRequiredMessage) {
        message.push(this.$t(`iu.profile.validation.required`));
        return message;
      }

      if (this.param.isSanitizeInput === false) {
        message.push(this.$t(`errors.invalidFields`));
        return message;
      }

      if (this.param.minLength === false)
        message.push(
          this.$t(`iu.profile.validation.minLetters`, {
            num: this.param.$params.minLength.min,
          })
        );
      if (this.param.maxLength === false)
        message.push(
          this.$t(`iu.profile.validation.maxLetters`, {
            num: this.param.$params.maxLength.max,
          })
        );
      if (this.param.url === false)
        message.push(
          this.$t(`iu.profile.validation.invalidUrl`, {
            num: this.param.$params.url,
          })
        );
      if (this.param.invalid === false)
        message.push(this.$t(`iu.profile.validation.invalid`));
      if (this.param.isPhoneNumber === false)
        message.push(this.$t(`iu.profile.validation.phoneNumber.notValid`));

      return message;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.text-red {
  color: $red;
}
</style>
