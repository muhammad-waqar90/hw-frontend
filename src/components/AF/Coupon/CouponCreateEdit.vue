<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <form @submit.prevent="onSubmit">
        <div class="row my-2">
          <div class="col-md-6 col-sm-12">
            <div class="mb-3">
              <label>Name (min:4, max:50):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.name.$model"
                  type="text"
                  class="form-control w-100"
                  placeholder="Coupon name or label"
                  :class="{ 'is-invalid': $v.name.$error }"
                  @input="(e) => onUpdateField('name', e.target.value)"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Code (min:6, max:20):</label>
              <div class="position-relative">
                <input
                  :disabled="disabledEditing"
                  v-model.trim.lazy="$v.code.$model"
                  type="text"
                  class="form-control w-100"
                  placeholder="Code"
                  :class="{ 'is-invalid': $v.code.$error }"
                  @input="(e) => onUpdateField('code', e.target.value)"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Discount (min:1, max:100):</label>
              <!-- TO DO: When there'll be Flat percentage then will add 5000 limit -->
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.value.$model"
                  :disabled="disabledEditing"
                  type="text"
                  class="form-control w-100"
                  placeholder="Value"
                  :class="{ 'is-invalid': $v.value.$error }"
                  @input="(e) => onUpdateField('value', e.target.value)"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Discount Type:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.value_type.$model"
                  :disabled="disabledEditing"
                  class="form-select"
                  :class="{ 'is-invalid': $v.value_type.$error }"
                  @input="(e) => onUpdateField('value_type', e.target.value)"
                >
                  <option :value="null" disabled selected hidden>
                    Select discount type...
                  </option>
                  <option :value="PERCENTAGE.value">
                    {{ PERCENTAGE.name }}
                  </option>
                  <!-- TO DO: Flat percentage type -->
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label>Description:</label>
              <div :class="{ 'is-invalid': $v.description.$error }">
                <GeneralCkEditor
                  v-if="hasInitialized"
                  min-height="200px"
                  :initial-text="description"
                  @note-input="noteInput"
                />
              </div>
            </div>
          </div>
          <div class="col-md-6 col-sm-12">
            <span>
              Coupon Restrictions: (coupon will be valid according to these
              restrictions)
            </span>
            <div class="row me-2 mb-3">
              <div class="col-md-12 col-sm-12 restrictions">
                <div class="mb-3">
                  <label>Category:</label>
                  <div class="position-relative">
                    <select
                      v-model.trim.lazy="$v.category.$model"
                      :disabled="disabledEditing"
                      class="form-select bg-light"
                      :class="{ 'is-invalid': $v.category.$error }"
                      @input="(e) => onUpdateField('category', e.target.value)"
                    >
                      <option :value="null" disabled selected hidden>
                        Select category...
                      </option>
                      <option
                        v-for="item in [{ type: 'course', label: 'Course' }]"
                        :key="item.type"
                        :value="item.type"
                      >
                        {{ item.label }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="mb-3" v-if="category">
                  <label>Select {{ category }}:</label>
                  <div class="position-relative">
                    <AsyncVueSelect
                      :label="category"
                      :select-custom-style-class="'bg-light'"
                      :disabled="disabledEditing"
                      :selected-item="selectedCourse"
                      :service="getCoursesForFilter"
                      @on-change="handleCourseSelectionOption"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-md-12 col-sm-12">
                <div class="mb-3">
                  <label>Redeem Limit (min:1, max:16777215):</label>
                  <div class="position-relative">
                    <input
                      v-model.trim.lazy="$v.redeem_limit.$model"
                      type="number"
                      class="form-control w-100"
                      placeholder="Coupon total redeem limit"
                      :class="{ 'is-invalid': $v.redeem_limit.$error }"
                      @input="
                        (e) => onUpdateField('redeem_limit', e.target.value)
                      "
                    />
                  </div>
                </div>
                <div class="mb-3">
                  <label>Status:</label>
                  <div class="position-relative">
                    <select
                      v-model.trim.lazy="$v.status.$model"
                      class="form-select"
                      :class="{ 'is-invalid': $v.status.$error }"
                      @input="(e) => onUpdateField('status', e.target.value)"
                    >
                      <option :value="null" disabled selected hidden>
                        Select status...
                      </option>
                      <option :value="ACTIVE.value">
                        {{ ACTIVE.name }}
                      </option>
                      <option :value="INACTIVE.value">
                        {{ INACTIVE.name }}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <FormActionButtons
          :mode="mode"
          :is-submitting="isSubmitting"
          :disable-delete="disabledEditing"
          :disable-delete-message="'Cannot delete coupon'"
        />
      </form>
    </div>
  </div>
</template>

<script>
import AsyncVueSelect from "@/components/Misc/Filters/AsyncVueSelect.vue";
import FormActionButtons from "@/components/Misc/Forms/FormActionButtons.vue";
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor";
import toastMixin from "@/mixins/toastMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  integer,
  numeric,
  minValue,
  maxValue,
  decimal,
} from "vuelidate/lib/validators";
import { PERCENTAGE, INACTIVE, ACTIVE } from "@/dataObject/discountTypeData.js";

import { getCoursesForFilter } from "@/services/AF/afCourseService";

export default {
  name: "CouponCreateEdit",
  components: {
    AsyncVueSelect,
    FormActionButtons,
    GeneralCkEditor,
  },
  mixins: [toastMixin, validationMixin, dompurifyMixin],
  props: {
    coupon: {
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
  },
  validations() {
    return {
      name: {
        required,
        minLength: minLength(4),
        maxLength: maxLength(50),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      code: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      value: {
        required,
        decimal,
        shouldBe: (value) => value >= 1 && value <= 100,
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      value_type: {
        // TODO: required to add validation for accepting only listed item same as RULE in laravel request
        required,
        integer,
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      description: {
        minLength: minLength(4),
        maxLength: maxLength(250),
      },
      category: {
        // TODO: required to add validation for accepting only listed item same as RULE in laravel request
        required,
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      redeem_limit: {
        integer,
        numeric,
        minValue: minValue(1),
        maxValue: maxValue(16777215),
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
      status: {
        // TODO: required to add validation for accepting only listed item same as RULE in laravel request
        required,
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
    };
  },
  data() {
    return {
      hasInitialized: false,
      disabledEditing: false,
      name: null,
      code: null,
      value: null,
      value_type: null,
      description: null,
      redeem_limit: null,
      redeem_limit_per_user: 16777215, // max redeem limit
      individual_use: 0,
      status: null,
      category: null,
      restrictions: [],
      selectedCourse: null,
      getCoursesForFilter,
      PERCENTAGE,
      ACTIVE,
      INACTIVE,
    };
  },
  computed: {},
  watch: {
    description(description) {
      if (this.hasInitialized)
        this.$emit("on-change", "description", description);
    },
  },
  mounted() {
    if (this.mode == "edit") {
      this.mapData();
      this.disabledEditing = true;
    }
    this.init();
  },
  methods: {
    async init() {
      this.hasInitialized = true;
    },

    onUpdateField(field, value) {
      this.hasInitialized && this.$emit("on-change", field, value);
    },

    noteInput(text) {
      this.description = text;
    },

    handleCourseSelectionOption(selectedCourse) {
      this.selectedCourse = selectedCourse;
    },

    prepareRestrictions() {
      // TODO: required for all entites later
      // TODO: implemented for only one course
      if (this.selectedCourse?.id) {
        return [
          {
            type: this.category,
            id: [this.selectedCourse?.id],
          },
        ];
      }
    },

    onSubmit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      this.restrictions = this.prepareRestrictions();

      const data = {
        name: this.name,
        description: this.description,
        code: this.code,
        value: this.value,
        value_type: this.value_type,
        status: this.status,
        redeem_limit: this.redeem_limit,
        redeem_limit_per_user: this.redeem_limit, // this.redeem_limit_per_user,
        individual_use: this.individual_use,
        restrictions: this.restrictions,
      };

      this.$emit("on-save", data);
    },

    mapData() {
      this.name = this.coupon.name;
      this.description = this.coupon.description;
      this.code = this.coupon.code;
      this.value = this.coupon.value;
      this.value_type = this.coupon.value_type;
      this.status = this.coupon.status;
      this.redeem_limit = this.coupon.redeem_limit;
      this.redeem_limit_per_user = this.coupon.redeem_limit; // this.redeem_limit_per_user;
      this.individual_use = this.coupon.individual_use;
      this.category = this.coupon.restrictions?.[0]?.entity_type; // TODO: handle for one course limit for now as per requiremtn.
      this.selectedCourse = {
        id: this.coupon.restrictions?.[0]?.entity_id,
        name: this.coupon.restrictions?.[0]?.entity?.name,
      };
      this.restrictions = this.coupon.restrictions;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

div.is-invalid {
  border: 1px solid $red;
}
.restrictions {
  margin-left: 10px;
  background-color: $white;
  padding: 1rem 1.5rem 1.25rem 1.5rem;
  border: 1px solid #ced4da;
  border-radius: 10px;
}
input[disabled] {
  cursor: not-allowed;
}

select[disabled] {
  cursor: not-allowed;
}
</style>
