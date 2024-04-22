<template>
  <div class="mx-3">
    <div>
      <span>privacy policy</span>
    </div>
    <div class="d-flex justify-content-between gap-3 mt-2">
      <span
        >We use cookies to make our website work and to give you the best user
        experience.</span
      >
      <span
        class="w-25 small-height btn blue-btn position-relative rounded-pill text-uppercase small-font font-weight-600"
        >{{ $t("iu.webShop.acceptAndContinue") }}</span
      >
    </div>
  </div>
</template>

<style scoped>
.small-height {
  height: 32px;
  /* width: 25%; */
}
.small-font {
  font-size: 12px;
}
</style>
