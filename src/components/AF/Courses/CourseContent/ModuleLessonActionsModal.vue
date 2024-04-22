<template>
  <div>
    <ActionModal
      :close-on-click-outside="false"
      :overlay="false"
      :count="count"
      @close-modal="onCloseModal"
    >
      <div class="row">
        <div class="col-4 text-capitalize title">
          <b> {{ entity }} {{ (count > 1 && "s") || "" }} </b> Selected
        </div>
        <div class="col-8 align-right">
          <span
            v-if="isAllowAddDelete"
            class="cursor-pointer delete"
            @click="startDeleting = true"
          >
            <TrashCan title="Delete" :size="33" />
          </span>
          <span
            v-else
            :title="courseText.disableCreateDelete"
            class="cursor-not-allowed delete disabled"
          >
            <TrashCan :title="courseText.disableCreateDelete" :size="33" />
          </span>
        </div>
      </div>
    </ActionModal>
    <Modal
      v-if="startDeleting"
      :title="'Confirm Action'"
      :min-height="'300px'"
      :min-width="'40vw'"
      @close-modal="startDeleting = false"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete
        <b> {{ count }} {{ entity }} {{ (count > 1 && "s") || "" }} </b>
        ? <br />
        Complete
        <b> {{ entity }} {{ (count > 1 && "s") || "" }} </b>
        will be deleted along with all content.
      </div>
      <template slot="footer">
        <ConfirmationButtonsWithInput
          name="Confirm"
          placeholder="Type Confirm for confirming the delete action"
          :is-submitting="false"
          loading-label="Deleting..."
          @on-confirm="onDelete()"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
import TrashCan from "vue-material-design-icons/TrashCanOutline";
import ActionModal from "@/components/Misc/Admin/ActionModal.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";
import { courseText } from "@/dataObject/AF/afStaticTextsData";

export default {
  name: "ModuleLessonActionsModal",
  components: {
    ActionModal,
    TrashCan,
    Modal,
    ConfirmationButtonsWithInput,
  },
  props: {
    count: { type: Number },
    entity: { type: String },
    isAllowAddDelete: { type: Boolean },
  },
  data() {
    return {
      startDeleting: false,
      courseText,
    };
  },
  methods: {
    onCloseModal() {
      this.$store.dispatch("course/setSelectedEntityData", {}); // clear selection
    },
    onDelete() {
      this.$emit("on-delete");
    },
  },
};
</script>

<style scoped>
.title {
  font-size: 18px;
}
.align-right {
  text-align: right;
}
.delete:hover {
  color: red;
}
</style>
