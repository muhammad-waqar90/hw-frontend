<template>
  <div class="px-5 py-3 bg-light w-100 d-flex justify-content-center w-100">
    <input
      v-model.trim="input"
      type="text"
      :placeholder="placeholder"
      class="form-control w-80 bg-light me-3"
      :class="{ 'is-invalid': $v.input.$error }"
    />
    <button
      v-if="!isSubmitting"
      class="btn blue-btn"
      type="submit"
      :disabled="!canSubmit"
      @click="onConfirm"
    >
      {{ modalText.confirm }}
    </button>
    <button v-if="isSubmitting" class="btn blue-btn" type="button" disabled>
      <span
        v-if="isSubmitting"
        class="spinner-border spinner-border-sm"
        role="status"
        aria-hidden="true"
      />
      {{ loadingLabel }}
    </button>
  </div>
</template>

<script>
import { modalText } from "@/dataObject/AF/afStaticTextsData.js";
import { validationMixin } from "vuelidate";
import dompurifyMixin from "@/mixins/dompurifyMixin";
export default {
  props: {
    name: { type: String },
    placeholder: { type: String },
    isSubmitting: { type: Boolean, default: false },
    loadingLabel: { type: String, default: "" },
    isValidated: { type: Boolean, default: true },
    validationMethod: { type: Function, default: null },
  },
  mixins: [validationMixin, dompurifyMixin],
  validations() {
    return {
      input: {
        isSanitizeInput: function (value) {
          return this.sanitizeInput(value);
        },
      },
    };
  },
  data() {
    return {
      input: null,
      canSubmit: false,
      modalText,
    };
  },
  mounted() {
    this.init();
  },
  watch: {
    input(value) {
      this.validationMethod
        ? this.validationMethod(value)
        : (this.canSubmit = value === this.name || false);
    },
    isValidated() {
      this.canSubmit = this.isValidated;
    },
  },
  methods: {
    onConfirm() {
      this.$v.$touch();
      if (this.$v.$invalid) return;
      this.validationMethod
        ? this.$emit("on-confirm", this.input)
        : this.$emit("on-confirm");
    },
    init() {
      this.input = this.validationMethod ? this.name : null;
      this.canSubmit = this.validationMethod ? true : false;
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

div.is-invalid {
  border: 1px solid $red;
}
.w-80 {
  width: 80% !important;
}
</style>
