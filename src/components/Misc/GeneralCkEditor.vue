<template>
  <span>
    <ckeditor
      v-model="text"
      class="ck-editor"
      :editor="editor"
      :config="config"
      :disabled="isDisabled"
      @input="onInput"
    />
  </span>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default {
  name: "NotesEditor",

  components: {
    ckeditor: CKEditor.component,
  },

  props: {
    initialText: {
      type: String,
      default: "",
    },
    isDisabled: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: "",
    },
    minHeight: {
      type: String,
      default: "400px",
    },
  },

  data() {
    return {
      editor: ClassicEditor,
      text: "",
      config: {
        toolbar: {
          items: [
            "heading",
            "|",
            "bold",
            "italic",
            "link",
            "|",
            "bulletedList",
            "numberedList",
            "|",
            "insertTable",
            "blockQuote",
            "|",
            "undo",
            "redo",
          ],
        },
        placeholder: "",
      },
    };
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.text = this.initialText;
      this.config.placeholder = this.placeholder;
    },
    onInput(text) {
      this.$emit("note-input", text);
      // await createLessonNoteService(this.moduleId, this.lessonId, { text })
    },
  },
};
</script>

<style lang="scss">
.ck-editor__editable {
  max-height: 400px;
  min-height: v-bind(minHeight);
}
</style>
