<template>
  <div class="h-100 bg-white py-4 px-4 rounded-card">
    <form @submit.prevent="onSubmit">
      <div class="row px-2">
        <div class="col-md-6 col-sm-12">
          <div class="mb-3">
            <label>Name (min:4, max:50):</label>
            <div class="position-relative">
              <input
                v-model.trim.lazy="$v.name.$model"
                type="text"
                placeholder="e.g Algebra"
                class="form-control w-100 bg-light"
                :class="{ 'is-invalid': $v.name.$error }"
                @input="(e) => onUpdateField('name', e.target.value)"
              />
            </div>
          </div>
          <div class="mb-3">
            <label>Description:</label>
            <div :class="{ 'is-invalid': $v.description.$error }">
              <GeneralCkEditor
                v-if="hasInitialized"
                :initial-text="description"
                @note-input="noteInput"
              />
            </div>
          </div>
        </div>
        <div class="col-md-6 col-sm-12">
          <div class="mb-3">
            <label>Category:</label>
            <div
              class="position-relative"
              :class="{ 'is-invalid': $v.selectedCategory.$error }"
            >
              <AsyncVueSelect
                label="category"
                :select-custom-style-class="'bg-light'"
                :selected-item="selectedCategory"
                :service="getCategoryList"
                @on-change="handleCategorySelection"
              />
            </div>
          </div>
          <div class="mb-3">
            <label
              >Amount(<b class="text-success">£</b>)
              <span class="text-info">(Web & Android App)</span> (free:0, min:1,
              max:5000):</label
            >
            <div class="position-relative">
              <input
                v-model.trim.lazy="$v.price.$model"
                type="number"
                class="form-control w-100 bg-light"
                placeholder="e.g 70"
                step="0.01"
                :class="{ 'is-invalid': $v.price.$error }"
                @input="(e) => onUpdateField('price', e.target.value)"
              />
            </div>
          </div>
          <div class="mb-3">
            <label
              >Tier(<b class="text-success">£</b>)
              <span class="text-info">(iOS - InApp)</span>:</label
            >
            <div class="position-relative">
              <select
                v-model.trim.lazy="$v.tier.$model"
                class="form-control bg-light"
                :class="{ 'is-invalid': $v.tier.$error }"
                @input="(e) => onUpdateField('tier', e.target.value)"
              >
                <option disabled hidden :value="null">Select tier...</option>
                <option v-for="item in tiers" :key="item.id" :value="item.id">
                  {{ item.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="mb-3">
            <label>Number of Level(s) (min:1, max:100):</label>
            <div class="position-relative">
              <input
                v-model.trim.lazy="$v.numberOfLevels.$model"
                type="number"
                class="form-control w-100"
                placeholder="e.g 3"
                :disabled="mode === 'edit'"
                :class="{
                  'is-invalid': $v.numberOfLevels.$error,
                  'bg-light': mode !== 'edit',
                }"
                @input="(e) => onUpdateField('numberOfLevels', e.target.value)"
              />
            </div>
          </div>
          <div class="mb-3">
            <label>Course Preview Video (optional):</label>
            <div class="position-relative">
              <input
                v-model.trim.lazy="$v.videoPreviewS3Link.$model"
                type="text"
                class="form-control w-100 bg-light"
                placeholder="Course preview video S3 link e.g CourseName.mp4"
                :class="{ 'is-invalid': $v.videoPreviewS3Link.$error }"
                @input="
                  (e) => onUpdateField('videoPreviewS3Link', e.target.value)
                "
              />
            </div>
          </div>
          <div class="mb-3">
            <label>Select Course Thumbnail:</label>
            <div v-if="imgPreview" class="position-relative pb-2">
              <img
                :src="imgPreview"
                class="rounded-card shadow-sm"
                style="width: 40%"
              />
            </div>
            <div class="position-relative">
              <input
                id="img"
                ref="fileUpload"
                type="file"
                accept="image/jpeg, image/jpg"
                @change="storeFileTemp"
              />
            </div>
            <template v-if="$v.selectedFile.$error">
              <small
                v-if="!$v.selectedFile.isImage"
                class="form-text text-danger error"
              >
                .jpeg or .jpg format course thumbnail required
              </small>
              <small
                v-else-if="!$v.selectedFile.isFileValid"
                class="form-text text-danger error"
              >
                {{ errors.invalidFileSize }}
              </small>
            </template>
          </div>
        </div>
      </div>
      <FormActionButtons
        :mode="mode"
        :is-submitting="isSubmitting"
        :disable-delete="!isAllowAddDelete"
        :disable-delete-message="courseText.disableCreateDelete"
        @start-deleting="startDeleting"
      />
    </form>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  integer,
  numeric,
  decimal,
  between,
} from "vuelidate/lib/validators";
import FormActionButtons from "@/components/Misc/Forms/FormActionButtons.vue";
import { getCategoryList } from "@/services/AF/afCategoryService";
import { getInAppTiers } from "@/services/AF/afInAppTiersService";
import { courseText, errors } from "@/dataObject/AF/afStaticTextsData.js";
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import { validateFileSize } from "@/utils/validationUtils.js";
import { MAX_FILE_SIZE } from "@/dataObject/AF/fileSizeData.js";
import AsyncVueSelect from "@/components/Misc/Filters/AsyncVueSelect.vue";

export default {
  name: "CourseCreateEdit",
  components: {
    GeneralCkEditor,
    FormActionButtons,
    AsyncVueSelect,
  },
  mixins: [toastMixin, validationMixin, dompurifyMixin],

  validations() {
    return {
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(50),
        isSanitizeInput: function (value) {
          return this.sanitizeWithBusinesslogic(value);
        },
      },
      selectedCategory: {
        required,
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(65535),
      },
      price: {
        required,
        decimal,
        shouldBe: (value) => value == 0 || (value >= 1 && value <= 5000),
      },
      tier: {
        required,
        integer,
      },
      numberOfLevels: {
        required,
        numeric,
        between: between(1, 100),
      },
      selectedFile: {
        isImage: (value) => {
          if (value == null && this.mode === "create") return false;
          if (value == null && this.mode === "edit") return true;
          return value.type == ("image/jpeg" || "image/jpg") ? true : false;
        },
        isFileValid: (value) => {
          if (value == null && this.imgPreview && this.mode === "edit")
            return true;
          return validateFileSize(value, MAX_FILE_SIZE.course);
        },
      },
      videoPreviewS3Link: {
        isSanitizeInput: function (value) {
          return this.sanitizePath(value);
        },
      },
    };
  },
  props: {
    course: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "create",
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
    isAllowAddDelete: { type: Boolean },
  },
  data() {
    return {
      hasInitialized: false,
      getCategoryList,
      tiers: [],
      name: null,
      selectedCategory: null,
      tier: null,
      description: null,
      price: null,
      numberOfLevels: null,
      selectedFile: null,
      imgPreview: null,
      videoPreviewS3Link: "",
      courseText,
      errors,
    };
  },
  watch: {
    description(description) {
      if (this.hasInitialized)
        this.$emit("on-change", "description", description);
    },
  },
  mounted() {
    if (this.mode == "edit") this.mapData();
    this.init();
  },
  methods: {
    async init() {
      this.hasInitialized = true;
      await this.getInAppTiers();
    },
    onUpdateField(field, value) {
      this.hasInitialized && this.$emit("on-change", field, value);
    },
    noteInput(text) {
      this.description = text;
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("category_id", this.selectedCategory.id);
      formData.append("description", this.description);
      formData.append("price", this.price);
      formData.append("tier_id", this.tier);
      formData.append("number_of_levels", this.numberOfLevels);
      this.selectedFile && formData.append("img", this.selectedFile);
      formData.append("video_preview", this.videoPreviewS3Link);

      this.$emit("on-save", formData);
    },
    mapData() {
      this.name = this.course.name;
      this.selectedCategory = {
        id: this.course?.category?.id,
        name: this.course?.category?.name,
      };
      this.tier = this.course.tier.id;
      this.description = this.course.description;
      this.price = this.course.price;
      this.numberOfLevels = this.course.course_levels_count;
      this.imgPreview = this.course.img;
      this.videoPreviewS3Link = this.course.video_preview
        ? this.course.video_preview
        : "";
    },
    storeFileTemp(e) {
      this.selectedFile = e.target.files[0];
      this.$v.selectedFile.$touch();
      if (this.$v.selectedFile.$invalid) return (this.imgPreview = null);
      this.$emit("on-change", "selectedFile", this.selectedFile);
      if (this.selectedFile) {
        this.imgPreview = URL.createObjectURL(this.selectedFile);
      }
    },
    startDeleting() {
      this.$emit("on-delete", this.course);
    },
    async getInAppTiers() {
      const response = await getInAppTiers();

      if (response.error) return this.$displayError(response);
      this.tiers = response;
    },
    handleCategorySelection(selectedCategory) {
      this.selectedCategory = selectedCategory;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

div.is-invalid {
  border: 1px solid $red;
}
</style>
