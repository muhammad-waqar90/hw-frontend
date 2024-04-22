<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <div class="row my-2">
        <div class="col-md-6 col-sm-12">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label>Category Name (min:3, max:50):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.name.$model"
                  type="text"
                  class="form-control w-100"
                  placeholder="Enter category name"
                  :class="{ 'is-invalid': $v.name.$error }"
                  required
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Root Category:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.rootCategoryId.$model"
                  class="form-control"
                  :class="{ 'is-invalid': $v.rootCategoryId.$error }"
                  @change="onChangeRootCategory"
                >
                  <option
                    v-for="item in validRootCategoriesData"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>
            <div
              v-if="rootCategoryId && validParentCategoriesData"
              class="mb-3"
            >
              <label>Parent Category:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.parentCategoryId.$model"
                  class="form-control"
                  :class="{ 'is-invalid': $v.parentCategoryId.$error }"
                >
                  <option
                    v-for="item in validParentCategoriesData"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ parentCategoryTreeString(item) }}
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
                <button class="btn blue-btn" type="submit" :disabled="!isDirty">
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
import {
  getRootCategories,
  getChildCategoriesForRootCategory,
} from "@/services/AF/afCategoryService";
import { generateParentCategoryTree } from "@/utils/categoryUtils.js";
import {
  required,
  minLength,
  maxLength,
  requiredIf,
} from "vuelidate/lib/validators";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  name: "CategoryCreateEdit",

  mixins: [toastMixin, validationMixin, dompurifyMixin],
  props: {
    category: {
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
      name: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(50),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      rootCategoryId: {
        required: requiredIf(() => {
          return this.parentCategoryId;
        }),
      },
      parentCategoryId: {
        valid: (value) => {
          if (this.parentCategoriesData.length)
            return this.parentCategoriesData.some(
              (category) => category.id == value || value == ""
            );
          return true;
        },
      },
    };
  },

  data() {
    return {
      parentCategoriesData: [],
      rootCategoriesData: [],
      name: "",
      rootCategoryId: "",
      parentCategoryId: "",
      hasInitialized: false,
    };
  },

  computed: {
    validRootCategoriesData() {
      return this.rootCategoriesData.filter(
        (rootCategory) => rootCategory.id !== this.$route.params.id
      );
    },
    validParentCategoriesData() {
      return this.parentCategoriesData.filter(
        (category) => category.id !== this.$route.params.id
      );
    },
    isDirty() {
      return this.$v.$anyDirty;
    },
  },

  watch: {
    name(name) {
      this.$emit("on-change", "name", name);
    },
    rootCategoryId(rootCategoryId) {
      this.$emit("on-change", "root_category_id", rootCategoryId);
    },
    parentCategoryId(parentCategoryId) {
      this.$emit("on-change", "parent_category_id", parentCategoryId);
    },
  },

  async mounted() {
    await this.init();
    if (this.mode == "edit") this.mapData();
    this.hasInitialized = true;
  },

  methods: {
    async init() {
      let response = await getRootCategories();

      if (response.error) return this.$displayError(response);

      this.rootCategoriesData = [{ id: "", name: "None" }, ...response];
    },
    async getChildCategories(id) {
      if (!id) {
        this.parentCategoriesData = [];
        this.parentCategoryId = "";
        return;
      }

      let response = await getChildCategoriesForRootCategory(id);

      if (response.error) return this.$displayError(response);

      this.parentCategoriesData = [{ id: "", name: "None" }, ...response];
    },
    async onChangeRootCategory(e) {
      this.getChildCategories(e.target.value);
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      this.$emit("on-save", {
        name: this.name,
        root_category_id: this.rootCategoryId,
        parent_category_id:
          !this.parentCategoryId && this.rootCategoryId
            ? this.rootCategoryId
            : this.parentCategoryId,
      });
    },
    startDeleting() {
      this.$emit("on-delete", this.category);
    },
    mapData() {
      this.getChildCategories(this.category.root_category_id);

      this.name = this.category.name;
      this.rootCategoryId = this.category.root_category_id ?? "";
      this.parentCategoryId =
        this.category.parent_category_id == this.category.root_category_id
          ? ""
          : this.category.parent_category_id;
    },
    parentCategoryTreeString(data) {
      let categoriesHierarchy = generateParentCategoryTree(data).map(
        (category) => category.name
      );
      return categoriesHierarchy.length ? categoriesHierarchy.join("/") : "--";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
div.is-invalid {
  border: 1px solid $red;
}
.status {
  font-size: 18px;
}
input[type="file"] {
  padding: 4px;
}
</style>
