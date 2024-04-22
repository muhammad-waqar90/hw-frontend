<template>
  <div class="d-flex mt-1">
    <div class="d-flex">
      <select v-model="selectedCourseStatus" class="form-select">
        <option v-for="item in statuses" :key="item.value" :value="item.value">
          {{ item.name }}
        </option>
      </select>
    </div>
    <div class="d-flex action-buttons mr-4">
      <button
        v-if="id"
        :disabled="selectedCourseStatus === courseStatus"
        class="btn btn-success mx-2"
        @click="onConfirmStatus"
      >
        CONFIRM
      </button>
    </div>

    <Modal
      v-if="modalMode == 'changeStatus'"
      :title="
        validateCourseApi.loading ? 'Validating Course...' : 'Confirm Action'
      "
      :min-height="'300px'"
      @close-modal="onCloseModal"
    >
      <div class="row mb-5">
        <div class="col-12">
          <ValidateEntity
            :validate="selectedCourseStatus === published.value"
            :loading="validateCourseApi.loading"
            :loading-message="'Validating all available lectures have quiz...'"
            :data="lessonsHaveNoQuiz"
            :data-message="'Following lectures have no quizzes:'"
            :success-message="'All available lectures have quiz'"
          />
          <div class="row mt-3">
            <div v-if="!validateCourseApi.loading" class="col-12">
              <div class="w-100 h5">
                Are you sure you want <b>{{ selectedCourseStatusName }}</b> the
                <b>"{{ name }}" </b> course?
              </div>
            </div>
          </div>
        </div>
      </div>
      <template slot="footer">
        <ConfirmationButtonsWithInput
          :name="name"
          :placeholder="
            'Type course name for confirmation of action e.g ' + name
          "
          :is-submitting="api.loading"
          @on-confirm="handleStatusChange"
        />
      </template>
    </Modal>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import {
  DRAFT,
  PUBLISHED,
  UNPUBLISHED,
  COMING_SOON,
} from "@/dataObject/courses/coursesStatusData";
import {
  draftCourse,
  publishCourse,
  unpublishCourse,
  markCourseAsComingSoon,
  validateCourse,
} from "@/services/AF/afCourseService";
import ValidateEntity from "@/components/Misc/Admin/ValidateEntity.vue";

export default {
  name: "CourseStatusActions",
  components: {
    Modal,
    ConfirmationButtonsWithInput,
    ValidateEntity,
  },
  mixins: [apiMixin, toastMixin],
  props: {
    id: { type: Number },
    name: { type: String },
    courseStatus: { type: Number },
  },
  data() {
    return {
      modalMode: "",
      selectedCourseStatus: this.courseStatus,
      statuses: [DRAFT, COMING_SOON, UNPUBLISHED, PUBLISHED],
      lessonsHaveNoQuiz: null,
      published: PUBLISHED,
      api: getApiState(),
      validateCourseApi: getApiState(),
    };
  },
  computed: {
    updateCourseStatusService() {
      return (
        (this.selectedCourseStatus === DRAFT.value && draftCourse) ||
        (this.selectedCourseStatus === PUBLISHED.value && publishCourse) ||
        (this.selectedCourseStatus === UNPUBLISHED.value && unpublishCourse) ||
        (this.selectedCourseStatus === COMING_SOON.value &&
          markCourseAsComingSoon)
      );
    },
    selectedCourseStatusName() {
      return (
        (this.selectedCourseStatus === DRAFT.value && DRAFT.name) ||
        (this.selectedCourseStatus === PUBLISHED.value && PUBLISHED.name) ||
        (this.selectedCourseStatus === UNPUBLISHED.value && UNPUBLISHED.name) ||
        (this.selectedCourseStatus === COMING_SOON.value && COMING_SOON.name)
      );
    },
  },
  methods: {
    async onConfirmStatus() {
      this.modalMode = "changeStatus";

      if (this.selectedCourseStatus === PUBLISHED.value) {
        await this.$fetchApiData(this.validateCourseApi, () =>
          validateCourse(this.id)
        );
        if (this.validateCourseApi.error) return;

        this.lessonsHaveNoQuiz =
          this.validateCourseApi.data?.lessons_have_no_quiz;
      }
    },
    async handleStatusChange() {
      await this.$postApiData(this.api, () =>
        this.updateCourseStatusService(this.id)
      );

      if (this.api.error) return;

      this.$router.push({ name: "af-courses" });
    },
    onCloseModal() {
      this.modalMode = "";
      this.selectedCourseStatus = this.courseStatus;
      this.lessonsHaveNoQuiz = null;
    },
  },
};
</script>
