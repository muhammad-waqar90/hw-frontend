<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="row py-4">
        <div class="col-md-9">
          <h3>Course ({{ course.name }}) - Edit</h3>
        </div>
        <div class="col-md-3">
          <div class="me-2">
            <h5>
              Enrolled Users: <b> {{ courseHasUsersEnrolled }} </b>
            </h5>
          </div>
          <CourseStatusActions
            v-if="showEdit && $isAbleToUpdateCourseStatus"
            :id="course.id"
            :name="course.name"
            :course-status="course.status"
          />
        </div>
      </div>
      <CourseTabs mode="edit" :tab="tab" @set-tab="setTab" />
      <div class="py-3">
        <CourseCreateEdit
          v-if="showEdit"
          v-show="isTab('course_info')"
          mode="edit"
          :course="course"
          :is-submitting="isSubmitting"
          :is-allow-add-delete="isAllowAddDelete"
          @on-save="updateCourse"
          @on-change="hasChanged"
          @on-delete="startDeletingCourse"
        />
        <CourseContent
          v-if="showEdit"
          v-show="isTab('course_content')"
          :course="course"
          :is-allow-add-delete="isAllowAddDelete"
          @reload="reload"
        />
        <CourseExam
          v-if="showEdit"
          v-show="isTab('course_exam')"
          :course-id="course.id"
          :is-allow-add-delete="isAllowAddDelete"
        />
        <CourseDiscounts
          v-if="showEdit"
          v-show="isTab('course_discount')"
          mode="edit"
          :course="course"
          :is-allow-add-delete="isAllowAddDelete"
        />
      </div>
      <Modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete course
          <b>"{{ selectedCourse.name }}"</b>? <br />
          Complete course will be deleted along with
          <b>{{ selectedCourse.course_levels_count }}</b> level(s) and all
          content of the levels (modules/lectures)
        </div>
        <template slot="footer">
          <ConfirmationButtonsWithInput
            :name="selectedCourse.name"
            :placeholder="
              'Please type the course name for confirming the delete action e.g ' +
              selectedCourse.name
            "
            :is-submitting="isSubmitting"
            loading-label="Deleting..."
            @on-confirm="deleteCourse"
          />
        </template>
      </Modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CourseStatusActions from "@/components/AF/Courses/CourseStatusActions.vue";
import CourseTabs from "@/components/AF/Courses/CourseTabs.vue";
import CourseCreateEdit from "@/components/AF/Courses/CourseInfo/CourseCreateEdit.vue";
import CourseContent from "@/components/AF/Courses/CourseContent/CourseContent.vue";
import CourseExam from "@/components/AF/Courses/BulkImport/CourseExam.vue";
import CourseDiscounts from "@/components/AF/Courses/CourseDiscount/CourseDiscounts.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";
import { mapGetters } from "vuex";
import { COMING_SOON, DRAFT } from "@/dataObject/courses/coursesStatusData";
import {
  getCourse,
  updateCourse,
  deleteCourse,
} from "@/services/AF/afCourseService";
import courseVuexModule from "@/store/modules/af/course";
import permissionsMixin from "@/mixins/AF/permissionsMixin";

export default {
  name: "AFCourseEdit",
  components: {
    CourseStatusActions,
    CourseTabs,
    CourseCreateEdit,
    CourseContent,
    CourseExam,
    Modal,
    ConfirmationButtonsWithInput,
    CourseDiscounts,
  },
  mixins: [toastMixin, permissionsMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasCourseChanged || this.hasEntityChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },

  data() {
    return {
      tab: "course_info",
      hasCourseChanged: false,
      showEdit: false,
      course: {},
      courseHasUsersEnrolled: null,
      selectedCourse: {},
      modalMode: "",
      isSubmitting: false,
      DRAFT,
    };
  },
  computed: {
    ...mapGetters({
      hasEntityChanged: "course/getHasEntityChanged",
    }),

    isAllowAddDelete() {
      return (
        this.course?.status === DRAFT.value ||
        this.course?.status === COMING_SOON.value
      );
    },
  },
  beforeCreate() {
    this.$store.registerModule("course", courseVuexModule);
  },

  mounted() {
    this.init();
  },
  destroyed() {
    this.$store.dispatch("course/clear");
    this.$store.unregisterModule("course");
  },

  methods: {
    async init() {
      let response = await getCourse(this.$route.params.id);

      if (response.error) return this.$displayError(response);
      this.course = response.course;
      this.courseHasUsersEnrolled = response.courseHasUsersEnrolled;
      this.$store.dispatch(
        "course/setIsAllowAddDelete",
        this.course?.status === DRAFT.value ||
          this.course?.status === COMING_SOON.value
      );
      this.showEdit = true;
    },
    async updateCourse(data) {
      this.isSubmitting = true;
      let response = await updateCourse(this.$route.params.id, data);
      this.isSubmitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasCourseChanged = false;
      this.init();
    },
    startDeletingCourse(item) {
      this.selectedCourse = item;
      this.openModal("delete");
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
      this.selectedCourse = {};
    },
    async deleteCourse() {
      this.isSubmitting = true;
      const response = await deleteCourse(this.selectedCourse.id);
      this.isSubmitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.closeModal();
      this.hasCourseChanged = false;
      this.$router.push({ name: "af-courses" });
    },
    hasChanged(key, value) {
      this.hasCourseChanged = this.course[key] != value;
    },
    isTab(item) {
      return this.tab === item;
    },
    setTab(item) {
      if (Object.keys(this.$route.query).length !== 0) this.$router.replace({});
      this.tab = item;
    },
    reload() {
      this.init();
    },
  },
};
</script>
