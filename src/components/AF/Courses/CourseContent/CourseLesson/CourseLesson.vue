<template>
  <div>
    <div class="text-end pe-4">
      <button
        v-if="isAllowAddDelete"
        type="button"
        class="btn blue-btn rounded-card px-4 font-weight-600"
        @click="onCreateLesson"
      >
        ADD LECTURE
      </button>
      <ButtonWithTooltip
        v-else
        :disabled="true"
        label="ADD LECTURE"
        :message="courseText.disableCreateDelete"
        btn-class="btn blue-btn rounded-card px-4 font-weight-600"
      />
    </div>
    <div class="py-4">
      <LessonList
        v-if="lessons.length"
        :level-id="levelId"
        :module-id="moduleId"
        :list="lessons"
      />
      <NoRecordFound v-else message="No lecture found" />
    </div>
  </div>
</template>

<script>
import LessonList from "@/components/AF/Courses/CourseContent/CourseLesson/LessonList.vue";
import NoRecordFound from "@/components/Misc/Admin/NoRecordFound.vue";
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";
import { mapGetters } from "vuex";
import { courseText } from "@/dataObject/AF/afStaticTextsData";

export default {
  name: "CourseLesson",
  components: {
    LessonList,
    NoRecordFound,
    ButtonWithTooltip,
  },
  props: {
    levelId: { type: Number },
    moduleId: { type: Number },
    lessons: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      courseText,
    };
  },
  computed: {
    ...mapGetters({
      isAllowAddDelete: "course/getIsAllowAddDelete",
    }),
  },
  methods: {
    onCreateLesson() {
      this.$store.dispatch("course/setMode", "create");
      this.$store.dispatch("course/setEntity", "lecture");
      this.$store.dispatch("course/setHooks", {
        module_id: this.moduleId,
        order: this.lessons.length + 1,
      });
    },
  },
};
</script>
