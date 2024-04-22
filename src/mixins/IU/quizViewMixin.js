import { generateEntityParentTree } from "@/utils/courseUtils";

import toastMixin from "@/mixins/toastMixin";
import metaTagsUpdateMixin from "@/mixins/Misc/metaTagsUpdateMixin";

export default {
  mixins: [toastMixin, metaTagsUpdateMixin],
  data() {
    return {
      loading: true,
      display404: false,
      courseId: "",
      entityId: "",
      questions: "",
      duration: "",
      startedAt: "",
      numOfQuestions: "",
      quizStarted: false,
      hierarchyTree: "",
      entity: "",
      uuid: "",
    };
  },
  methods: {
    async init() {
      this.courseId = this.$route.params.courseId;
      this.entityId = this.$route.params[this.entityName];
      if (
        JSON.parse(localStorage.getItem("handleLastMomentExamReloading")) &&
        this.entityName == "courseModuleId"
      )
        return this.redirectToQuizAttempt();

      this.quizStarted = true;
      const response = await this.getQuizService(this.courseId, this.entityId);
      if (response.error) return this.handleResponseError(response);

      this.handleSuccess(response);
      this.loading = false;
    },
    handleResponseError(response) {
      if (response.status === 404) return (this.display404 = true);

      this.$displayServerResponse(response);
      this.redirectToQuizAttempt();
    },
    handleSuccess(response) {
      const { questions, duration, started_at, num_of_questions, uuid } =
        response.quiz;

      this.questions = questions;
      this.duration = duration;
      (this.startedAt = started_at), (this.numOfQuestions = num_of_questions);
      this.uuid = uuid;

      this.entity = response.entity;
      this.hierarchyTree = generateEntityParentTree(response.entity);

      this.$updateMeta(`Quiz - ${this.entity.hierarchy_name}`);
    },
    handleExpiredTime(data) {
      this.submitQuiz(data);
      // this.redirectToQuizAttempt();
      // this.$emit("stop-quiz");
    },
    async submitQuiz(data, redirect = true) {
      const response = await this.submitQuizService(
        this.courseId,
        this.entityId,
        { answers: data }
      );
      if (response.error) {
        this.$emit("stop-quiz");
        return this.handleError(response, redirect);
      }

      if (redirect) this.redirectToQuizAttempt();

      this.$emit("stop-quiz");
    },
    redirectToQuizAttempt() {
      const params = { courseId: this.courseId };
      params[this.entityName] = this.entityId;
      this.$router.replace({ name: this.previousQuizAttemptRoute, params });
      if (this.entityName == "courseModuleId")
        localStorage.setItem("handleLastMomentExamReloading", false);
    },
    handleError(response, redirect) {
      this.$displayError(response);
      if (response.status === 403)
        return this.$router.replace({
          name: "iu-course",
          params: { id: this.courseId },
        });
      if (response.status === 422) return this.$emit("stop-quiz");
      if (redirect) return this.redirectToQuizAttempt();
    },
  },
};
