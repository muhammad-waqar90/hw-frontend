<template>
  <div class="mt-3">
    <div class="overflow-hidden px-2 notes-container">
      <NotesEditor
        :initial-text="notesText"
        :height="NOTEPAD_FIXED_MIN_HEIGHT_SMALL"
        @note-input="onNotesUpdate"
      />
    </div>
  </div>
</template>

<script>
import { FIXED_MIN_HEIGHT_SMALL as NOTEPAD_FIXED_MIN_HEIGHT_SMALL } from "@/dataObject/notepad/notepadModesData";

export default {
  name: "LessonNotes",

  components: {
    NotesEditor: () =>
      import(
        /* webpackChunkName: "NotesEditorComponent" */ "@/components/IU/Lessons/NotesEditor"
      ),
  },

  props: {
    notesText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      NOTEPAD_FIXED_MIN_HEIGHT_SMALL,
    };
  },

  methods: {
    onNotesUpdate(text) {
      this.$emit("on-notes-update", text);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
/*

.notes-container{
  height: 300px;
}

@media(max-width: $bigPhoneWidth) {
  .notes-container{
    height: 200px;
  }
}
*/
</style>
