<template>
  <div>
    <div class="text-muted alert alert-info">
      <b> Bulk Upload: </b>
      <ul>
        <li>
          This feature should be used to upload lesson quizzes or module exam
          questions.
        </li>
      </ul>
    </div>
    <div class="h-100 course-exam-body py-4 px-4 rounded-card">
      <CourseExamUpload
        :is-submitting="importCourseQuizzesApi.loading"
        :is-allow-add-delete="isAllowAddDelete"
        @on-upload="onUpload"
      />
      <BulkImportTable
        v-if="importCourseQuizzesApi?.data?.length"
        :imports="importCourseQuizzesApi.data"
        :is-submitting="importCourseQuizzesApi.loading"
        @on-reload-status="onReloadStatus"
      />
      <NoRecordFound v-else message="No course exam uploaded yet" />
    </div>
    <div
      v-if="
        importCourseQuizzesApi.meta?.links &&
        importCourseQuizzesApi?.data?.length
      "
    >
      <PaginationButtons :links="importCourseQuizzesApi.meta.links" />
    </div>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CourseExamUpload from "@/components/AF/Courses/BulkImport/CourseExamUpload.vue";
import BulkImportTable from "@/components/AF/Courses/BulkImport/BulkImportTable.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import NoRecordFound from "@/components/Misc/Admin/NoRecordFound.vue";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import {
  importCourseQuizzes,
  getImportCourseQuizzes,
} from "@/services/AF/afBulkImportService";

export default {
  name: "CourseExam",
  components: {
    CourseExamUpload,
    BulkImportTable,
    PaginationButtons,
    NoRecordFound,
  },
  mixins: [apiMixin, toastMixin],
  props: {
    courseId: { type: Number },
    isAllowAddDelete: { type: Boolean, default: false },
  },
  data() {
    return {
      importCourseQuizzesApi: getApiState(),
      page: null,
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.page = this.$route.query.page;
      await this.$fetchApiData(this.importCourseQuizzesApi, () =>
        getImportCourseQuizzes(this.courseId, this.page)
      );
    },
    onUpload(uploadedZip) {
      let formData = new FormData();
      formData.append("file", uploadedZip);

      return this.submitZip(formData);
    },
    async submitZip(data) {
      await this.$postApiData(this.importCourseQuizzesApi, () =>
        importCourseQuizzes(this.courseId, data)
      );
      if (this.importCourseQuizzesApi.error) return;
      this.init();
    },
    async onReloadStatus() {
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.course-exam-body {
  background-color: $lightgray;
}
</style>
