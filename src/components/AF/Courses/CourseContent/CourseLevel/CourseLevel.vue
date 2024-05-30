<template>
  <div>
    <LevelList
      :levels="levels"
      :is-submitting="isSubmitting"
      :selected-level="selectedLevel"
      @level-change="onLevelChange"
      @on-create="createLevel"
      @on-edit="onEdit"
      @on-delete="onDelete"
      @set-level="setLevel"
    />

    <Modal
      v-if="modalMode == 'delete' || modalMode == 'edit'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="modalMode = ''"
    >
      <div v-if="modalMode == 'delete'" class="w-100 pt-2 h5">
        Are you sure you want to delete <b> {{ selectedLevel.name }}</b
        >? All modules/lectures of this Level will be deleted.<br />
        <span class="text-danger h6"
          ><i>
            Note: Deletion of any level will shift next levels a step back.<br />
            e.g: if have 3 Levels and deleted Level 2 then Level 3 will become
            Level 2.</i
          >
        </span>
      </div>
      <div v-if="modalMode == 'edit'" class="w-100 pt-2 h5">
        Do you want to edit <b> {{ selectedLevel.name }}</b> ?<br />
        <span class="text-danger h6">
          <i>
            Note: Changes will be reflected on user side as well. Level name can
            have min: 5 and max: 15 characters.</i
          >
        </span>
      </div>
      <template slot="footer">
        <ConfirmationButtonsWithInput
          v-if="modalMode == 'delete'"
          :name="selectedLevel.name"
          :placeholder="
            'Please type the level name for confirming the delete action e.g ' +
            selectedLevel.name
          "
          :is-submitting="isSubmitting"
          loading-label="Deleting..."
          @on-confirm="deleteLevel"
        />
        <ConfirmationButtonsWithInput
          v-else-if="modalMode == 'edit'"
          :name="selectedLevel.name"
          :is-validated="isValidated"
          :validation-method="onNameChange"
          :placeholder="'Type the level name'"
          :is-submitting="isSubmitting"
          loading-label="Updating..."
          @on-confirm="updateLevel"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
import LevelList from "@/components/AF/Courses/CourseContent/CourseLevel/LevelList.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";
import toastMixin from "@/mixins/toastMixin";
import {
  createLevel,
  updateLevel,
  deleteLevel,
} from "@/services/AF/afCourseLevelService";

export default {
  name: "CourseLevel",
  components: {
    LevelList,
    Modal,
    ConfirmationButtonsWithInput,
  },
  mixins: [toastMixin],
  props: {
    courseId: { type: Number },
    levels: null,
    selectedLevel: { type: Object },
  },
  data() {
    return {
      modalMode: "",
      isSubmitting: false,
      isValidated: false,
    };
  },
  methods: {
    onLevelChange(level) {
      this.$emit("level-change", level);
    },
    setLevel(level) {
      this.$emit("set-level", level);
    },
    onDelete(level) {
      this.$emit("set-level", level);
      this.modalMode = "delete";
    },
    onEdit(level) {
      this.$emit("set-level", level);
      this.modalMode = "edit";
    },
    onNameChange(name) {
      this.isValidated = name.length >= 5 && name.length <= 15;
    },
    async createLevel() {
      this.isSubmitting = true;
      let response = await createLevel(this.courseId);
      this.isSubmitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);
      this.$emit("reload");
    },
    async updateLevel(name) {
      this.isSubmitting = true;
      let response = await updateLevel(
        this.courseId,
        this.selectedLevel.id,
        name
      );
      this.isSubmitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);
      this.modalMode = "";
      this.$emit("reload");
    },
    async deleteLevel() {
      this.isSubmitting = true;
      let response = await deleteLevel(this.courseId, this.selectedLevel.id);
      this.isSubmitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);
      this.modalMode = "";
      this.$emit("set-level", {});
      this.$emit("reload");
    },
  },
};
</script>
