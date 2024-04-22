<template>
  <div class="rounded-card px-md-2 py-2">
    <LessonVideoPlayer
      :initial-timestamp="lesson.video_progress ? lesson.video_progress : 0"
      :thumbnail="lesson.img"
      :src="lesson.video"
      aspect-ratio="16:9"
      :rounded="roundedTop"
      @video-playing="saveVideoTimestamp"
      @video-paused="saveVideoTimestamp"
    />

    <LessonBottom
      :lesson="lesson"
      :hierarchy-tree="hierarchyTree"
      :notes-text="notesText"
      :notes-saving="notesSaving"
      @on-notes-update="onNotesUpdate"
    />
  </div>
</template>

<script>
import LessonBottom from "@/components/IU/Lessons/LessonBottom";
import LessonVideoPlayer from "@/components/IU/Lessons/LessonVideoPlayer";

import { TOP_ROUNDED as roundedTop } from "@/dataObject/video/videoRoundedData";

export default {
  components: {
    LessonBottom,
    LessonVideoPlayer,
  },

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
      roundedTop,
    };
  },

  methods: {
    onNotesUpdate(text) {
      this.$emit("on-notes-update", text);
    },
    saveVideoTimestamp(timestamp) {
      this.$emit("save-video-timestamp", timestamp);
    },
  },
};
</script>
