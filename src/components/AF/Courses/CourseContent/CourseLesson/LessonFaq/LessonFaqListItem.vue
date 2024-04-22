<template>
  <form @submit.prevent="onSubmit">
    <div class="row item color-gray" :class="{ 'sub-item': mode === 'edit' }">
      <div class="col-12 pt-3" :class="{ 'pb-3': mode === 'read' }">
        <span
          v-if="mode === 'read'"
          class="cursor-pointer"
          @click="toggleExpanded"
        >
          <ChevronRightIcon v-if="!expanded" :size="25" />
          <ChevronDownIcon v-else :size="25" />
        </span>
        <span v-if="mode === 'read'" class="item question" v-html="question" />
        <div v-else :class="{ 'is-invalid': $v.question.$error }">
          <GeneralCkEditor
            min-height="60px"
            placeholder="e.g algebra invented by?"
            :initial-text="question"
            @note-input="onChangeQuestion"
          />
        </div>
        <span
          v-if="mode === 'read' && !isCreatingEditingLessonFaq"
          class="cursor-pointer text-end"
        >
          <Pen :size="18" @click="onEdit" />
          <TrashCan :size="18" @click="onDelete" />
        </span>
      </div>
    </div>
    <div v-show="expanded" class="row sub-item">
      <div class="col-12 py-3">
        <span v-if="mode === 'read'" class="sub-item w-100" v-html="answer" />
        <div v-else :class="{ 'is-invalid': $v.answer.$error }">
          <GeneralCkEditor
            min-height="200px"
            placeholder="e.g Algebra invented by al-Khwārizmī, in full Muḥammad ibn Mūsā al-Khwārizmī"
            :initial-text="answer"
            @note-input="onChangeAnswer"
          />
        </div>
      </div>
    </div>
    <div v-show="expanded && mode === 'edit'" class="row sub-item mb-2 pb-2">
      <div class="col-6">
        <button type="button" class="btn btn-danger" @click="onDelete">
          Delete
        </button>
      </div>
      <div class="col-6 text-end">
        <button
          type="button"
          class="btn btn-outline-secondary"
          @click="onCancelEdit"
        >
          Cancel
        </button>
        <ButtonWithLoading class="btn blue-btn" :loading="isSubmitting">
          <slot>
            {{ isSubmitting ? "Updating..." : "Update" }}
          </slot>
        </ButtonWithLoading>
      </div>
    </div>
  </form>
</template>

<script>
import ChevronRightIcon from "vue-material-design-icons/ChevronRight";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";
import Pen from "vue-material-design-icons/Pen";
import TrashCan from "vue-material-design-icons/TrashCan";
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor.vue";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";

import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
import { mapGetters } from "vuex";

export default {
  name: "LessonFaqListItem",
  components: {
    ChevronRightIcon,
    ChevronDownIcon,
    Pen,
    TrashCan,
    GeneralCkEditor,
    ButtonWithLoading,
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
    item: { type: Object },
    isSubmitting: { type: Boolean },
  },
  data() {
    return {
      expanded: false,
      mode: "read",
      question: null,
      answer: null,
    };
  },
  computed: {
    ...mapGetters({
      isCreatingEditingLessonFaq: "course/getIsCreatingEditingLessonFaq",
    }),
  },
  mounted() {
    this.mapData();
  },
  methods: {
    mapData() {
      (this.question = this.item.question), (this.answer = this.item.answer);
    },
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    onEdit() {
      this.mode = "edit";
      this.expanded = true;
      this.$store.dispatch("course/setIsCreatingEditingLessonFaq", true);
    },
    onChangeQuestion(question) {
      this.question = question;
      this.$store.dispatch(
        "course/setHasEntityChanged",
        this.item.question !== this.question
      );
    },
    onChangeAnswer(answer) {
      this.answer = answer;
      this.$store.dispatch(
        "course/setHasEntityChanged",
        this.item.answer !== this.answer
      );
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      this.$emit("on-update", {
        id: this.item.id,
        lesson_id: this.item.lesson_id,
        question: this.question,
        answer: this.answer,
      });
    },
    onCancelEdit() {
      if (
        (this.item.question !== this.question ||
          this.item.answer !== this.answer) &&
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      )
        return;
      this.$store.dispatch("course/setHasEntityChanged", false);
      this.$store.dispatch("course/setIsCreatingEditingLessonFaq", false);

      this.mode = "read";
      this.expanded = false;
      this.mapData();
    },
    onDelete() {
      this.$emit("on-delete", this.item);
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
}
.sub-item {
  color: $darkgray;
  background-color: #f2f4fd !important;
  border-radius: 5px;
}
.question {
  display: inline-block;
  width: 89%;
}
.question :deep(p:first-child) {
  margin-bottom: 0px;
}
div.is-invalid {
  border: 1px solid red;
}
</style>
