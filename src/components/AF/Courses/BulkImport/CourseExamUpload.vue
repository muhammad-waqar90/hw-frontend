<template>
  <div class="d-flex justify-content-end">
    <ButtonWithTooltip
      :disabled="
        (!isAllowAddDelete || !$isAbleToBulkUploadQuizzes) && !isSubmitting
      "
      :message="
        $isAbleToBulkUploadQuizzes
          ? courseText.disableCreateDelete
          : 'Action disabled because you don\'t have permission'
      "
      btn-class="btn blue-btn"
      @on-click="chooseFile"
    >
      <template slot="body">
        <span v-if="!isSubmitting" class="d-flex align-items-end">
          UPLOAD COURSE EXAMS (.zip)
        </span>
        <span v-else class="spinner-border spinner-border-sm" />
      </template>
    </ButtonWithTooltip>
    <input
      ref="fileUpload"
      type="file"
      style="display: none"
      accept=".zip"
      @change="storeFileTemp"
    />
  </div>
</template>

<script>
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import { courseText } from "@/dataObject/AF/afStaticTextsData";

export default {
  name: "CourseExamUpload",
  components: {
    ButtonWithTooltip,
  },
  mixins: [permissionsMixin],
  props: {
    isSubmitting: { type: Boolean },
    isAllowAddDelete: { type: Boolean },
  },
  data() {
    return {
      selectedZip: null,
      courseText,
    };
  },
  methods: {
    chooseFile() {
      this.$refs.fileUpload.click();
    },
    storeFileTemp(e) {
      this.selectedZip = e.target.files[0];
      if (this.selectedZip) this.$emit("on-upload", this.selectedZip);

      this.$refs.fileUpload.value = "";
    },
  },
};
</script>
