<template>
  <PageBackButton @on-back="handleOnBack">
    <template #buttons>
      <span v-if="lesson.has_ebook" class="text-dark" @click="handleEbookClick">
        <BookOpenOutline :size="36" />
      </span>
      <router-link
        v-if="lesson.has_quiz"
        :to="{
          name: 'iu-lesson-quiz-attempt',
          params: {
            courseId: courseId,
            lessonId: lesson.id,
          },
        }"
        class="text-dark"
        :disabled="!quizButtonEnabled"
        :class="{ disabled: !quizButtonEnabled }"
      >
        <School :size="38" />
      </router-link>
    </template>
  </PageBackButton>
</template>

<script>
import PageBackButton from "@/components/Misc/BackButtons/PageBackButton";
import BookOpenOutline from "vue-material-design-icons/BookOpenBlankVariant";
import School from "vue-material-design-icons/School";

export default {
  name: "LessonMobilePageButtons",

  components: { PageBackButton, BookOpenOutline, School },

  props: {
    lesson: {
      type: Object,
      default: () => {},
    },

    quizButtonEnabled: {
      type: Boolean,
      default: false,
    },

    courseId: {
      type: [String, Number],
      default: null,
    },
  },

  methods: {
    handleOnBack() {
      this.$emit("on-back");
    },

    handleEbookClick() {
      this.$emit("on-ebook");
    },
  },
};
</script>
