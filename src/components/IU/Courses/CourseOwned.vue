<template>
  <section id="course-owned">
    <CourseHead
      :course="course"
      :progress="progress"
      :mode="mode"
      @change-mode="changeMode"
    />

    <CourseLevels
      v-show="mode == 'content'"
      :course="course"
      :level-data="levelData"
      :course-levels="courseLevels"
      @level-change="onLevelChange"
    />

    <ModuleList
      v-show="mode == 'content'"
      :is-preview="false"
      :modules="modules"
      :course-id="course.id"
      :loading-level="loadingLevel"
    />
    <AboutContent
      v-show="mode == 'about'"
      :course-desc="course.description"
      class="rounded-card-bottom bg-light-gray"
    />
    <EBookContent
      v-show="mode == 'ebook'"
      :course-owned="true"
      :course-id="course.id"
      :course-level="levelData"
      class="rounded-card-bottom bg-light-gray"
    />
  </section>
</template>

<script>
import CourseHead from "@/components/IU/Courses/CourseHead";
import CourseLevels from "@/components/IU/Courses/CourseLevels";
import ModuleList from "@/components/IU/Courses/ModuleList";
import AboutContent from "@/components/IU/Courses/AboutContent";
import EBookContent from "@/components/IU/Courses/EBookContent";

export default {
  name: "CourseOwned",
  components: {
    CourseHead,
    CourseLevels,
    ModuleList,
    AboutContent,
    EBookContent,
  },

  props: {
    course: { type: Object },
    modules: { type: Array },
    category: { type: Object },
    parentCategoryTree: { type: Array },
    progress: { type: Number },
    levelData: { type: Object },
    loadingLevel: { type: Boolean },
    courseLevels: { type: Array },
  },

  data() {
    return {
      mode: "content",
    };
  },

  methods: {
    onLevelChange(value) {
      this.$emit("level-change", value);
    },
    changeMode(mode) {
      this.mode = mode;
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.bg-light-gray {
  background-color: $lightgray;
}
</style>
