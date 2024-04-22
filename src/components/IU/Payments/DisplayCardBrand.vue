<template>
  <div>
    <template v-if="cardBrand == 'mastercard'">
      <img
        :class="{ 'master-small ': small }"
        src="/img/payments/mastercard_logo.png"
      />
    </template>
    <template v-else-if="cardBrand == 'visa'">
      <img
        :class="[small ? 'visa-small' : 'visa']"
        src="/img/payments/visa_logo.png"
      />
    </template>
    <div v-else class="text-capitalize mb-2 mt-3 fw-bold">
      {{ cardBrand }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cardBrand: {
      type: String,
      default: null,
    },
    small: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.visa {
  width: 30%;
  margin-bottom: 10%;
}
.visa-small {
  width: 20%;
  margin-bottom: 7%;
  margin-top: 10%;
}
.master-small {
  width: 40%;
  height: 25%;
  margin-bottom: 1%;
}
</style>
