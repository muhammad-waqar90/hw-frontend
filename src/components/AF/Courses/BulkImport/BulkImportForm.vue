<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <div class="mini-section-heading mb-3">
        {{ entity == "lecture" ? "Quiz" : "Exam" }} Configuration
      </div>
      <label>Duration (min: 10 seconds):</label>
      <Information
        :size="17"
        title="Duration is the total time required to complete the quiz/exam"
        class="cursor-pointer text-primary"
      />
      <div class="position-relative">
        <input
          v-model.trim.lazy="$v.duration.$model"
          type="number"
          placeholder="e.g 300"
          class="form-control"
          :class="{ 'is-invalid': $v.duration.$error }"
          @input="(e) => onUpdateField()"
        />
      </div>
    </div>
    <div class="mb-3">
      <label>No of Questions (min:4, divisibleBy:4):</label>
      <Information
        :size="17"
        title="Total number of questions user have to attempt"
        class="cursor-pointer text-primary"
      />
      <div class="position-relative">
        <input
          v-model.trim.lazy="$v.sampleSize.$model"
          type="number"
          placeholder="e.g 16"
          class="form-control"
          :class="{ 'is-invalid': $v.sampleSize.$error }"
          @input="(e) => onUpdateField()"
        />
      </div>
    </div>
    <div v-if="entity != 'lecture'" class="mb-3">
      <label>Price(£) (min:1, max:99.99)</label>
      <div class="position-relative">
        <input
          v-model.trim.lazy="$v.price.$model"
          type="number"
          step="0.01"
          placeholder="e.g 5"
          class="form-control"
          :class="{ 'is-invalid': $v.price.$error }"
          @input="(e) => onUpdateField()"
        />
      </div>
    </div>
    <!-- TODO: good to make number of attempt allowed to take for a purchase able module exam -->

    <!-- TODO: it may good to make it optional, if admin just want to update exam configuration -->
    <div class="mb-3">
      <div class="mini-section-heading">Upload Questions File</div>
      <label>Select Questions File (max: 5MB, format: xlsx | xls):</label>
      <div class="position-relative">
        <input
          ref="fileUpload"
          type="file"
          accept=".xlsx, .xls"
          @change="storeFileTemp"
        />
      </div>
      <template v-if="$v.selectedFile.$error">
        <small
          v-if="!$v.selectedFile.isExcel"
          class="form-text text-danger error"
        >
          .xlsx or .xls format file required
        </small>
        <small
          v-else-if="!$v.selectedFile.isFileValid"
          class="form-text text-danger error"
        >
          {{ errors.invalidFileSize }}
        </small>
      </template>
    </div>
    <FormActionButtons :is-submitting="isSubmitting" />
  </form>
</template>

<script>
import FormActionButtons from "@/components/Misc/Forms/FormActionButtons.vue";
import { validateFileSize } from "@/utils/validationUtils.js";
import { MAX_FILE_SIZE } from "@/dataObject/AF/fileSizeData.js";
import { validationMixin } from "vuelidate";
import {
  required,
  minValue,
  maxValue,
  decimal,
} from "vuelidate/lib/validators";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import Information from "vue-material-design-icons/Information";
import { errors } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  name: "BulkImportForm",
  components: {
    FormActionButtons,
    Information,
  },
  mixins: [permissionsMixin, validationMixin, dompurifyMixin],
  props: {
    isSubmitting: { type: Boolean },
    entity: { type: String },
    latestImport: { type: Object, default: () => {} },
  },
  data() {
    return {
      duration: null,
      sampleSize: null,
      price: "",
      selectedFile: null,
      errors,
    };
  },
  validations() {
    return {
      duration: {
        required,
        minValue: minValue(10),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      sampleSize: {
        required,
        minValue: minValue(4),
        isDivisibleByFour(val) {
          return val % 4 == 0;
        },
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      ...(this.entity == "module"
        ? {
            price: {
              decimal,
              minValue: minValue(0),
              maxValue: maxValue(99.99),
              isSanitizeInput: function (value) {
                return this.sanitizeInput(value);
              },
            },
          }
        : {}),
      selectedFile: {
        isExcel: (value) => {
          if (value == null) return false;

          return value.type ===
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
            value.type === "application/vnd.ms-excel"
            ? true
            : false;
        },
        isFileValid: (value) => {
          return validateFileSize(value, MAX_FILE_SIZE.bulkImport);
        },
      },
    };
  },
  watch: {
    latestImport() {
      if (this.latestImport?.id) this.mapData();
    },
  },
  mounted() {
    if (this.latestImport?.id) this.mapData();
  },
  methods: {
    onUpdateField() {
      this.$store.dispatch("course/setHasEntityChanged", true);
    },
    chooseFile() {
      this.$refs.fileUpload.click();
    },
    storeFileTemp(e) {
      this.selectedFile = e.target.files[0];
      this.$v.selectedFile.$touch();
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      let formData = new FormData();
      formData.append("duration", this.duration);
      formData.append("sample_size", this.sampleSize);
      formData.append("price", this.price);
      formData.append("file", this.selectedFile);

      this.$emit("on-submit", formData);
      this.$store.dispatch("course/setHasEntityChanged", false);
    },
    mapData() {
      this.duration = this.latestImport?.duration || "";
      this.sampleSize = this.latestImport?.num_of_questions || "";
      this.price = this.entity == "module" ? this.latestImport?.price : "";
    },
  },
};
</script>
