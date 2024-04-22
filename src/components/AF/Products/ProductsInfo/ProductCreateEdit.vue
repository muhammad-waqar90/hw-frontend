<template>
  <div class="h-100 bg-white py-4 px-4 rounded-card">
    <form @submit.prevent="onSubmit">
      <div class="row px-2">
        <div class="col-md-6 col-sm-12">
          <div class="mb-3">
            <label>Name (min:3, max:50):</label>
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
            <label>Select Product Category:</label>
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
          <div class="mb-3" v-if="showAuthor">
            <div>
              <label>Author Name (min:3, max:50):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.authorName.$model"
                  class="form-control w-100 bg-light"
                  :class="{ 'is-invalid': $v.authorName.$error }"
                  type="text"
                  placeholder="Author name"
                  @input="(e) => onUpdateField('authorName', e.target.value)"
                />
              </div>
            </div>
          </div>
          <div class="mb-3">
            <label>
              Amount(<b class="text-success">£</b>) (free:0,min:1,max:5000):
            </label>
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
            <label>Select Book Thumbnail (max:10MB, jpeg, jpg, png):</label>
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
                .jpeg, .jpg or .png format book thumbnail required
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
        @start-deleting="startDeleting"
      />
      <Modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete product
          <b>"{{ product?.name }}"</b>? <br />
        </div>
        <template slot="footer">
          <ConfirmationButtonsWithInput
            :name="product?.name"
            :placeholder="
              'Please type the product name for confirming the delete action e.g ' +
              product?.name
            "
            :is-submitting="submitting"
            loading-label="Deleting..."
            @on-confirm="deleteProduct"
          />
        </template>
      </Modal>
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
  decimal,
} from "vuelidate/lib/validators";
import AsyncVueSelect from "@/components/Misc/Filters/AsyncVueSelect.vue";
import FormActionButtons from "@/components/Misc/Forms/FormActionButtons.vue";
import { deleteProduct } from "@/services/AF/afProductService.js";
import { getCategoryList } from "@/services/AF/afCategoryService";
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";
import { validateFileSize } from "@/utils/validationUtils.js";
import { MAX_FILE_SIZE } from "@/dataObject/AF/fileSizeData.js";
import { errors } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  // TODO: component name should be; BookCreateEditFrom or ProductCreateEditFrom
  name: "BookCreateEdit",
  components: {
    GeneralCkEditor,
    AsyncVueSelect,
    FormActionButtons,
    Modal,
    ConfirmationButtonsWithInput,
  },
  mixins: [toastMixin, validationMixin, dompurifyMixin],

  validations() {
    return {
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
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
      ...(this.showAuthor
        ? {
            authorName: {
              required,
              minLength: minLength(3),
              maxLength: maxLength(50),
              isSanitizeInput: function (value) {
                return this.sanitizeInput(value);
              },
            },
          }
        : {}),
      price: {
        required,
        decimal,
        shouldBe: (value) => value == 0 || (value >= 1 && value <= 5000),
      },
      selectedFile: {
        isImage: (value) => {
          if (value == null && this.mode === "create") return false;
          if (value == null && this.mode === "edit") return true;
          return value.type == ("image/jpeg" || "image/jpg" || "image/png")
            ? true
            : false;
        },
        isFileValid: (value) => {
          if (value == null && this.imgPreview && this.mode === "edit")
            return true;
          return validateFileSize(value, MAX_FILE_SIZE.product);
        },
      },
    };
  },
  props: {
    product: {
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
      selectedCategory: null,
      name: "",
      description: null,
      price: null,
      selectedFile: null,
      imgPreview: null,
      metaEnabled: false,
      product_metas: [],
      authorName: null,
      metaKey: "author", // TODO: meta keys shouldn't be hardcoded
      modalMode: "",
      submitting: false, // TODO: typo isSubmitting
      isAvailable: 1,
      errors,
    };
  },
  computed: {
    showAuthor() {
      return this.selectedCategory;
    },
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
    },
    onUpdateField(field, value) {
      this.hasInitialized && this.$emit("on-change", field, value);
      this.metaEnabled = true;
    },
    noteInput(text) {
      this.description = text;
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      let formData = new FormData();
      formData.append("category_id", this.selectedCategory.id);
      formData.append("name", this.name);
      formData.append("description", this.description);
      // TODO: we have to make it sync/same for both create/edit request
      if (this.showAuthor) {
        if (this.mode == "edit") {
          formData.append("author", this.authorName);
        } else {
          formData.append(`product_metas[${this.metaKey}]`, this.authorName);
        }
      }
      this.selectedFile && formData.append("img", this.selectedFile);
      formData.append("price", this.price);
      if (this.mode == "edit") {
        formData.append("is_available", this.isAvailable);
      }
      this.$emit("on-save", formData);
    },
    mapData() {
      this.name = this.product.name;
      this.description = this.product.description;
      this.price = this.product.price;
      this.imgPreview = this.product.img;
      this.selectedCategory = {
        id: this.product?.category?.id,
        name: this.product?.category?.name,
      };
      if (this.product?.productMetas) {
        this.product?.productMetas.forEach((element) => {
          if (element?.meta_key === "author") {
            this.authorName = element?.meta_value;
          }
        });
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
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
    },
    startDeleting() {
      this.openModal("delete");
    },
    async deleteProduct() {
      this.submitting = true;
      const response = await deleteProduct(this.product?.id);
      this.submitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.closeModal();
      this.hasProductChanged = false;
      this.$router.push({ name: "af-products" });
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
