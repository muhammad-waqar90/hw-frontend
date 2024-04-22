<template>
  <div v-if="validate" class="row mt-3 mb-3">
    <div class="col-12">
      <div v-if="loading" class="text-warning">
        <span
          class="spinner-border spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
        {{ loadingMessage }}
      </div>
      <div v-else-if="data?.length" class="text-danger">
        {{ dataMessage }}
        <ul class="fix-height-scroll mt-1">
          <li v-for="(item, index) in data" :key="index">
            {{ item.course_module.name }} - {{ item.name }}
          </li>
        </ul>
      </div>
      <div v-else class="text-success">
        <CheckCircle /> {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script>
import CheckCircle from "vue-material-design-icons/CheckCircle.vue";

export default {
  name: "ValidateEntity",
  components: {
    CheckCircle,
  },
  props: {
    validate: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
    loadingMessage: {
      type: String,
      default: "validating...",
    },
    successMessage: {
      type: String,
      default: "validated",
    },
    data: {
      type: Array,
      default: null,
    },
    dataMessage: {
      type: String,
      default: "",
    },
    // TODO: we required to send required to call api as well to make it completely independent component.
  },
};
</script>

<style lang="scss" scoped>
.fix-height-scroll {
  overflow: auto;
  height: 300px;
}
</style>
