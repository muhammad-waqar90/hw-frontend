<template>
  <section class="container">
    <div
      v-for="lesson in altLessons"
      :key="lesson.id"
      class="row align-items-center border-top py-3 mt-2 ps-md-4 ps-lg-5"
    >
      <div
        class="col-12 col-md-8 order-2 order-md-1 text-center text-md-start px-5 px-md-3"
      >
        <div class="w-100" :class="{ fadedTitle: !lesson.expanded }">
          <span
            class="d-block h5 font-weight-600 text-gray mb-0"
            :class="{ truncate: !lesson.expanded }"
          >
            {{ lesson.order_id }} - {{ lesson.name }}
          </span>
        </div>
      </div>
      <div class="col-12 col-md-3 order-2 my-2 my-md-0">
        <ProgressBar
          v-if="!lesson.expanded && !$isMobile"
          :progress="lesson.progress"
        />
        <ProgressBar v-if="$isMobile" :progress="lesson.progress" />
      </div>
      <div
        class="col-12 col-md-1 order-1 order-md-3 text-end"
        :class="{ 'max-icon-width': !$isMobile }"
      >
        <span class="chevron" @click="onLessonExpand(lesson.id)">
          <ChevronUpBox v-if="lesson.expanded" :size="$isPhone ? 25 : 30" />
          <ChevronDownBox v-else :size="$isPhone ? 25 : 30" />
        </span>
      </div>
      <div v-if="lesson.expanded" class="col-12 order-4 mt-3">
        <LessonCard
          v-if="lesson.expanded"
          :lesson="lesson"
          :module-id="moduleId"
        />
      </div>
    </div>
  </section>
</template>

<script>
import ChevronUpBox from "vue-material-design-icons/ChevronUpBox";
import ChevronDownBox from "vue-material-design-icons/ChevronDownBox";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import LessonCard from "@/components/IU/Lessons/LessonCard";
import ProgressBar from "@/components/Misc/ProgressBar";

export default {
  name: "LessonList",

  components: {
    ProgressBar,
    LessonCard,
    ChevronUpBox,
    ChevronDownBox,
  },

  mixins: [devicesMixin],

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
    onLessonExpand(id) {
      this.altLessons = this.altLessons.map((lesson) => {
        if (lesson.id === id) {
          lesson.expanded = !lesson.expanded;
        }
        return lesson;
      });
    },
    findInAltLessons(lesson) {
      if (!this.altLessons) return null;
      return this.altLessons.find((item) => lesson.id === item.id);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.max-icon-width {
  max-width: 62px;
}
.chevron {
  position: static;
  color: #d1d5df;
  text-align: center;
  cursor: pointer;
}

@media (max-width: $tabletWidth) {
  .chevron {
    position: absolute;
    right: 15px;
  }
}
</style>
