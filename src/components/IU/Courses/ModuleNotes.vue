<template>
  <div v-if="shouldShow">
    <div class="rounded-card outer-module-notes text-dark-gray p-3 mt-2">
      <h4>
        {{ $t("iu.course.myNotes") }}
      </h4>

      <div
        class="note-content scrollbar-blue my-3 p-3 text-break"
        v-html-directive="userNotesList[selectedLesson].note"
      />

      <UserNoteFilter
        :selected-lesson="selectedLesson"
        :user-notes-list="userNotesList"
        @update-selected="handleUpdateSelected"
      />
    </div>
  </div>
</template>

<script>
import UserNoteFilter from "./UserNoteFilter.vue";

export default {
  components: {
    UserNoteFilter,
  },
  props: {
    courseModule: {
      type: Object,
    },
    userNotesList: {
      type: Object,
    },
  },
  data() {
    return {
      selectedLesson: null,
      shouldShow: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.selectedLesson = parseInt(Object.keys(this.userNotesList)[0]);
      this.shouldShow = true;
    },
    handleUpdateSelected(id) {
      this.selectedLesson = id;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.outer-module-notes {
  background-color: $lightgray;
}
.note-content {
  height: 200px;
  overflow: auto;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  white-space: pre;
}
</style>
