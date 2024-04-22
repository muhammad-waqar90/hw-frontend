import { generateEntityParentTree } from "@/utils/courseUtils";

import toastMixin from "@/mixins/toastMixin";
import metaTagsUpdateMixin from "@/mixins/Misc/metaTagsUpdateMixin";

export default {
  mixins: [toastMixin, metaTagsUpdateMixin],
  data() {
    return {
      previousAttempt: null,
      entity: null,
      processing: false,
      notFound: false,
      hierarchyTree: null,
      quizPreview: null,
      loading: true,
      imageVerification: null,
      examDetails: null,
      profileIncomplete: null,
    };
  },
  computed: {
    alreadyPassed() {
      return this.previousAttempt && this.previousAttempt.has_passed;
    },
  },
  methods: {
    async init() {
      this.courseId = parseInt(this.$route.params.courseId);
      this.entityId = parseInt(this.$route.params[this.entityName]);

      const response = await this.getQuizPreviousService(
        this.courseId,
        this.entityId
      );

      if (response.processing) {
        this.loading = false;
        return this.handleProcessing();
      }

      if (response.inProgress) {
        this.loading = false;
        if (response?.entity?.type == "course_module") {
          localStorage.setItem("handleLastMomentExamReloading", false);
        }
        return this.startQuiz();
      }

      if (response.status == 404) {
        this.loading = false;
        return (this.notFound = true);
      }

      if (response.status == 403) {
        this.loading = false;
        return this.handleForbidden(response);
      }

      this.processing = false;
      this.previousAttempt = response.previousAttempt;
      this.entity = response.entity;
      this.quizPreview = response.quizPreview;
      this.hierarchyTree = generateEntityParentTree(response.entity);
      this.imageVerification = response.imageVerification;
      this.examDetails = response.examDetails;
      this.profileIncomplete = response.profileIncomplete;

      this.loading = false;

      this.$updateMeta(`Quiz Attempt - ${this.entity.hierarchy_name}`);
    },
    handleProcessing() {
      this.processing = true;
      setTimeout(() => {
        this.init();
      }, 5000);
    },
    handleForbidden(response) {
      this.$displayServerResponse(response);
      this.$router.replace({ name: "homepage" });
    },
  },
};
