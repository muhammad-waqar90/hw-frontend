<template>
  <div class="container-fluid">
    <div class="row color-gray module-list-heading">
      <div class="col-1 py-2 ps-4">
        <input
          type="checkbox"
          value="all-modules"
          :class="cursor"
          :checked="areAllModulesSelected"
          :disabled="areAllModulesDisabled"
          @change="onChangeAllModulesSelection()"
        />
      </div>
      <div class="col-11 py-2 pr-4">
        <div class="row">
          <div class="col-1">ID</div>
          <div class="col-4">Name</div>
          <div class="col-2">#Lecture(s)</div>
          <div class="col-2">Created At</div>
          <div class="col-2">Updated At</div>
          <div class="col-1">Actions</div>
        </div>
      </div>
    </div>
    <draggable
      v-if="true"
      :list="list"
      tag="div"
      :disabled="!isAllowAddDelete || mode"
      @change="onOrderChange"
    >
      <div v-for="item in list" :key="item.id" class="mt-1">
        <ModuleListItem
          :item="item"
          :selected="isModuleSelected(item)"
          :disabled="isDisabled(item)"
        />
      </div>
    </draggable>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import courseDetailsMixin from "@/mixins/AF/courseDetailsMixin";
import ModuleListItem from "@/components/AF/Courses/CourseContent/CourseModule/ModuleListItem.vue";
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
import { sortModule } from "@/services/AF/afCourseModuleService";

export default {
  name: "ModuleList",
  components: {
    draggable,
    ModuleListItem,
  },
  mixins: [toastMixin, courseDetailsMixin],
  props: {
    levelId: { type: Number },
    list: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    ...mapGetters({
      selectedEntityData: "course/getSelectedEntityData",
      isAllowAddDelete: "course/getIsAllowAddDelete",
      mode: "course/getMode", // create | edit
    }),
    isModuleSelected() {
      return (item) =>
        this.isEntitySelected(this.selectedEntityData, item, "module");
    },
    areAllModulesSelected() {
      return (
        this.areAllEntitiesSelected(
          this.selectedEntityData,
          this.list,
          "module"
        ) && this.selectedEntityData?.list[0].course_level_id === this.levelId
      );
    },
    areAllModulesDisabled() {
      return (
        this.selectedEntityData?.entity === "lecture" ||
        (this.selectedEntityData?.entity === "module" &&
          this.selectedEntityData?.list[0].course_level_id !== this.levelId)
      );
    },
    cursor() {
      return this.areAllModulesDisabled
        ? "cursor-not-allowed"
        : "cursor-pointer";
    },
  },
  methods: {
    onChangeAllModulesSelection() {
      let payload =
        this.selectedEntityData.list?.length == this.list.length
          ? {}
          : { entity: "module", list: this.list, parent: this.levelId };
      this.$store.dispatch("course/setSelectedEntityData", payload);
    },
    isDisabled(item) {
      if (this.selectedEntityData?.entity === "lecture") return true;
      if (this.selectedEntityData?.entity === "module")
        return this.selectedEntityData?.parent !== item.course_level_id;

      return false;
    },
    async onOrderChange(item) {
      const modulesSortedList = this.list.map((item, key) => ({
        id: item.id,
        order_id: key + 1,
      }));
      const response = await sortModule(
        item.moved.element.course_id,
        item.moved.element.course_level_id,
        modulesSortedList
      );
      this.$displayServerResponse(response);
    },
  },
};
</script>

<style scoped>
.module-list-heading > div {
  font-weight: bold;
}
</style>
