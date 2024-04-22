<template>
  <div class="d-flex justify-content-between">
    <div class="w-100">
      <div class="row">
        <div class="col-12">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label>Name (min:4, max:100):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.name.$model"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="Name"
                  :class="{ 'is-invalid': $v.name.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Parent Category:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.category.$model"
                  class="form-control"
                >
                  <option
                    v-for="item in rootCategories"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>

            <div v-if="mode === 'create'" class="text-center mt-5 px-2">
              <button class="btn blue-btn" type="submit" :disabled="!isDirty">
                Create
              </button>
            </div>
            <div v-if="mode === 'edit'" class="row mt-5 px-2">
              <div class="col-4">
                <button
                  class="btn btn-danger"
                  type="button"
                  @click="startDeleting"
                >
                  Delete
                </button>
              </div>
              <div class="col-4 text-center">
                <button
                  v-if="faqCategory.published"
                  class="btn btn-success"
                  type="button"
                  @click="onItemUnpublish()"
                >
                  Published
                </button>
                <button
                  v-if="!faqCategory.published"
                  type="button"
                  class="btn btn-warning text-white"
                  @click="onItemPublish()"
                >
                  Unpublished
                </button>
              </div>
              <div class="col-4 text-end">
                <button class="btn blue-btn" type="submit" :disabled="!isDirty">
                  Save
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
import { getRootFaqCategoriesList } from "@/services/AF/afFaqService";
import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import {
  required,
  minLength,
  maxLength,
  integer,
} from "vuelidate/lib/validators";
import { filterById } from "@/utils/generalUtils";

export default {
  name: "FaqCategoriesCreateEdit",
  mixins: [toastMixin, validationMixin, dompurifyMixin],
  props: {
    faqCategory: {
      type: Object,
      default: () => {},
    },

    mode: {
      type: String,
      default: "create",
    },
  },

  validations: {
    name: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(100),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    category: {
      integer,
    },
  },

  data() {
    return {
      hasInitialized: false,
      rootCategories: [],
      name: "",
      category: null,
    };
  },

  computed: {
    faqCategoryData() {
      return this.faqCategory;
    },
    isDirty() {
      return this.$v.$anyDirty;
    },
  },

  watch: {
    name() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    category() {
      if (this.hasInitialized) this.$emit("on-change");
    },
  },

  mounted() {
    if (this.mode == "edit") this.mapData();
    this.init();
  },

  methods: {
    async init() {
      await this.getRootFaqCategories();
      this.hasInitialized = true;
    },

    onSubmit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      const data = {
        name: this.name,
        faq_category_id: this.category,
      };

      this.$emit("on-save", data);
    },

    startDeleting() {
      this.$emit("on-delete", this.faqCategoryData);
    },

    mapData() {
      this.name = this.faqCategoryData.name;
      this.category = this.faqCategoryData.faq_category_id;
    },

    async getRootFaqCategories() {
      const response = await getRootFaqCategoriesList();

      if (response.error) return this.$displayServerResponse(response);

      this.rootCategories = [{ id: null, name: "None" }, ...response];

      if (this.mode === "edit") {
        this.rootCategories = [
          { id: null, name: "None" },
          ...filterById(response, this.faqCategoryData.id),
        ];
      }

      if (this.rootCategories.length && this.mode === "create") {
        this.category = null;
      }
    },
    onItemPublish() {
      this.$emit("on-item-publish");
    },
    onItemUnpublish() {
      this.$emit("on-item-unpublish");
    },
  },
};
</script>

<style lang="scss" scoped>
div.is-invalid {
  border: 1px solid #dc3545;
}
</style>
