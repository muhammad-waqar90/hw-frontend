<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <div class="row my-2">
        <div class="col-md-6 col-sm-12">
          <form @submit.prevent="onSubmit">
            <div v-if="mode == 'edit'" class="mb-3">
              <div class="position-relative">
                <label>Status:</label>
                <span v-if="isArchived" class="status text-warning"
                  >Archived</span
                >
                <span v-else class="status text-success">Active</span>
              </div>
            </div>
            <div class="mb-3">
              <label>Title (min:5, max:50):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.title.$model"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="Enter title"
                  :class="{ 'is-invalid': $v.title.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Short Description (min:5, max:100):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.description.$model"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="Enter description for your global notification"
                  :class="{ 'is-invalid': $v.description.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Content:</label>
              <div :class="{ 'is-invalid': $v.body.$error }">
                <GeneralCkEditor
                  v-if="hasInitialized"
                  :initial-text="body"
                  @note-input="noteInput"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Archive Date:</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.archiveAt.$model"
                  required
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': $v.archiveAt.$error }"
                />
              </div>
            </div>

            <div class="mb-3">
              <div
                class="d-inline-block p-1 rounded"
                :class="{ 'is-invalid': $v.showModal.$error }"
              >
                <label class="me-2">Show Modal:</label>
                <input
                  v-model.trim.lazy="$v.showModal.$model"
                  class="me-4"
                  type="checkbox"
                  name="show-modal"
                  :style="{ height: '16px', width: '16px' }"
                />
              </div>
            </div>

            <div v-if="mode === 'create'" class="text-center mt-5 px-2">
              <button class="btn blue-btn" type="submit" :disabled="!isDirty">
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
                  class="btn blue-btn"
                  type="submit"
                  :disabled="globalNotification.body == body && !isDirty"
                >
                  Update
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { ARCHIVE_DAYS } from "@/dataObject/globalNotifications/archiveStatusData.js";
import { add, format } from "date-fns";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  name: "GlobalNotificationCreateEdit",
  components: {
    GeneralCkEditor,
  },
  mixins: [toastMixin, validationMixin, dompurifyMixin],
  props: {
    globalNotification: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "create",
    },
  },

  validations: {
    title: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(50),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    description: {
      required,
      minLength: minLength(5),
      maxLength: maxLength(100),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    body: {
      required,
      minLength: minLength(10),
      maxLength: maxLength(65000),
    },
    archiveAt: {
      required,
    },
    showModal: {
      isValid: (selectedOption) => {
        return [true, false].some((value) =>
          selectedOption === value ? true : false
        );
      },
    },
  },

  data() {
    return {
      hasInitialized: false,
      title: null,
      description: null,
      body: null,
      archiveAt:
        this.mode === "create"
          ? format(add(new Date(), { days: ARCHIVE_DAYS }), "yyyy-MM-dd")
          : null,
      isArchived: null,
      showModal: false,
      showModalData: [],
    };
  },

  computed: {
    isDirty() {
      return this.$v.$anyDirty;
    },
  },

  watch: {
    title(title) {
      this.$emit("on-change", "title", title);
    },
    description(description) {
      this.$emit("on-change", "description", description);
    },
    body(body) {
      this.$emit("on-change", "body", body);
    },
    archiveAt(archiveAt) {
      this.$emit("on-change", "archive_at", archiveAt + " 00:00:00");
    },
    showModal(showModal) {
      this.$emit("on-change", "show_modal", showModal);
    },
  },

  mounted() {
    if (this.mode == "edit") this.mapData();
    this.init();
  },

  methods: {
    async init() {
      this.hasInitialized = true;
    },
    noteInput(text) {
      this.body = text;
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      const data = {
        title: this.title,
        short_description: this.description,
        description: this.body,
        archive_at: this.archiveAt,
        show_modal: this.showModal ? 1 : 0,
      };

      this.$emit("on-save", data);
    },
    startDeleting() {
      this.$emit("on-delete", this.globalNotification);
    },
    mapData() {
      this.title = this.globalNotification.title;
      this.description = this.globalNotification.description;
      this.body = this.globalNotification.body;
      this.archiveAt = this.globalNotification.archive_at.split(" ")[0];
      this.isArchived = this.globalNotification.is_archived;
      this.showModal = this.globalNotification.show_modal ? true : false;
    },
  },
};
</script>

<style lang="scss" scoped>
div.is-invalid {
  border: 1px solid #dc3545;
}
.status {
  font-size: 18px;
}
</style>
