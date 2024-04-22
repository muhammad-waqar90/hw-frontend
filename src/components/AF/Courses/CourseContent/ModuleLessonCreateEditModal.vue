<template>
  <Modal
    :title="`${mode} ${entity} ${entityName}`"
    :modal-right-full-screen="true"
    :close-on-click-outside="false"
    :overlay="false"
    :position="'fixed'"
    @close-modal="onCloseModal"
  >
    <div class="w-100">
      <ModuleLessonTabs
        v-if="mode === 'edit'"
        :tab="tab"
        :entity="entity"
        @set-tab="setTab"
      />
      <ModuleLessonCreateEditForm
        v-if="isTab('overview')"
        :mode="mode"
        :entity="entity"
        :entity-data="entityData"
        :is-submitting="isSubmitting"
        :is-allow-add-delete="isAllowAddDelete"
        @on-change="onChange"
        @on-submit="onSubmit"
        @on-start-deleting="onStartDeleting"
      />
      <LessonFaq
        v-if="isTab('faqs') && entity === 'lecture'"
        :lesson-id="entityData?.id"
      />
      <LessonEbook
        v-if="isTab('ebooks') && entity === 'lecture'"
        :course-id="entityData?.course_id"
        :level-id="levelId"
        :course-module-id="entityData?.course_module_id"
        :lesson-id="entityData?.id"
        @reload="reload"
      />
      <LessonQuiz
        v-if="isTab('quiz') && entity === 'lecture'"
        :entity="entity"
        :course-id="entityData?.course_id"
        :level-id="levelId"
        :course-module-id="entityData?.course_module_id"
        :lesson-id="entityData?.id"
      />
      <ModuleExam
        v-if="isTab('exam') && entity === 'module'"
        :entity="entity"
        :course-id="entityData?.course_id"
        :level-id="levelId"
        :course-module-id="entityData?.id"
        :module-has-exam="moduleHasExam"
      />
      <Modal
        v-if="startDeleting"
        :title="'Confirm Action'"
        :min-height="'300px'"
        :min-width="'40vw'"
        :modal-right-full-screen="false"
        @close-modal="startDeleting = false"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete {{ entity }}
          <b>{{ entityData.name }}</b> ? <br />
          Complete {{ entity }} will be deleted along with all content of the
          {{ entity }}.
        </div>
        <template slot="footer">
          <ConfirmationButtonsWithInput
            :name="entityData.name"
            :placeholder="`Type the ${entity} name for confirming the delete action e.g ${entityData.name}`"
            :is-submitting="isSubmitting"
            loading-label="Deleting..."
            @on-confirm="onDelete"
          />
        </template>
      </Modal>
    </div>
  </Modal>
</template>

<script>
import ModuleLessonTabs from "@/components/AF/Courses/CourseContent/ModuleLessonTabs.vue";
import ModuleLessonCreateEditForm from "@/components/AF/Courses/CourseContent/ModuleLessonCreateEditForm.vue";
import LessonFaq from "@/components/AF/Courses/CourseContent/CourseLesson/LessonFaq/LessonFaq.vue";
import LessonEbook from "@/components/AF/Courses/CourseContent/CourseLesson/LessonEbook/LessonEbook.vue";
import LessonQuiz from "@/components/AF/Courses/CourseContent/CourseLesson/LessonQuiz/LessonQuiz.vue";
import ModuleExam from "@/components/AF/Courses/CourseContent/CourseModule/ModuleExam/ModuleExam.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";
import { mapGetters } from "vuex";

export default {
  name: "ModuleLessonCreateEditModal",
  components: {
    ModuleLessonTabs,
    ModuleLessonCreateEditForm,
    LessonFaq,
    LessonEbook,
    LessonQuiz,
    ModuleExam,
    Modal,
    ConfirmationButtonsWithInput,
  },
  props: {
    entity: { type: String },
    mode: { type: String },
    isSubmitting: { type: Boolean },
    isAllowAddDelete: { type: Boolean },
    entityData: {
      type: Object,
      default: () => {},
    },
    levelId: { type: Number },
  },
  data() {
    return {
      tab: "overview",
      startDeleting: false,
    };
  },
  computed: {
    ...mapGetters({
      hasEntityChanged: "course/getHasEntityChanged",
    }),
    entityName() {
      return this.mode === "edit" ? `(${this.entityData.name})` : "";
    },
    moduleHasExam() {
      return this.entityData?.quiz?.length > 0;
    },
  },
  watch: {
    entity() {
      this.tab = "overview";
    },
  },
  methods: {
    isTab(tab) {
      return this.tab === tab;
    },
    setTab(tab) {
      if (
        this.hasEntityChanged &&
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      )
        return;
      this.$store.dispatch("course/setHasEntityChanged", false);

      this.tab = tab;
    },
    onChange(field, value) {
      this.$emit("on-change", field, value);
    },
    onSubmit(data) {
      this.$emit("on-submit", data);
    },
    onStartDeleting(startDeleting) {
      this.startDeleting = startDeleting;
    },
    onDelete() {
      this.$emit("on-delete");
    },
    onCloseModal() {
      this.$emit("on-close-modal");
    },
    reload() {
      this.$emit("reload");
    },
  },
};
</script>
