<template>
  <div>
    <div class="text-end pe-2">
      <button
        :class="
          showLessonFaqCreateForm
            ? 'btn btn-light border text-gray'
            : 'btn blue-btn'
        "
        :disabled="!showLessonFaqCreateForm && isCreatingEditingLessonFaq"
        @click="toggleLessonFaqCreateForm"
      >
        {{ showLessonFaqCreateForm ? "x" : "ADD FAQ" }}
      </button>
    </div>
    <LessonFaqCreateEditForm
      v-if="showLessonFaqCreateForm"
      :is-submitting="lessonFaqApi.loading"
      @on-submit="onSubmit"
    />
    <div class="d-flex">
      <SearchWithButton
        :search-text-prop="searchText"
        :search-placeholder="'Search by question/answer'"
        @on-search="handleSearch"
      />
    </div>
    <LessonFaqList
      v-if="lessonFaqApi.data?.length"
      :list="(lessonFaqApi.data && lessonFaqApi.data) || []"
      :is-submitting="lessonFaqApi.loading"
      @on-update="onUpdate"
      @on-delete="startDeleting"
    />
    <NoRecordFound v-else message="No lecture FAQ found" />
    <Modal
      v-if="modalMode == 'deleteFaq'"
      :title="'Confirm Action'"
      :min-height="'200px'"
      :min-width="'40vw'"
      :position="'fixed'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">Are you sure you want to delete?</div>
      <template slot="footer">
        <ConfirmationButtons
          :disabled="lessonFaqApi.loading"
          @on-cancel="closeModal"
          @on-confirm="deleteFaq"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
import LessonFaqCreateEditForm from "@/components/AF/Courses/CourseContent/CourseLesson/LessonFaq/LessonFaqCreateEditForm.vue";
import LessonFaqList from "@/components/AF/Courses/CourseContent/CourseLesson/LessonFaq/LessonFaqList.vue";
import NoRecordFound from "@/components/Misc/Admin/NoRecordFound.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import {
  createLessonFaq,
  getLessonFaqList,
  updateLessonFaq,
  deleteLessonFaq,
} from "@/services/AF/afLessonFaqService";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import { mapGetters } from "vuex";

export default {
  name: "LessonFaq",
  components: {
    LessonFaqCreateEditForm,
    LessonFaqList,
    NoRecordFound,
    Modal,
    SearchWithButton,
    ConfirmationButtons,
  },
  mixins: [apiMixin],
  props: {
    lessonId: { type: Number },
  },
  data() {
    return {
      modalMode: "",
      searchText: "",
      selectedFaq: null,
      showLessonFaqCreateForm: false,
      lessonFaqApi: getApiState(),
    };
  },
  computed: {
    ...mapGetters({
      hasEntityChanged: "course/getHasEntityChanged",
      isCreatingEditingLessonFaq: "course/getIsCreatingEditingLessonFaq",
    }),
  },
  watch: {
    lessonId() {
      this.searchText = "";
      this.init();
      this.showLessonFaqCreateForm = false;
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(this.lessonFaqApi, () =>
        getLessonFaqList(this.lessonId, this.searchText)
      );
      this.showLessonFaqCreateForm = false;
      this.$store.dispatch("course/setHasEntityChanged", false);
      this.$store.dispatch("course/setIsCreatingEditingLessonFaq", false);
    },
    async onSubmit(data) {
      await this.$postApiData(this.lessonFaqApi, () =>
        createLessonFaq({ ...data, lesson_id: this.lessonId })
      );
      if (this.lessonFaqApi.error) return;
      this.init();
    },
    async onUpdate(data) {
      await this.$postApiData(this.lessonFaqApi, () =>
        updateLessonFaq(data.id, data)
      );
      if (this.lessonFaqApi.error) return;
      this.init();
    },
    startDeleting(faq) {
      this.selectedFaq = faq;
      this.openModal("deleteFaq");
    },
    async deleteFaq() {
      await this.$postApiData(this.lessonFaqApi, () =>
        deleteLessonFaq(this.selectedFaq.id)
      );
      if (this.lessonFaqApi.error) return;
      this.closeModal();
      this.init();
    },
    toggleLessonFaqCreateForm() {
      if (
        this.hasEntityChanged &&
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      )
        return;
      this.$store.dispatch("course/setHasEntityChanged", false);
      this.$store.dispatch(
        "course/setIsCreatingEditingLessonFaq",
        !this.showLessonFaqCreateForm
      );

      this.showLessonFaqCreateForm = !this.showLessonFaqCreateForm;
    },
    handleSearch(searchText) {
      if (searchText == this.searchText) return;
      this.searchText = searchText;
      this.init();
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
      this.selectedFaq = null;
    },
  },
};
</script>
