<template>
  <div>
    <button
      class="btn btn-sm orange-btn text-white close-notes p-0 rounded"
      @click="$emit('on-close')"
    >
      <Close />
    </button>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/Close";
export default {
  components: {
    Close,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
button {
  background: $orange;
}
</style>
