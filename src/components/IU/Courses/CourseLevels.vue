<template>
  <div class="container bg-light-gray py-4 px-4">
    <div class="row g-0 mt-2">
      <div class="col px-lg-0">
        <LevelList
          :course-levels="courseLevels"
          @level-change="onLevelChange"
        />
      </div>

      <div v-if="!isPreview" class="col-auto px-2">
        <AttemptQuizButtons
          v-if="levelData.has_quiz && levelData.progress != 100"
          :progress="levelData.progress"
          :entity-id="levelData.id"
          :start-exam-text="$t('iu.quiz.levelExam')"
          :color="examBtnColor"
          class="col-auto px-4 py-1 font-exam-btn"
          @on-start-quiz="handleQuizAttempt"
        />
      </div>
    </div>
  </div>
</template>

<script>
import LevelList from "@/components/IU/Courses/LevelList";
import AttemptQuizButtons from "@/components/IU/Quizzes/AttemptQuizButtons.vue";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import {
  MIN_PROGRESS_TO_ACCESS_QUIZ,
  COMPLETED_PROGRESS,
} from "@/dataObject/userProgressData";

export default {
  components: {
    LevelList,
    AttemptQuizButtons,
  },

  mixins: [devicesMixin],

  props: {
    course: { type: Object },
    levelData: { type: Object },
    courseLevels: { type: Array },
    isPreview: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    examBtnColor() {
      if (this.levelData.progress == COMPLETED_PROGRESS) return "green";
      else if (this.levelData.failed_quiz) return "red";
      else if (
        this.levelData.progress >= MIN_PROGRESS_TO_ACCESS_QUIZ &&
        this.levelData.progress < COMPLETED_PROGRESS
      )
        return "blue";
      else return "light-gray";
    },
  },

  methods: {
    onLevelChange(value) {
      this.$emit("level-change", value);
    },
    handleQuizAttempt(data) {
      this.$router.push({
        name: "iu-level-quiz-attempt",
        params: { courseId: this.course.id, courseLevelId: data },
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.bg-light-gray {
  background-color: $lightgray;
}
.font-exam-btn {
  font-size: 13px;
}
</style>
