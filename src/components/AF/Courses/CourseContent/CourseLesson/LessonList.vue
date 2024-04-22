<template>
  <div class="container-fluid">
    <div class="row color-gray lesson-list-heading">
      <div class="col-1 ps-4">
        <input
          type="checkbox"
          :class="cursor"
          :checked="areAllLessonsSelected"
          :disabled="areAllLessonsDisabled"
          value="all-lectures"
          @change="onChangeAllLessonsSelection()"
        />
      </div>
      <div class="col-11">
        <div class="row">
          <div class="col-1">ID</div>
          <div class="col-2">Name</div>
          <div class="col-2">Video S3 Link</div>
          <div class="col-2">Status</div>
          <div class="col-2">Created At</div>
          <div class="col-2">Updated At</div>
          <div class="col-1">Actions</div>
        </div>
      </div>
    </div>
    <draggable
      v-if="true"
      :list="lessonList"
      tag="div"
      :disabled="!isAllowAddDelete || mode"
      @change="onOrderChange"
    >
      <div v-for="item in list" :key="item.id" class="mt-2">
        <LessonListItem
          :item="item"
          :selected="isLessonSelected(item)"
          :disabled="isDisabled(item)"
        />
      </div>
    </draggable>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import courseDetailsMixin from "@/mixins/AF/courseDetailsMixin";
import LessonListItem from "@/components/AF/Courses/CourseContent/CourseLesson/LessonListItem.vue";
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
import { sortLessons } from "@/services/AF/afCourseLessonService";

export default {
  name: "LessonList",
  components: {
    LessonListItem,
    draggable,
  },
  mixins: [toastMixin, courseDetailsMixin],
  props: {
    levelId: { type: Number },
    moduleId: { type: Number },
    list: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      lessonList: this.list,
    };
  },
  computed: {
    ...mapGetters({
      selectedEntityData: "course/getSelectedEntityData",
      isAllowAddDelete: "course/getIsAllowAddDelete",
      mode: "course/getMode", // create | edit
    }),
    isLessonSelected() {
      return (item) =>
        this.isEntitySelected(this.selectedEntityData, item, "lecture");
    },
    areAllLessonsSelected() {
      return (
        this.areAllEntitiesSelected(
          this.selectedEntityData,
          this.list,
          "lecture"
        ) && this.selectedEntityData?.list[0].course_module_id === this.moduleId
      );
    },
    areAllLessonsDisabled() {
      return (
        this.selectedEntityData?.entity === "module" ||
        (this.selectedEntityData?.entity === "lecture" &&
          this.selectedEntityData?.list[0].course_module_id !== this.moduleId)
      );
    },
    cursor() {
      return this.areAllLessonsDisabled
        ? "cursor-not-allowed"
        : "cursor-pointer";
    },
  },
  watch: {
    list() {
      this.lessonList = this.list;
    },
  },
  methods: {
    onChangeAllLessonsSelection() {
      let payload =
        this.selectedEntityData.list?.length == this.list.length
          ? {}
          : { entity: "lecture", list: this.list, parent: this.moduleId };
      this.$store.dispatch("course/setSelectedEntityData", payload);
    },
    isDisabled(item) {
      if (this.selectedEntityData?.entity === "module") return true;
      if (this.selectedEntityData?.entity === "lecture")
        return this.selectedEntityData?.parent !== item.course_module_id;

      return false;
    },
    async onOrderChange(item) {
      const lessonsSortedList = this.list.map((item, key) => ({
        id: item.id,
        order_id: key + 1,
        published: item.published,
      }));

      const response = await sortLessons(
        item.moved.element.course_id,
        this.levelId,
        item.moved.element.course_module_id,
        lessonsSortedList
      );

      // if sorting failed, revert the the lesson order.
      if (response.error) {
        let moved = this.lessonList.splice(item.moved.newIndex, 1);
        this.lessonList.splice(item.moved.oldIndex, 0, moved[0]);
      }

      this.$displayServerResponse(response);
    },
  },
};
</script>

<style scoped>
.lesson-list-heading > div {
  font-weight: bold;
}
</style>
