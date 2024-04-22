<template>
  <div class="rounded-card text-light-gray py-4 mt-1 border">
    <div class="pb-2 mt-4 text-center">
      <FolderClockOutline :size="70" />
    </div>
    <h6 class="col-12 pb-1 my-4 text-center">
      <span v-if="loading">
        <span
          class="spinner-border"
          :class="'spinner-border-sm'"
          role="status"
          aria-hidden="true"
        />
        Loading...
      </span>
      <span v-else>{{ message }}</span>
    </h6>
  </div>
</template>

<script>
import FolderClockOutline from "vue-material-design-icons/FolderClockOutline.vue";

export default {
  name: "NoRecordFound",
  components: {
    FolderClockOutline,
  },
  props: {
    message: {
      type: String,
      default: "No Record Found",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
