<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <form @submit.prevent="onSubmit">
        <div class="row my-2">
          <div class="col-md-6 col-sm-12">
            <div class="mb-3">
              <label>Title (min:5, max:50):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.title.$model"
                  type="text"
                  class="form-control w-100"
                  placeholder="Title"
                  :class="{ 'is-invalid': $v.title.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Type:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.type.$model"
                  class="form-select"
                  :class="{ 'is-invalid': $v.type.$error }"
                >
                  <option :value="null" disabled selected hidden>
                    Select type...
                  </option>
                  <option :value="GLOBAL.value">
                    {{ GLOBAL.name }}
                  </option>
                  <option :value="NATIONAL.value">
                    {{ NATIONAL.name }}
                  </option>
                </select>
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
              <label>Start Date (mm/dd/yyyy, hh:mm AM/PM):</label>
              <div class="position-relative">
                <input
                  type="datetime-local"
                  class="form-control"
                  :class="{ 'is-invalid': $v.startDate.$error }"
                  :value="startDate"
                  @input="startDate = $event.target.value"
                  @change="dateChanged = false"
                />
                <span class="badge badge-warning">
                  Note: Selected date considered as UTC date. Minimum selectable
                  UTC date: {{ minStartDate }}
                </span>
              </div>
            </div>
            <div class="mb-3">
              <label>End Date (mm/dd/yyyy, hh:mm AM/PM):</label>
              <div class="position-relative">
                <input
                  type="datetime-local"
                  class="form-control"
                  :class="{ 'is-invalid': $v.endDate.$error }"
                  :value="endDate"
                  @input="endDate = $event.target.value"
                  @change="dateChanged = false"
                />
                <span class="badge badge-warning">
                  Note: Selected date considered as UTC date. Selected date
                  should be the date after start date.
                </span>
              </div>
            </div>
            <div class="mb-3">
              <label>URL (min:10, max:2048):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.url.$model"
                  type="text"
                  class="form-control w-100"
                  placeholder="https://www.example.com"
                  :class="{ 'is-invalid': $v.url.$error }"
                />
              </div>
            </div>
            <InputImageWithPreview
              v-if="hasInitialized"
              :label="'Image (optional, max:10MB, jpeg, jpg, png, gif):'"
              :image-preview="imgPreview"
              :error="$v.image.$error"
              @on-image="handleImage"
            />
          </div>
          <div v-if="mode === 'create'" class="text-center mt-5 px-2">
            <button :disabled="!isDirty" class="btn blue-btn" type="submit">
              Create
            </button>
          </div>
          <div v-if="mode === 'edit'" class="row mt-5 px-2">
            <div class="col-6">
              <button
                class="btn btn-danger"
                type="button"
                @click="startDeleting"
              >
                Delete
              </button>
            </div>
            <div class="col-6 text-end">
              <button
                :disabled="shouldDisableButton"
                class="btn blue-btn"
                type="submit"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor";
import toastMixin from "@/mixins/toastMixin";
import { validationMixin } from "vuelidate";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import {
  required,
  minLength,
  maxLength,
  integer,
  url,
} from "vuelidate/lib/validators";
import { GLOBAL, NATIONAL } from "@/dataObject/event/eventData";
import InputImageWithPreview from "@/components/AF/InputImageWithPreview.vue";
import { validateFileSize } from "@/utils/validationUtils.js";
import { MAX_FILE_SIZE } from "@/dataObject/AF/fileSizeData.js";

export default {
  name: "EventCreateEdit",
  components: {
    GeneralCkEditor,
    InputImageWithPreview,
  },
  mixins: [toastMixin, validationMixin, dompurifyMixin],

  props: {
    event: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "create",
    },
  },

  validations() {
    return {
      title: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(50),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      type: {
        required,
        integer,
      },
      description: {
        required,
        minLength: minLength(10),
        maxLength: maxLength(65535),
      },
      url: {
        url,
        required,
        minLength: minLength(10),
        maxLength: maxLength(2048),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      image: {
        isImage: (value) => {
          if (value == null) return true;
          return ["image/jpeg", "image/jpg", "image/png", "image/gif"].some(
            (imageType) => (value && value.type == imageType ? true : false)
          );
        },
        isFileValid: (value) => {
          if (value == null) return true;
          return validateFileSize(value, MAX_FILE_SIZE.event);
        },
      },
      startDate: {
        required,
        minValue(val, { minStartDate }) {
          return new Date(val) > new Date(minStartDate);
        },
      },
      endDate: {
        required,
        minValue(val, { startDate, minStartDate }) {
          return (
            new Date(val) > new Date(startDate) &&
            new Date(val) > new Date(minStartDate)
          );
        },
      },
    };
  },

  data() {
    return {
      hasInitialized: false,
      title: null,
      type: null,
      description: null,
      image: null,
      url: null,
      startDate: null,
      endDate: null,
      imgPreview: null,
      minStartDate: null,
      GLOBAL,
      NATIONAL,
      dateChanged: true,
    };
  },

  computed: {
    isDirty() {
      return this.$v.$anyDirty;
    },
    shouldDisableButton() {
      return (
        this.event.description === this.description &&
        !this.isDirty &&
        this.dateChanged
      );
    },
  },

  watch: {
    title(title) {
      if (this.hasInitialized) this.$emit("on-change", "title", title);
    },
    type(type) {
      if (this.hasInitialized) this.$emit("on-change", "type", type);
    },
    description(description) {
      if (this.hasInitialized)
        this.$emit("on-change", "description", description);
    },
    image(image) {
      if (this.hasInitialized) this.$emit("on-change", "img", image);
    },
    url(url) {
      if (this.hasInitialized) this.$emit("on-change", "url", url);
    },
    startDate(startDate) {
      if (this.hasInitialized)
        this.$emit(
          "on-change",
          "start_date",
          this.formatDateForDateTimePicker(startDate, "T", " ") + ":00"
        );
    },
    endDate(endDate) {
      if (this.hasInitialized)
        this.$emit(
          "on-change",
          "end_date",
          this.formatDateForDateTimePicker(endDate, "T", " ") + ":00"
        );
    },
  },

  mounted() {
    if (this.mode == "edit") this.mapData();
    this.init();
  },

  methods: {
    async init() {
      this.hasInitialized = true;
      this.minStartDate = this.formatDateForDateTimePicker(
        new Date().toISOString(),
        "T",
        " "
      );
    },

    noteInput(text) {
      this.description = text;
    },

    onSubmit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      let formData = new FormData();
      formData.append("title", this.title);
      formData.append("type", this.type);
      formData.append("description", this.description);
      this.image && formData.append("img", this.image);
      formData.append("url", this.url);
      formData.append("start_date", this.startDate.replace(" ", "T"));
      formData.append("end_date", this.endDate.replace(" ", "T"));

      this.$emit("on-save", formData);
    },

    startDeleting() {
      this.$emit("on-delete", this.event);
    },

    handleImage(img) {
      this.image = img;
      this.$v.image.$touch();
      if (this.$v.image.$invalid) return (this.imgPreview = "");
    },

    mapData() {
      this.title = this.event.title;
      this.type = this.event.type;
      this.description = this.event.description;
      this.url = this.event.url;
      this.imgPreview = this.event.img;
      this.startDate = this.formatDateForDateTimePicker(
        this.event.start_date,
        " ",
        "T"
      );
      this.endDate = this.formatDateForDateTimePicker(
        this.event.end_date,
        " ",
        "T"
      );
    },

    formatDateForDateTimePicker(dateTime, replaceFrom, replaceTo) {
      let dateTimeArr = dateTime.split(":");
      return `${dateTimeArr[0]}:${dateTimeArr[1]}`.replace(
        replaceFrom,
        replaceTo
      );
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
