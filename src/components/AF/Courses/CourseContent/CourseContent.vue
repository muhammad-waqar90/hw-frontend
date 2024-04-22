<template>
  <div class="h-100 course-content-body py-4 px-4 rounded-card">
    <CourseLevel
      :course-id="course.id"
      :levels="course.course_levels"
      :selected-level="selectedLevel"
      @level-change="onLevelChange"
      @reload="reload"
      @set-level="setLevel"
    />
    <CourseModule
      v-if="selectedLevel.id"
      :level-id="selectedLevel.id"
      :modules="selectedLevel.course_modules"
    />
    <NoRecordFound v-else message="No level found" />
    <ModuleLessonCreateEditModal
      v-if="mode !== ''"
      :mode="mode"
      :entity="entity"
      :entity-data="entityData"
      :level-id="selectedLevel.id"
      :is-submitting="isSubmitting"
      :is-allow-add-delete="isAllowAddDelete"
      @on-change="onChange"
      @reload="reload"
      @on-submit="handleSubmit"
      @on-delete="handleSingleDelete"
      @on-close-modal="onCloseModal"
    />
    <ModuleLessonActionsModal
      v-if="selectedEntityDataLength"
      :count="selectedEntityDataLength"
      :entity="selectedEntityData.entity"
      :is-allow-add-delete="isAllowAddDelete"
      @on-delete="handleMultiDelete"
    />
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CourseLevel from "@/components/AF/Courses/CourseContent/CourseLevel/CourseLevel.vue";
import CourseModule from "@/components/AF/Courses/CourseContent/CourseModule/CourseModule.vue";
import NoRecordFound from "@/components/Misc/Admin/NoRecordFound.vue";
import ModuleLessonCreateEditModal from "@/components/AF/Courses/CourseContent/ModuleLessonCreateEditModal.vue";
import ModuleLessonActionsModal from "@/components/AF/Courses/CourseContent/ModuleLessonActionsModal.vue";
import { mapGetters } from "vuex";
import {
  createModule,
  updateModule,
  deleteModule,
} from "@/services/AF/afCourseModuleService";
import {
  createLesson,
  updateLesson,
  deleteLesson,
} from "@/services/AF/afCourseLessonService";
import { getSpecificKeyValues } from "@/utils/generalUtils";

export default {
  name: "CourseContent",
  components: {
    CourseLevel,
    CourseModule,
    NoRecordFound,
    ModuleLessonCreateEditModal,
    ModuleLessonActionsModal,
  },
  mixins: [toastMixin],
  props: {
    course: { type: Object, default: () => {} },
    isAllowAddDelete: { type: Boolean, default: false },
  },
  data() {
    return {
      selectedLevel: {},
      isSubmitting: false,
    };
  },
  computed: {
    ...mapGetters({
      entity: "course/getEntity",
      mode: "course/getMode",
      entityData: "course/getEntityData",
      hooks: "course/getHooks",
      selectedEntityData: "course/getSelectedEntityData",
      hasEntityChanged: "course/getHasEntityChanged",
    }),

    handleCreateEntity() {
      return (
        (this.entity === "module" && this.createModule) ||
        (this.entity === "lecture" && this.createLesson)
      );
    },
    handleUpdateEntity() {
      return (
        (this.entity === "module" && this.updateModule) ||
        (this.entity === "lecture" && this.updateLesson)
      );
    },
    selectedEntityDataLength() {
      return (
        (this.selectedEntityData.list && this.selectedEntityData.list.length) ||
        0
      );
    },
  },
  watch: {
    course() {
      this.selectedLevel =
        this.course.course_levels.find(
          (level) => level.id === this.selectedLevel.id
        ) ||
        (this.course.course_levels.length && this.course.course_levels[0]) ||
        {};
    },
  },
  mounted() {
    this.selectedLevel =
      (this.course.course_levels.length && this.course.course_levels[0]) || {};
  },
  methods: {
    onLevelChange(level) {
      if (
        this.hasEntityChanged &&
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      )
        return;
      this.$store.dispatch("course/setHasEntityChanged", false);
      this.reset();

      this.selectedLevel = level;
    },
    setLevel(level) {
      this.selectedLevel = level;
    },
    async handleSubmit(data) {
      this.isSubmitting = true;

      let response =
        this.mode && this.mode === "create"
          ? await this.handleCreateEntity(data)
          : await this.handleUpdateEntity(data);

      this.isSubmitting = false;
      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);
      this.reset();
      this.reload();
    },
    async createModule(data) {
      data.append("order_id", this.hooks.order);
      return await createModule(this.course.id, this.selectedLevel.id, data);
    },
    async updateModule(data) {
      data.append("order_id", this.entityData.order_id);
      return await updateModule(
        this.course.id,
        this.selectedLevel.id,
        this.entityData.id,
        data
      );
    },
    async createLesson(data) {
      data.append("order_id", this.hooks.order);
      return await createLesson(
        this.course.id,
        this.selectedLevel.id,
        this.hooks.module_id,
        data
      );
    },
    async updateLesson(data) {
      data.append("order_id", this.entityData.order_id);
      return await updateLesson(
        this.course.id,
        this.selectedLevel.id,
        this.entityData.course_module_id,
        this.entityData.id,
        data
      );
    },
    // handle module/lesson delete
    async handleSingleDelete() {
      const moduleId =
        this.entity === "lecture" ? this.entityData.course_module_id : null;
      this.deleteEntities(this.entity, this.entityData.id, moduleId);
    },
    async handleMultiDelete() {
      const ids = getSpecificKeyValues(this.selectedEntityData.list, "id");
      const moduleId =
        this.selectedEntityData.entity === "lecture"
          ? this.selectedEntityData.parent
          : null;

      this.deleteEntities(this.selectedEntityData.entity, ids, moduleId);
      this.$store.dispatch("course/setSelectedEntityData", {});
    },
    async deleteEntities(entity, items, moduleId = null) {
      this.isSubmitting = true;

      let response =
        entity === "module"
          ? await deleteModule(this.course.id, this.selectedLevel.id, items)
          : await deleteLesson(
              this.course.id,
              this.selectedLevel.id,
              moduleId,
              items
            );

      this.isSubmitting = false;
      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);
      this.reset();
      this.reload();
    },
    onChange(key, value) {
      this.$store.dispatch(
        "course/setHasEntityChanged",
        this.entityData[key] != value
      );
    },
    onCloseModal() {
      if (
        this.hasEntityChanged &&
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      )
        return;
      this.$store.dispatch("course/setHasEntityChanged", false);
      this.reset();
    },
    reset() {
      this.$store.dispatch("course/clear");
      this.$store.dispatch("course/setIsAllowAddDelete", this.isAllowAddDelete);
    },
    reload() {
      this.$emit("reload");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.course-content-body {
  background-color: $lightgray;
}
</style>
