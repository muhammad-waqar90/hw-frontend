<template>
  <form @submit.prevent="onSubmit">
    <div class="mb-3">
      <label>Question:</label>
      <div
        class="position-relative"
        :class="{ 'is-invalid': $v.question.$error }"
      >
        <GeneralCkEditor
          min-height="60px"
          placeholder="e.g Algebra invented by?"
          @note-input="onChangeQuestion"
        />
      </div>
    </div>
    <div>
      <label>Answer:</label>
      <div
        class="position-relative"
        :class="{ 'is-invalid': $v.answer.$error }"
      >
        <GeneralCkEditor
          min-height="200px"
          placeholder="e.g Algebra invented by al-Khwārizmī, in full Muḥammad ibn Mūsā al-Khwārizmī"
          @note-input="onChangeAnswer"
        />
      </div>
    </div>
    <FormActionButtons :mode="mode" :is-submitting="isSubmitting" />
  </form>
</template>

<script>
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor.vue";
import FormActionButtons from "@/components/Misc/Forms/FormActionButtons.vue";

export default {
  name: "LessonFaqCreateEditForm",
  components: {
    GeneralCkEditor,
    FormActionButtons,
  },
  mixins: [validationMixin],
  validations() {
    return {
      question: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(5000),
      },
      answer: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10000),
      },
    };
  },
  props: {
    mode: { type: String, default: "create" },
    isSubmitting: { type: Boolean, default: false },
  },
  data() {
    return {
      hasInitialized: false,
      question: null,
      answer: null,
    };
  },
  methods: {
    onChangeQuestion(question) {
      this.question = question;
      this.onChangeAlert();
    },
    onChangeAnswer(answer) {
      this.answer = answer;
      this.onChangeAlert();
    },
    onChangeAlert() {
      this.$store.dispatch("course/setHasEntityChanged", true);
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.$emit("on-submit", {
        question: this.question,
        answer: this.answer,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
div.is-invalid {
  border: 1px solid red;
}
</style>
