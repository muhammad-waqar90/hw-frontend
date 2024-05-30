<template>
  <div class="container-fluid mt-4">
    <div class="row heading">
      <div :class="mode == 'read' ? 'col-7' : 'col-10'">Content</div>
      <div v-if="mode == 'read'" class="col-3">Last Updated</div>
      <div class="col-2 text-end">Actions</div>
    </div>
    <div class="row item py-4">
      <div :class="mode == 'read' ? 'col-7' : 'col-10'">
        <div>
          {{ ebook?.id && "#" + ebook.id + "-" }}
          Lecture E-Notes (min:5, max:250):
        </div>
        <div v-if="mode == 'read'" class="content">
          {{ ebook?.name }}
        </div>
        <div v-else-if="!isSubmitting" class="content">
          <input
            v-model.trim.lazy="$v.ebookS3Link.$model"
            type="text"
            placeholder="Lecture E-Notes S3 link"
            class="form-control"
            :class="{ 'is-invalid': $v.ebookS3Link.$error }"
            @input="(e) => onUpdateField()"
          />
        </div>
      </div>
      <div v-if="mode == 'read'" class="col-3 d-flex align-items-center">
        {{ dateFormat(ebook?.updated_at) }}
      </div>
      <div class="col-2 d-flex align-items-center">
        <div v-if="isSubmitting" class="text-end w-100 mt-3">
          <span
            class="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          />
        </div>
        <div
          v-else-if="mode == 'create' || mode == 'edit'"
          class="text-end w-100"
          :class="mode == 'create' || mode == 'edit' ? 'mt-3' : ''"
        >
          <span title="update e-notes" class="cursor-pointer">
            <Floppy title="view e-notes" :size="18" @click="onUpload" />
          </span>
          <span
            v-if="mode == 'edit'"
            title="cancel update"
            class="cursor-pointer"
          >
            <Close title="cancel update" :size="18" @click="onCancel" />
          </span>
        </div>
        <div v-else class="text-end w-100">
          <span v-if="$isEbookManager" class="cursor-pointer">
            <Pen :size="18" @click="onEdit" />
          </span>
          <span
            v-else
            class="cursor-not-allowed"
            :title="generalText.notPermitted"
          >
            <Pen :size="18" :title="generalText.notPermitted" />
          </span>
          <span title="view e-notes" class="cursor-pointer">
            <Eye title="view e-notes" :size="18" @click="onView" />
          </span>
          <span
            v-if="$isEbookManager && (isAllowDelete || isSubmitting)"
            class="cursor-pointer"
          >
            <TrashCan :size="18" @click="onDelete" />
          </span>
          <span
            v-else
            :title="
              $isEbookManager
                ? courseText.disableCreateDelete
                : generalText.notPermitted
            "
            class="cursor-not-allowed"
          >
            <TrashCan
              :title="
                $isEbookManager
                  ? courseText.disableCreateDelete
                  : generalText.notPermitted
              "
              :size="20"
            />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrashCan from "vue-material-design-icons/TrashCan";
import Eye from "vue-material-design-icons/Eye";
import Pen from "vue-material-design-icons/Pen";
import Floppy from "vue-material-design-icons/Floppy";
import Close from "vue-material-design-icons/CloseThick";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
import { courseText, generalText } from "@/dataObject/AF/afStaticTextsData";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import { validationMixin } from "vuelidate";
import { required, maxLength, minLength } from "vuelidate/lib/validators";
import { EBOOK_TYPES } from "@/dataObject/ebook/ebookData.js";

export default {
  name: "LessonEbookItem",
  components: {
    TrashCan,
    Eye,
    Pen,
    Floppy,
    Close,
  },
  mixins: [permissionsMixin, validationMixin, dompurifyMixin],
  props: {
    ebook: { type: Object, default: () => {} },
    isSubmitting: { type: Boolean, default: false },
    isAllowDelete: { type: Boolean, default: false },
  },
  watch: {
    ebook: {
      deep: true,
      handler() {
        this.ebookS3Link = this.ebook?.name;
        this.mode = this.ebook?.name ? "read" : "create";
      },
    },
  },
  data() {
    return {
      courseText,
      generalText,
      mode: this.ebook?.name ? "read" : "create",
      ebookS3Link: this.ebook?.name,
      EBOOK_TYPES,
    };
  },
  validations() {
    return {
      ebookS3Link: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(250),
        isSanitizeInput: function (value) {
          return this.sanitizePath(value);
        },
      },
    };
  },
  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
    onEdit() {
      this.mode = "edit";
      this.ebookS3Link = this.ebook?.name;
    },
    onUpdateField() {
      this.$store.dispatch("course/setHasEntityChanged", true);
    },
    onCancel() {
      this.mode = "read";
      this.$store.dispatch("course/setHasEntityChanged", false);
    },
    onView() {
      this.$emit("on-view");
    },
    onUpload() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.$v.$reset();

      this.$emit("on-upload", this.ebookS3Link);
      this.$store.dispatch("course/setHasEntityChanged", false);
    },
    onDelete() {
      this.$emit("on-start-deleting");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item {
  background-color: #dadde6;
  color: $darkgray;
  border-radius: 5px;
  border: 1px solid #8a8a8a;
}
.heading {
  color: #8a8a8a;
}
.content {
  color: #8a8a8a;
}
</style>
