<template>
  <div class="container-fluid mt-3">
    <div class="row py-2 px-3">
      <div class="col-1">ID</div>
      <div v-if="entity == 'course'" class="col-2">File</div>
      <div :class="entity == 'course' ? 'col-4' : 'col-6'">Uploaded By</div>
      <div class="col-2">Status</div>
      <div class="col-3 d-flex align-items-center">Last Updated</div>
    </div>
    <div v-for="item in imports" :key="item.id">
      <BulkImportItem
        :item="item"
        :entity="entity"
        :custom-css-class="customCssClass"
        :is-submitting="isSubmitting"
        @on-reload-status="onReloadStatus"
      />
    </div>
  </div>
</template>

<script>
import BulkImportItem from "@/components/AF/Courses/BulkImport/BulkImportItem.vue";

export default {
  name: "BulkImportTable",
  components: {
    BulkImportItem,
  },
  props: {
    imports: { type: Array },
    isSubmitting: { type: Boolean },
    entity: { type: String, default: "course" },
    customCssClass: { type: String, default: "" },
  },
  methods: {
    onReloadStatus() {
      this.$emit("on-reload-status");
    },
  },
};
</script>
