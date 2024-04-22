<template>
  <div class="container-fluid mt-2">
    <div v-for="item in list" :key="item.id" class="mt-1">
      <LessonFaqListItem
        :item="item"
        :is-submitting="isSubmitting"
        @on-update="onUpdate"
        @on-delete="onDelete"
      />
    </div>
  </div>
</template>

<script>
import LessonFaqListItem from "@/components/AF/Courses/CourseContent/CourseLesson/LessonFaq/LessonFaqListItem.vue";

export default {
  name: "LessonFaqList",
  components: {
    LessonFaqListItem,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onDelete(faq) {
      this.$emit("on-delete", faq);
    },
    onUpdate(faq) {
      this.$emit("on-update", faq);
    },
  },
};
</script>
