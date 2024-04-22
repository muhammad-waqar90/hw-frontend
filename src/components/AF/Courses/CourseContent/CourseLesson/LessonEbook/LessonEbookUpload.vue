<template>
  <div>
    <div class="d-flex justify-content-end pe-2">
      <ButtonWithTooltip
        v-if="!$isEbookManager || (mode !== 'create' && !isSubmitting)"
        :disabled="true"
        label="ADD E-NOTES"
        :message="disableMessage"
        btn-class="btn blue-btn"
      />
      <button
        v-else
        class="btn blue-btn"
        :disabled="isSubmitting"
        @click="chooseFile"
      >
        <span
          v-if="!isSubmitting || mode !== 'create'"
          class="d-flex align-items-end"
        >
          ADD E-NOTES
        </span>
        <span v-else class="spinner-border spinner-border-sm" />
      </button>
      <input
        ref="fileUpload"
        type="file"
        style="display: none"
        accept="application/pdf"
        @change="storeFileTemp"
      />
    </div>
    <div class="text-end pe-2">
      <small class="text-warning error"> max file size: 50MB</small>
    </div>
    <div v-if="$v.selectedEbook.$error" class="text-end">
      <small
        v-if="!$v.selectedEbook.isPDF"
        class="form-text text-danger text-center error"
      >
        selected file is not in .pdf format
      </small>
      <small
        v-else-if="!$v.selectedEbook.isFileValid"
        class="form-text text-danger text-center error"
      >
        {{ errors.invalidFileSize }}
      </small>
    </div>
  </div>
</template>

<script>
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";
import { validationMixin } from "vuelidate";
import { validateFileSize } from "@/utils/validationUtils.js";
import {
  courseText,
  generalText,
  errors,
} from "@/dataObject/AF/afStaticTextsData";
import permissionsMixin from "@/mixins/AF/permissionsMixin";

export default {
  name: "LessonEbookUpload",
  components: {
    ButtonWithTooltip,
  },
  mixins: [validationMixin, permissionsMixin],
  props: {
    mode: { type: String },
    isSubmitting: { type: Boolean },
  },
  data() {
    return {
      selectedEbook: null,
      courseText,
      generalText,
      errors,
    };
  },
  computed: {
    disableMessage() {
      return this.$isEbookManager && this.mode !== "create"
        ? "Action disabled as e-notes added already" // 1:1 - lesson:e-note
        : generalText.notPermitted;
    },
  },
  validations() {
    return {
      selectedEbook: {
        isPDF: (value) => {
          if (value == null) return false;
          return value.type == "application/pdf" ? true : false;
        },
        isFileValid: (value) => {
          return validateFileSize(value);
        },
      },
    };
  },
  methods: {
    chooseFile() {
      this.$refs.fileUpload.click();
    },
    storeFileTemp(e) {
      this.selectedEbook = e.target.files[0];
      this.$v.selectedEbook.$touch();
      if (this.$v.selectedEbook.$invalid)
        return (this.$refs.fileUpload.value = "");
      if (this.selectedEbook) this.$emit("on-upload", this.selectedEbook);
      this.$refs.fileUpload.value = "";
    },
  },
};
</script>
