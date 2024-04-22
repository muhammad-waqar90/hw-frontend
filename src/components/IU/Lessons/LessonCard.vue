<template>
  <div
    :class="[
      lesson.progress == 100
        ? 'light-green-background'
        : 'light-gray-background',
    ]"
    class="row d-flex flex-column flex-md-row align-items-center rounded-card cursor-pointer p-3 my-3"
    @click="onViewLesson()"
  >
    <div
      class="col"
      :class="[
        lesson.available == false || lesson.published == 0
          ? 'not-available'
          : '',
      ]"
    >
      <h4
        class="text-center text-capitalize text-md-start font-weight-700 color-gray mb-0"
      >
        <span class="text-blue me-3">{{ lesson.order_id }}</span
        >{{ lesson.name }}
      </h4>
    </div>
    <button
      v-if="
        (lesson.progress != 100 && lesson.has_quiz) || lesson.published == 0
      "
      :disabled="lesson.progress == 0 ? true : false"
      class="col-auto btn btn-text rounded-pill text-uppercase font-weight-600 me-0 my-3 my-md-0 px-3"
      :class="[
        lesson.failed_quiz == true
          ? btnColor
          : lesson.progress == 0
          ? 'light-gray-btn'
          : 'blue-btn',
        lesson.available == false ? 'not-available' : '',
      ]"
      @click.stop="startQuiz()"
      v-html="lesson.published == 0 ? comingSoonText : btnText"
    />
    <button
      v-if="lesson.progress == 100 && lesson.has_quiz"
      class="col-auto btn btn-text green-btn rounded-pill text-uppercase font-weight-600 cursor-none me-0 my-3 my-md-0 px-3"
      @click.stop="startQuiz()"
    >
      {{ $t("iu.lesson.passed") }}
    </button>
    <!-- <button class="col-auto btn orange-btn btn-text rounded-pill text-uppercase font-weight-600 px-3" @click="onViewLesson()">
      {{ $t("iu.lesson.playLesson") }}
    </button> -->
    <portal to="out-of-app-content">
      <WarningModal
        v-if="warningModal"
        :with-confirmation-buttons="true"
        :only-confirm="true"
        @close-modal="warningModal = false"
        @on-confirm="closeWarningModal"
      >
        <span slot="body">
          {{ errorMessage }}
        </span>
      </WarningModal>
    </portal>
  </div>
</template>

<script>
import WarningModal from "@/components/Misc/WarningModal";

import toastMixin from "@/mixins/toastMixin";

export default {
  name: "LessonCard",

  components: { WarningModal },

  mixins: [toastMixin],

  props: {
    lesson: Object,
  },

  data() {
    return {
      warningModal: false,
    };
  },

  computed: {
    comingSoonText() {
      return this.$t("iu.lesson.comingSoon");
    },
    btnText() {
      return this.lesson.failed_quiz == true
        ? this.$t("iu.lesson.retakeTest")
        : this.$t("iu.lesson.takeTest");
    },
    btnColor() {
      return this.lesson.failed_quiz == true ? "red-btn" : "green-btn";
    },
    errorMessage() {
      return this.lesson.published == 0
        ? this.$t("iu.lesson.errors.notPublished")
        : this.$t("iu.lesson.errors.notAvailable");
    },
  },

  methods: {
    onViewLesson() {
      this.goToLesson(false);
    },
    startQuiz() {
      this.goToLesson(true);
    },
    goToLesson(quizOpen = false) {
      this.lesson.available && this.lesson.published == 1
        ? this.$router.push({
            name: "iu-lesson",
            params: {
              courseId: this.$route.params.id,
              lessonId: this.lesson.id,
              quizOpen: quizOpen,
            },
          })
        : this.openWarningModal();
    },
    openWarningModal() {
      this.warningModal = true;
    },
    closeWarningModal() {
      this.warningModal = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.btn-text {
  font-size: 10px;
}

.light-gray-background {
  background-color: $lightgray;
}

.light-green-background {
  background-color: $lightgreen;
}

.not-available {
  opacity: 0.4;
}
.cursor-none {
  cursor: unset;
}
</style>
