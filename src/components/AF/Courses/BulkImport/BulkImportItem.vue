<template>
  <div class="mb-2">
    <div
      class="row py-4 px-3"
      :class="customCssClass ? customCssClass : 'bg-white rounded-card'"
    >
      <div class="col-1">
        {{ item.id }}
      </div>
      <div v-if="entity == 'course'" class="col-2">Course Exam Zip</div>
      <div :class="entity == 'course' ? 'col-4' : 'col-6'">
        {{ item.uploaded_by }}
      </div>
      <div class="col-2">
        <span class="text-uppercase" :class="importStatusClass[item.status]">
          {{ item.status }}
        </span>
        <span
          v-if="item.status === 'failed'"
          class="cursor-pointer"
          @click="toggleError"
        >
          <ChevronUp v-if="expanded" :size="25" />
          <ChevronDown v-else :size="25" />
        </span>
        <span
          v-else-if="item.status === 'pending' || item.status === 'processing'"
        >
          <reload
            v-if="!isSubmitting"
            class="cursor-pointr"
            :size="22"
            @click="onReloadStatus"
          />
          <span v-else class="spinner-border spinner-border-sm" />
        </span>
      </div>
      <div class="col-3 d-flex align-items-center">
        {{ dateFormat(item.updated_at) }}
      </div>
    </div>
    <pre
      v-if="item.status === 'failed' && expanded"
      class="px-4 py-4 mt-2 rounded-card border"
    >
 {{ errorFormat(item.errors) }} </pre
    >
  </div>
</template>

<script>
import ChevronUp from "vue-material-design-icons/ChevronUp";
import ChevronDown from "vue-material-design-icons/ChevronDown";
import Reload from "vue-material-design-icons/Reload";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";

export default {
  name: "BulkImportItem",
  components: {
    ChevronUp,
    ChevronDown,
    Reload,
  },
  props: {
    item: { type: Object },
    entity: { type: String, default: "course" },
    customCssClass: { type: String, default: "" },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      importStatusClass: {
        pending: "badge bg-secondary",
        processing: "badge bg-warning text-dark",
        completed: "badge bg-success",
        failed: "badge bg-danger",
      },
      expanded: false,
    };
  },
  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(date);
    },
    toggleError() {
      this.expanded = !this.expanded;
    },
    errorFormat(errors) {
      return JSON.stringify(JSON.parse(errors), undefined, 4);
    },
    onReloadStatus() {
      this.$emit("on-reload-status");
    },
  },
};
</script>

<style lang="scss" scoped>
pre {
  color: red;
}
</style>
