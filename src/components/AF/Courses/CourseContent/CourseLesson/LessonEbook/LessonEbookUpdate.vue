<template>
  <span class="cursor-pointer">
    <Pen v-if="!isSubmitting" :size="18" @click="chooseFile" />
    <span v-else class="spinner-border spinner-border-sm" />
    <input
      ref="fileUpload"
      type="file"
      style="display: none"
      accept="application/pdf"
      @change="storeFileTemp"
    />
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
  </span>
</template>

<script>
import Pen from "vue-material-design-icons/Pen";
import { validationMixin } from "vuelidate";
import { validateFileSize } from "@/utils/validationUtils.js";
import { courseText, errors } from "@/dataObject/AF/afStaticTextsData";

export default {
  name: "LessonEbookUpdate",
  components: {
    Pen,
  },
  mixins: [validationMixin],
  props: {
    isSubmitting: { type: Boolean },
  },
  data() {
    return {
      courseText,
      selectedEbook: null,
      errors,
    };
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
