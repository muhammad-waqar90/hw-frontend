<template>
  <section class="container">
    <LessonCard v-for="lesson in lessons" :key="lesson.id" :lesson="lesson" />
  </section>
</template>

<script>
import LessonCard from "@/components/IU/Lessons/LessonCard";

export default {
  name: "LessonList",

  components: {
    LessonCard,
  },

  props: {
    lessons: { type: Array },
    moduleId: { type: Number },
    isPreview: { type: Boolean },
  },

  data() {
    return {
      altLessons: null,
    };
  },

  watch: {
    lessons() {
      this.altLessons = this.lessons.map((item) => {
        const altLesson = this.findInAltLessons(item);
        if (altLesson) item.expanded = altLesson.expanded;
        return item;
      });
    },
  },

  mounted() {
    this.altLessons = this.lessons;
  },

  methods: {
    findInAltLessons(lesson) {
      if (!this.altLessons) return null;
      return this.altLessons.find((item) => lesson.id === item.id);
    },
  },
};
</script>
