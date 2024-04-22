<template>
  <div>
    <div class="text-end pe-2">
      <button
        v-if="canUploadQuiz"
        :class="
          showQuizUploadForm
            ? 'btn btn-light border text-gray'
            : 'btn blue-btn rounded-card px-4 font-weight-600'
        "
        @click="toggleQuizUploadForm"
      >
        {{ showQuizUploadForm ? "x" : "UPLOAD QUIZ" }}
      </button>
      <ButtonWithTooltip
        v-else
        :disabled="true"
        label="UPLOAD QUIZ"
        message="Previous import is still being processed"
        btn-class="btn blue-btn rounded-card px-4 font-weight-600"
      />
    </div>

    <BulkImportForm
      v-if="showQuizUploadForm"
      :entity="entity"
      :latest-import="getQuizApi?.data"
      :is-submitting="getQuizApi.loading"
      @on-submit="submit"
    />

    <div class="h-100 py-4">
      <BulkImportTable
        v-if="importQuizApi?.data?.length"
        :imports="importQuizApi.data"
        :is-submitting="importQuizApi.loading"
        :entity="entity"
        :custom-css-class="examItemCustomClass"
        @on-reload-status="onReloadStatus"
      />
      <NoRecordFound
        v-else
        :loading="importQuizApi.loading"
        message="No lecture quiz uploaded yet"
      />

      <Observer
        v-if="showObserver"
        :on-observed="onScrollEnd"
        :custom-css="observerCustomCss"
      />
    </div>
  </div>
</template>

<script>
import BulkImportForm from "@/components/AF/Courses/BulkImport/BulkImportForm.vue";
import BulkImportTable from "@/components/AF/Courses/BulkImport/BulkImportTable.vue";
import NoRecordFound from "@/components/Misc/Admin/NoRecordFound.vue";
import Observer from "@/components/Misc/Observer";
import toastMixin from "@/mixins/toastMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";
import { getLessonQuiz } from "@/services/AF/afQuizService.js";
import {
  COMPLETED,
  FAILED,
} from "@/dataObject/bulkImport/bulkImportStatusData.js";

import {
  importLessonQuiz,
  getImportLessonQuizzes,
} from "@/services/AF/afBulkImportService.js";

export default {
  name: "LessonQuiz",
  components: {
    BulkImportForm,
    BulkImportTable,
    NoRecordFound,
    Observer,
    ButtonWithTooltip,
  },
  mixins: [apiMixin, toastMixin],
  props: {
    courseId: { type: Number },
    levelId: { type: Number },
    courseModuleId: { type: Number },
    lessonId: { type: Number },
    entity: { type: String },
  },
  computed: {
    canUploadQuiz() {
      return this.importQuizApi?.data?.length
        ? this.importQuizApi?.data[0]?.status == COMPLETED ||
            this.importQuizApi?.data[0]?.status == FAILED
        : true;
    },
  },
  data() {
    return {
      importQuizApi: getApiState(),
      getQuizApi: getApiState(),
      showQuizUploadForm: false,
      showObserver: true,
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
      examItemCustomClass: "bg-gray",
      FAILED,
      COMPLETED,
    };
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
      this.showQuizUploadForm = false;
      await this.$fetchApiData(this.importQuizApi, () =>
        getImportLessonQuizzes(
          this.courseId,
          this.levelId,
          this.courseModuleId,
          this.lessonId
        )
      );
      await this.$fetchApiData(
        this.getQuizApi,
        () =>
          getLessonQuiz(
            this.courseId,
            this.levelId,
            this.courseModuleId,
            this.lessonId
          ),
        null,
        false
      );
    },
    toggleQuizUploadForm() {
      this.showQuizUploadForm = !this.showQuizUploadForm;
    },
    async submit(data) {
      await this.$postApiData(this.importQuizApi, () =>
        importLessonQuiz(
          this.courseId,
          this.levelId,
          this.courseModuleId,
          this.lessonId,
          data
        )
      );
      if (this.importQuizApi.error) return;
      this.init();
    },
    async onReloadStatus() {
      this.init();
    },
    onScrollEnd() {
      this.$fetchNextPageApi(this.importQuizApi);
    },
  },
};
</script>
