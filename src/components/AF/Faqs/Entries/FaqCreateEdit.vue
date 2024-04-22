<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <div class="row my-2">
        <div class="col-md-6 col-sm-12">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label>Question (min:4, max:255):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.question.$model"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="Question"
                  :class="{ 'is-invalid': $v.question.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Subcategory:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.category.$model"
                  class="form-select"
                  required
                  :class="{ 'is-invalid': $v.category.$error }"
                >
                  <option :value="null" disabled selected hidden>
                    Select subcategory...
                  </option>
                  <option
                    v-for="item in subCategories"
                    :key="item.id"
                    :value="item.id"
                  >
                    {{ item.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label>Short Answer (min:4, max:255):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.short_answer.$model"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="Short answer"
                  :class="{ 'is-invalid': $v.short_answer.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Answer:</label>
              <div :class="{ 'is-invalid': $v.answer.$error }">
                <GeneralCkEditor
                  v-if="hasInitialized"
                  :initial-text="answer"
                  @note-input="noteInput"
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
                  :disabled="faqCategoryData.answer == answer && !isDirty"
                >
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
import { getFaqSubCategoriesList } from "@/services/AF/afFaqService";
import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";

import GeneralCkEditor from "@/components/Misc/GeneralCkEditor";

import {
  required,
  minLength,
  maxLength,
  integer,
} from "vuelidate/lib/validators";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  name: "FaqCategoriesCreateEdit",
  components: {
    GeneralCkEditor,
  },
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
    question: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(255),
      isSanitizeInput: function (value) {
        return this.sanitizeWithBusinesslogic(value);
      },
    },
    category: {
      required,
      integer,
    },
    short_answer: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(255),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    answer: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(10000),
    },
  },

  data() {
    return {
      hasInitialized: false,
      subCategories: [],
      question: null,
      category: null,
      short_answer: null,
      answer: null,
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
    question() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    category() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    short_answer() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    answer() {
      if (this.hasInitialized) this.$emit("on-change");
    },
  },

  mounted() {
    if (this.mode == "edit") this.mapData();
    this.init();
  },

  methods: {
    async init() {
      await this.getFaqSubCategories();
      this.hasInitialized = true;
    },

    noteInput(text) {
      this.answer = text;
    },

    onSubmit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      const data = {
        question: this.question,
        faq_category_id: this.category,
        short_answer: this.short_answer,
        answer: this.answer,
      };

      this.$emit("on-save", data);
    },

    startDeleting() {
      this.$emit("on-delete", this.faqCategoryData);
    },

    mapData() {
      this.question = this.faqCategoryData.question;
      this.category = this.faqCategoryData.faq_category_id;
      this.short_answer = this.faqCategoryData.short_answer;
      this.answer = this.faqCategoryData.answer;
    },

    async getFaqSubCategories() {
      const response = await getFaqSubCategoriesList();

      if (response.error) return this.$displayServerResponse(response);

      this.subCategories = response;

      if (this.subCategories.length && this.mode === "create") {
        this.category = null;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="checkbox"] {
  transform: scale(1.5);
}

div.is-invalid {
  border: 1px solid #dc3545;
}
</style>
