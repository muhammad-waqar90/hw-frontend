<template>
  <div>
    <div class="alert alert-primary d-flex align-items-center">
      <Information :size="22" />
      <div class="ms-2">
        Module E-Notes Collective Amount: £<b>{{
          lessonEbookApi.data?.price.toFixed(2)
        }}</b>
      </div>
    </div>
    <LessonEbookItem
      :ebook="ebook ? ebook : {}"
      :is-submitting="lessonEbookApi.loading"
      :is-allow-delete="isAllowAddDelete"
      @on-upload="onUpload"
      @on-start-deleting="startDeleting"
    />
    <Modal
      v-if="modalMode == 'deleteEbook'"
      :title="'Confirm Action'"
      :min-height="'200px'"
      :min-width="'40vw'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">Are you sure you want to delete?</div>
      <template slot="footer">
        <ConfirmationButtons
          :disabled="lessonEbookApi.loading"
          @on-cancel="closeModal"
          @on-confirm="deleteEbook"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
import Information from "vue-material-design-icons/Information";
import LessonEbookItem from "@/components/AF/Courses/CourseContent/CourseLesson/LessonEbook/LessonEbookItem.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import {
  createLessonEbook,
  getLessonEbook,
  updateLessonEbook,
  deleteLessonEbook,
} from "@/services/AF/afLessonEbookService";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import { mapGetters } from "vuex";

export default {
  name: "LessonEbook",
  components: {
    LessonEbookItem,
    Modal,
    ConfirmationButtons,
    Information,
  },
  mixins: [apiMixin],
  props: {
    courseId: { type: Number },
    levelId: { type: Number },
    courseModuleId: { type: Number },
    lessonId: { type: Number },
  },
  data() {
    return {
      modalMode: "",
      lessonEbookApi: getApiState(),
    };
  },
  computed: {
    ...mapGetters({
      isAllowAddDelete: "course/getIsAllowAddDelete",
    }),
    ebook() {
      return Array.isArray(this.lessonEbookApi.data?.ebook)
        ? this.lessonEbookApi.data?.ebook?.length
        : this.lessonEbookApi.data?.ebook;
    },
  },
  watch: {
    lessonId() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(this.lessonEbookApi, () =>
        getLessonEbook(
          this.courseId,
          this.levelId,
          this.courseModuleId,
          this.lessonId
        )
      );
    },
    onUpload(content) {
      let formData = new FormData();
      formData.append("lesson_id", this.lessonId);
      formData.append("content", content);

      if (this.ebook) return this.updateEbook(this.ebook.id, formData);

      return this.submitEbook(formData);
    },
    async submitEbook(data) {
      await this.$postApiData(this.lessonEbookApi, () =>
        createLessonEbook(
          this.courseId,
          this.levelId,
          this.courseModuleId,
          this.lessonId,
          data
        )
      );
      if (this.lessonEbookApi.error) return;
      this.$emit("reload");
      this.init();
    },
    async updateEbook(ebookId, data) {
      await this.$postApiData(this.lessonEbookApi, () =>
        updateLessonEbook(
          this.courseId,
          this.levelId,
          this.courseModuleId,
          this.lessonId,
          ebookId,
          data
        )
      );
      if (this.lessonEbookApi.error) return;
      this.init();
    },
    startDeleting() {
      this.openModal("deleteEbook");
    },
    async deleteEbook() {
      await this.$postApiData(this.lessonEbookApi, () =>
        deleteLessonEbook(
          this.courseId,
          this.levelId,
          this.courseModuleId,
          this.lessonId,
          this.ebook.id
        )
      );
      if (this.lessonEbookApi.error) return;
      this.closeModal();
      this.$emit("reload");
      this.init();
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
    },
  },
};
</script>
