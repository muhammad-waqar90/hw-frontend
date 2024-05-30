<template>
  <article class="font-montserrat rounded-card bg-white py-2 mb-4 mb-lg-0 px-4">
    <div class="pt-4 px-1">
      <h4 class="font-weight-600 text-dark-gray">
        {{ fullTitle }}
      </h4>
    </div>

    <div v-if="loading && courses.length == 0" class="py-md-3">
      <LoadingAvailableCourse :number-of-items="$isMobile ? 1 : 3" />
    </div>

    <section
      v-else-if="courses && courses.length"
      class="position-relative scrollbar-blue my-3 py-0 px-1"
      :class="$isPhone ? 'row course-list' : 'row overflow-visible'"
    >
      <div
        v-for="course in courses"
        :key="course.id"
        class="px-0 d-flex"
        :class="{
          'col-12 pe-2 mt-2': $isPhone,
          'col-6 pe-3 mt-3': $isTablet,
          'pe-3 col-4 mt-4': !$isPhone && !$isTablet,
        }"
      >
        <CourseCard :type="type" :course="course" @add-to-cart="addToCart" />
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="onScrollEnd"
        :custom-css="observerCustomCss"
      />
    </section>
    <section
      v-else-if="courses && !courses.length"
      class="d-flex flex-column justify-content-center align-items-center px-1 px-md-5 pt-3 pb-2 mb-2"
    >
      <img class="w-75 px-5" src="/img/online_presentation.png" alt="" />
      <h5 class="h5 mt-4 text-dark-gray text-center">
        {{ coursePlaceholder }}
      </h5>
    </section>
    <div v-if="loading && courses.length" class="py-md-3">
      <LoadingAvailableCourse :number-of-items="$isMobile ? 1 : 3" />
    </div>
  </article>
</template>

<script>
import CourseCard from "@/components/IU/Courses/CourseCard";
import LoadingAvailableCourse from "@/components/IU/Courses/LoadingAvailableCourse";
import Observer from "@/components/Misc/Observer";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    CourseCard,
    LoadingAvailableCourse,
    Observer,
  },

  mixins: [devicesMixin],

  props: {
    courses: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
    title: {
      type: String,
    },
    enrolled: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: "default",
    },
  },

  data() {
    return {
      showObserver: true,
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
    };
  },

  computed: {
    fullTitle() {
      if (this.title == "enrolled") return this.$t("iu.course.enrolledCourses");
      if (this.title == "available")
        return this.$t("iu.course.availableCourses");
      if (this.title == "top") return this.$t("iu.course.topCourses");
      if (this.title == "comingSoon")
        return this.$t("iu.course.upcomingCourses");
      return "Courses";
    },
    coursePlaceholder() {
      if (this.title == "enrolled")
        return this.$t("iu.course.noEnrolledAvailable");
      if (this.title == "available") return this.$t("iu.course.noAvailable");
      if (this.title == "top") return this.$t("iu.course.noTopAvailable");
      if (this.title == "comingSoon")
        return this.$t("iu.course.noUpcomingAvailable");
      return this.$t("iu.course.noAvailable");
    },
  },

  watch: {
    courses() {
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
  },

  methods: {
    addToCart(course) {
      this.$emit("add-to-cart", course);
    },
    onScrollEnd() {
      this.$emit("on-scroll-end");
      this.showObserver = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.grid {
  display: grid;
  grid-template-columns: 33.333% 33.333% 33.333%;
  grid-auto-rows: 320px;
  grid-row-gap: 15px;
}
</style>
