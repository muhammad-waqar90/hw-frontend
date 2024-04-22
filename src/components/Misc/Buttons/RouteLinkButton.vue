<template>
  <router-link :to="{ name: to }" class="me-2">
    <button :class="btnClass">
      <plus :size="15" />
      {{ lable }}
    </button>
  </router-link>
</template>

<script>
import Plus from "vue-material-design-icons/Plus";

export default {
  name: "RouteLinkButton",
  components: {
    Plus,
  },
  props: {
    to: {
      type: String,
      default: "",
    },
    lable: {
      type: String,
      default: "",
    },
    btnClass: {
      type: String,
      default: "btn blue-btn ms-2",
    },
  },
};
</script>
