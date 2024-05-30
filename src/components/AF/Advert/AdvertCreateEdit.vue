<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <div class="row my-2">
        <div class="col-md-6 col-sm-12">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label>Name (min:3, max:20):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.name.$model"
                  type="text"
                  class="form-control w-100"
                  placeholder="Enter name"
                  :class="{ 'is-invalid': $v.name.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <div class="position-relative">
                <InputImageWithPreview
                  v-if="hasInitialized"
                  :label="'Image (max:2MB, jpeg, jpg, png, gif, image ratio should be 1:1):'"
                  :image-preview="imgPreview"
                  :error="$v.image.$error"
                  @on-image="handleImage"
                />
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
            <div class="mb-3">
              <label>Expiry Date:</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.expires_at.$model"
                  type="date"
                  class="form-control"
                  :class="{ 'is-invalid': $v.expires_at.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="me-2">Status:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.status.$model"
                  class="form-control"
                  :class="{ 'is-invalid': $v.status.$error }"
                >
                  <option :value="null" disabled selected hidden>
                    Select status...
                  </option>
                  <option
                    v-for="(item, index) in statusData"
                    :key="index"
                    :value="item.value"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>
            <FormActionButtons
              :mode="mode"
              :is-submitting="loading"
              @start-deleting="startDeleting"
            />
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import FormActionButtons from "@/components/Misc/Forms/FormActionButtons.vue";

import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";
import {
  ACTIVE as ACTIVE_STATUS,
  INACTIVE as INACTIVE_STATUS,
  EXPIRY_DAYS,
} from "@/dataObject/advert/advertData.js";
import InputImageWithPreview from "@/components/AF/InputImageWithPreview.vue";
import { required, minLength, maxLength, url } from "vuelidate/lib/validators";
import { add, format } from "date-fns";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import {
  validateFileAspectRatio,
  validateFileSize,
} from "@/utils/validationUtils.js";
import { MAX_FILE_SIZE } from "@/dataObject/AF/fileSizeData.js";

export default {
  name: "AdvertCreateEdit",

  components: {
    InputImageWithPreview,
    FormActionButtons,
  },

  mixins: [toastMixin, validationMixin, dompurifyMixin],
  props: {
    advert: {
      type: Object,
      default: () => {},
    },
    mode: {
      type: String,
      default: "create",
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  validations() {
    return {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(20),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
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
          if (this.mode === "create")
            return ["image/jpeg", "image/jpg", "image/png", "image/gif"].some(
              (imageType) => (value && value.type == imageType ? true : false)
            );
          return true;
        },
        isFileValid: (value) => {
          if (value == "" && this.imgPreview && this.mode === "edit")
            return true;
          return validateFileSize(value, MAX_FILE_SIZE.advert);
        },
        isAspectRatioValid: (value) => {
          if (value == "" && this.mode === "create") return false;
          if (value == "" && this.imgPreview && this.mode === "edit")
            return true;
          return (
            value != "" &&
            validateFileAspectRatio(value).then((result) => {
              return !!result.isValidDimensions;
            })
          );
        },
      },
      status: {
        required,
        isValid: (value) => {
          return [ACTIVE_STATUS.value, INACTIVE_STATUS.value].some((status) =>
            value === status ? true : false
          );
        },
      },
      expires_at: {
        required,
      },
    };
  },

  data() {
    return {
      hasInitialized: false,
      name: "",
      url: "",
      image: "",
      expires_at:
        this.mode === "create"
          ? format(add(new Date(), { days: EXPIRY_DAYS }), "yyyy-MM-dd")
          : "",
      status: null,
      statusData: [],
      imgPreview: null,
    };
  },

  watch: {
    name(name) {
      this.$emit("on-change", "name", name);
    },
    url(url) {
      this.$emit("on-change", "url", url);
    },
    image(image) {
      this.$emit("on-change", "image", image);
    },
    expires_at(expiresAt) {
      this.$emit("on-change", "expires_at", expiresAt + " 00:00:00");
    },
    status(status) {
      this.$emit("on-change", "status", status);
    },
  },

  mounted() {
    if (this.mode == "edit") this.mapData();
    this.init();
  },

  methods: {
    init() {
      this.hasInitialized = true;
      this.statusData.push(ACTIVE_STATUS, INACTIVE_STATUS);
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      let formData = new FormData();
      formData.append("img", this.image);
      formData.append("name", this.name);
      formData.append("expires_at", this.expires_at);
      formData.append("status", this.status);
      formData.append("url", this.url);

      this.$emit("on-save", formData);
    },
    startDeleting() {
      this.$emit("on-delete");
    },
    handleImage(img) {
      this.image = img;
      this.$v.image.$touch();
      if (this.$v.image.$invalid) return (this.imgPreview = "");
    },
    mapData() {
      this.name = this.advert.name;
      this.url = this.advert.url;
      this.status = this.advert.status;
      this.expires_at = this.advert.expires_at.split(" ")[0];
      this.imgPreview = this.advert.img;
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
input[type="file"] {
  padding: 4px;
}
</style>
