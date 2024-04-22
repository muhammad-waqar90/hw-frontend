<template>
  <div :class="getOuterClass">
    <ckeditor
      v-model="text"
      class="ck-editor"
      :editor="editor"
      :config="config"
      @input="onInput"
    />
  </div>
</template>

<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

import * as availableModes from "@/dataObject/notepad/notepadModesData";

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
    height: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      editor: ClassicEditor,
      text: "",
      config: {
        placeholder: "",
      },
      availableModes,
    };
  },
  computed: {
    getOuterClass() {
      if (this.height === this.availableModes.FULL_HEIGHT)
        return "h-100 full-height";
      if (this.height === this.availableModes.FIXED_MIN_HEIGHT_SMALL)
        return "fixed-min-height--small";

      return "";
    },
  },

  created() {
    this.init();
  },

  methods: {
    init() {
      this.text = this.initialText;
    },
    onInput(text) {
      this.$emit("note-input", text);
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/_variables.scss";

.full-height {
  .ck-editor {
    height: 100%;
    .ck-editor__main {
      height: 100%;
      .ck-editor__editable {
        min-height: calc(100% - 90px);
        max-height: calc(100% - 90px);
      }
    }
  }
}

.fixed-min-height--small {
  .ck-editor__editable {
    min-height: 250px;
  }
}

.ck-editor {
  .ck.ck-toolbar {
    border-top-right-radius: 7px !important;
    border-top-left-radius: 7px !important;
  }
  .ck.ck-editor__editable {
    border-bottom-right-radius: 7px !important;
    border-bottom-left-radius: 7px !important;
  }
}

.ck-editor__editable {
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }

  &::-webkit-scrollbar-track {
    background: $lightgray;
    border-radius: 20px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #2b7bff;
    border-radius: 6px;
    border: 3px solid #2b7bff;
    width: 20px;
  }
}
</style>
