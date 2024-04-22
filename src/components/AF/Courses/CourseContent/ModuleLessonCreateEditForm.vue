<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label>Name (min:5, max:50):</label>
      <div class="position-relative">
        <input
          v-model.trim.lazy="$v.name.$model"
          type="text"
          placeholder="e.g Algebra"
          class="form-control"
          :class="{ 'is-invalid': $v.name.$error }"
          @input="(e) => onUpdateField('name', e.target.value)"
        />
      </div>
    </div>
    <div class="mb-3">
      <label>Description (min:10, max:5000):</label>
      <div class="position-relative">
        <textarea
          v-model.trim.lazy="$v.description.$model"
          placeholder="e.g Algebra is a branch of mathematics dealing with symbols and the rules for manipulating those symbols...."
          class="rounded py-2 form-control"
          :class="{ 'is-invalid': $v.description.$error }"
          rows="4"
          @input="(e) => onUpdateField('description', e.target.value)"
        />
      </div>
    </div>
    <div class="mb-3">
      <label
        >{{
          entity === "module"
            ? "Preview Video (Optional, max: 250)"
            : "Lecture Video (max: 250)"
        }}:</label
      >
      <div class="position-relative">
        <input
          v-model.trim.lazy="$v.videoS3Link.$model"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': $v.videoS3Link.$error }"
          placeholder="Video S3 link e.g algebra.mp4"
          @input="(e) => onUpdateField('videoS3Link', e.target.value)"
        />
      </div>
    </div>
    <div class="mb-3">
      <label class="text-capitalize"
        >Select {{ entity }} thumbnail (Optional):</label
      >
      <div v-if="imgPreview" class="position-relative pb-2">
        <img
          :src="imgPreview"
          class="rounded-card shadow-sm"
          style="width: 20%"
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

      <!-- Bind Book -->
      <div v-if="entity === 'module'" class="mb-3 mt-4">
        <label class="text-capitalize pe-2">
          Select a book for binding (Optional):
          <Information
            :size="17"
            title="In order to bind a book, please make sure module has atleast one lecture with lecture notes"
            class="cursor-pointer text-primary"
          />
        </label>
        <div class="position-relative">
          <AsyncVueSelect
            :label="'Books'"
            :select-custom-style-class="'bg-light'"
            :selected-item="selectedBook"
            :service="getUnboundedBooks"
            :disabled="!canBindBook"
            @on-change="handleBookSelectionOption"
          />
        </div>
      </div>
      <!-- End Bind Book -->
    </div>
    <div v-if="entity === 'module'" class="mb-3">
      <div class="mt-4">
        <div class="position-relative mini-section-heading">
          E-Notes Configuration
        </div>
        <label>
          E-Notes Collective Amount(£) (free:0, min:1, max:5000):
          <Information
            :size="17"
            title="Total amount of all e-notes associated with lectures of this module"
            class="cursor-pointer text-primary"
          />
        </label>
        <div class="position-relative">
          <input
            v-model.trim.lazy="$v.eBookPrice.$model"
            type="number"
            class="form-control"
            placeholder="e.g 70"
            step="0.01"
            :class="{ 'is-invalid': $v.eBookPrice.$error }"
            @input="(e) => onUpdateField('eBookPrice', e.target.value)"
          />
        </div>
      </div>
      <div class="mt-4">
        <div class="position-relative mini-section-heading">
          Exam Configuration
        </div>
        <div class="mb-3">
          <label class="text-capitalize pe-2">
            Does this module have an end of module exam?
          </label>
          <input
            v-model="moduleHasExam"
            type="checkbox"
            :disabled="!isAllowAddDelete"
            @input="(e) => onUpdateField('moduleHasExam', e.target.value)"
          />
          <Information
            v-if="!isAllowAddDelete"
            :size="17"
            :title="courseText.disableCreateDelete"
            class="cursor-pointer text-primary"
          />
          <br />
          <div v-if="moduleHasExam" class="text-muted alert alert-info">
            <b>Note: </b>
            <ul>
              <li>
                In order to upload the exam, please <b>EDIT</b> the module,
                select the <b>EXAM</b> tab and upload there
              </li>
              <li>
                This can be done at any time <b>BEFORE</b> the final lecture is
                published
              </li>
            </ul>
          </div>
          <div v-else class="alert alert-danger">
            <b>!! Alert !! </b> <br />
            Unchecking
            <b>Does this module have an end of module exam?</b> setting means:
            <br />
            <ul>
              <li>
                You <b>CONFIRM</b> that there is <b>NO</b> end of module exam
                for this course
              </li>
              <li>
                It is <b>NOT</b> possible to <b>REVERSE</b> this selection once
                the course has enrolled users
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div v-if="entity === 'lecture'" class="mb-3">
      <div class="mb-3">
        <label class="text-capitalize">Published:</label>
        <input
          v-model="lessonPublished"
          type="checkbox"
          :disabled="entityData.published === 1 && !isAllowAddDelete"
          @input="(e) => onUpdateField('published', e.target.value)"
        />
        <Information
          v-if="entityData.published === 1 && !isAllowAddDelete"
          :size="17"
          :title="courseText.disableCreateDelete"
          class="cursor-pointer text-primary"
        />
      </div>
      <div v-if="!lessonPublished">
        <label class="text-capitalize">Publish At:</label>
        <input
          v-model.trim.lazy="$v.lessonPublishAt.$model"
          type="date"
          class="form-control"
          :class="{ 'is-invalid': $v.lessonPublishAt.$error }"
          @input="(e) => onUpdateField('lessonPublishAt', e.target.value)"
        />
      </div>
    </div>
    <FormActionButtons
      :mode="mode"
      :is-submitting="isSubmitting"
      :disable-delete="!isAllowAddDelete"
      :disable-delete-message="courseText.disableCreateDelete"
      @start-deleting="$emit('on-start-deleting', true)"
    />
  </form>
</template>

<script>
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  decimal,
} from "vuelidate/lib/validators";
import AsyncVueSelect from "@/components/Misc/Filters/AsyncVueSelect.vue";
import FormActionButtons from "@/components/Misc/Forms/FormActionButtons.vue";
import { courseText, errors } from "@/dataObject/AF/afStaticTextsData";
import Information from "vue-material-design-icons/Information";
import { UTCtoLocalDateOnlyFormatted } from "@/utils/dateTimeUtils";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import { getUnboundedBooks } from "@/services/AF/afProductService";
import { validateFileSize } from "@/utils/validationUtils.js";
import { MAX_FILE_SIZE } from "@/dataObject/AF/fileSizeData.js";

export default {
  name: "ModuleLessonCreateEditForm",
  components: {
    AsyncVueSelect,
    FormActionButtons,
    Information,
  },
  mixins: [validationMixin, dompurifyMixin],
  validations() {
    return {
      name: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(50),
        isSanitizeInput: function (value) {
          return this.sanitizeWithBusinesslogic(value);
        },
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(5000),
        isSanitizeInput: function (value) {
          return this.sanitizeWithBusinesslogic(value);
        },
      },
      selectedFile: {
        isImage: (value) => {
          if (value == null) return true;
          return value.type == ("image/jpeg" || "image/jpg") ? true : false;
        },
        isFileValid: (value) => {
          if (value == null) return true;
          return validateFileSize(value, MAX_FILE_SIZE.moduleLesson);
        },
      },
      videoS3Link: {
        isRequired: (value) => {
          if ((value == "" || value == null) && this.entity === "lecture")
            return false;
          return true;
        },
        maxLength: maxLength(250),
        isSanitizeInput: function (value) {
          return this.sanitizePath(value);
        },
      },
      eBookPrice: {
        isRequired: (value) => {
          if ((value === "" || value === null) && this.entity === "module")
            return false;
          return true;
        },
        decimal,
        shouldBe: (value) => value == 0 || (value >= 1 && value <= 5000),
      },
      lessonPublishAt: {
        isRequired: (value) => {
          if (value == "" && this.entity === "lecture" && !this.lessonPublished)
            return false;
          return true;
        },
      },
    };
  },
  props: {
    entity: { type: String },
    mode: { type: String },
    isSubmitting: { type: Boolean },
    isAllowAddDelete: { type: Boolean },
    entityData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      hasInitialized: false,
      name: null,
      description: null,
      selectedFile: null,
      imgPreview: null,
      videoS3Link: "",
      eBookPrice: 0,
      lessonPublished: true,
      moduleHasExam: true,
      lessonPublishAt: "",
      courseText,
      getUnboundedBooks,
      selectedBook: null,
      errors,
    };
  },
  computed: {
    canBindBook() {
      return this.mode === "edit" && this.entityData.has_ebook;
    },
  },
  watch: {
    entityData() {
      if (this.mode == "edit") {
        this.mapData();
        this.$emit("on-start-deleting", false);
      }
    },
  },
  mounted() {
    if (this.mode == "edit") this.mapData();
    this.hasInitialized = true;
  },
  methods: {
    onUpdateField(field, value) {
      this.hasInitialized && this.$emit("on-change", field, value);
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      let formData = new FormData();
      formData.append("name", this.name);
      formData.append("description", this.description);
      this.selectedFile && formData.append("img", this.selectedFile);
      this.entity === "module"
        ? formData.append("video_preview", this.videoS3Link)
        : formData.append("video", this.videoS3Link);

      if (this.entity === "module") {
        formData.append("ebook_price", this.eBookPrice);
        formData.append("module_has_exam", this.moduleHasExam ? 1 : 0);
        formData.append(
          "book_id",
          this.selectedBook ? this.selectedBook.id : ""
        );
      }

      if (this.entity === "lecture") {
        formData.append("published", this.lessonPublished ? 1 : 0);
        !this.lessonPublished &&
          formData.append("publish_at", this.lessonPublishAt);
      }

      this.$emit("on-submit", formData);
    },
    mapData() {
      this.name = this.entityData.name;
      this.description = this.entityData.description;
      this.imgPreview = this.entityData.img;
      this.videoS3Link =
        this.entity === "module"
          ? this.entityData.video_preview
            ? this.entityData.video_preview
            : ""
          : this.entityData.video;
      this.eBookPrice =
        this.entity === "module" ? this.entityData.ebook_price : 0;
      ``;
      if (this.entity === "module") {
        this.moduleHasExam = this.entityData?.quiz?.length ? true : false;

        if (this.entityData.book.length > 0) {
          this.selectedBook = {
            id: this.entityData.book[0]?.id,
            name: this.entityData.book[0]?.name,
          };
        } else {
          this.selectedBook = null;
        }
      }
      if (this.entity === "lecture") {
        this.lessonPublished = this.entityData.published ? true : false;
        this.lessonPublishAt = !this.lessonPublished
          ? UTCtoLocalDateOnlyFormatted(this.entityData.publish_at)
              .split("/")
              .reverse()
              .join("-")
          : "";
      }
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
    handleBookSelectionOption(selectedBook) {
      this.selectedBook = selectedBook;
    },
  },
};
</script>
