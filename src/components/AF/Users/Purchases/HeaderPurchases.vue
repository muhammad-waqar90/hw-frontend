<template>
  <div class="d-flex justify-content-between py-4">
    <h3 class="w-100">
      User Purchases - {{ user.first_name }} {{ user.last_name }} ({{
        user.email
      }})
    </h3>
  </div>
</template>

<script>
export default {
  name: "HeaderPurchases",
  props: {
    user: {
      type: Object,
      default: null,
    },
  },
};
</script>
