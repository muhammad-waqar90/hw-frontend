<template>
  <div class="rounded-card bg-white col-12 lesson-bottom-outer">
    <div v-if="$isMobile" class="px-3 mb-3 mt-3 pt-3">
      <progress-bar :progress="lesson.progress ? lesson.progress : 0" />
    </div>
    <div class="mt-lg-2">
      <LessonBottomToggleButtons
        :mode="getMode"
        :notes-saving="notesSaving"
        @set-mode="setMode"
      />
    </div>
    <div class="pb-4 pb-lg-2">
      <LessonOverview
        v-if="getMode == 'overview'"
        :lesson="lesson"
        :hierarchy-tree="hierarchyTree"
      />
      <LessonFaq v-if="getMode == 'faq'" :faqs="lesson.lesson_faq" />
      <LessonNotes
        v-if="getMode == 'notes'"
        :notes-text="notesText"
        @on-notes-update="onNotesUpdate"
      />
    </div>
  </div>
</template>

<script>
import LessonNotes from "@/components/IU/Lessons/LessonNotes";
import LessonOverview from "@/components/IU/Lessons/LessonOverview";
import LessonFaq from "@/components/IU/Lessons/LessonFaq";
import LessonBottomToggleButtons from "@/components/IU/Lessons/LessonBottomToggleButtons";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import ProgressBar from "@/components/Misc/ProgressBar";

export default {
  name: "LessonBottom",

  components: {
    LessonNotes,
    LessonOverview,
    LessonFaq,
    LessonBottomToggleButtons,
    ProgressBar,
  },

  mixins: [devicesMixin],

  props: {
    lesson: {
      type: Object,
      default: () => {},
    },

    hierarchyTree: {
      type: Array,
      default: () => {},
    },

    notesText: {
      type: String,
      default: "",
    },
    notesSaving: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      mode: "overview",
    };
  },

  computed: {
    getMode() {
      if (!this.$isMobile && this.mode == "notes") return "overview";
      return this.mode;
    },
  },

  methods: {
    setMode(mode) {
      this.mode = mode;
    },

    onNotesUpdate(text) {
      this.$emit("on-notes-update", text);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

@media (max-width: $laptopWidth) {
  .lesson-bottom-outer {
    min-height: 272px;
  }
}
</style>
