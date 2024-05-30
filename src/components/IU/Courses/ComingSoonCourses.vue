<template>
  <article class="font-montserrat rounded-card bg-white py-3">
    <div class="d-flex justify-content-between pt-3 pb-md-2 mb-2">
      <h4 class="text-dark-gray font-weight-600 mb-0 px-3 px-md-4">
        {{ $t("iu.course.upcomingCourses") }}
      </h4>
      <router-link
        :to="{ name: 'iu-courses-coming-soon' }"
        class="height-25"
        :class="{ 'disabled-link': !courses?.length }"
      >
        <button
          class="btn blue-btn btn-font font-weight-600 rounded-card h-100 px-3 py-0 mx-4 word-break-normal"
        >
          ALL
        </button>
      </router-link>
    </div>
    <section class="position-relative pt-md-2 pb-2">
      <div v-if="loading">
        <LoadingCourse />
      </div>
      <Carousel
        v-else-if="courses && courses.length"
        :items="itemsCount"
        :stage-padding="25"
        :dots="false"
        :nav="false"
        :mouse-drag="false"
        :key="itemsCount"
      >
        <template slot="prev">
          <div class="nav-btn shadow-sm prev">
            <ChevronLeftIcon :size="35" />
          </div>
        </template>

        <div v-for="course in courses" :key="course.id" class="pe-3">
          <CourseCard :course="course" type="coming-soon" />
        </div>
        <template slot="next">
          <div
            v-if="courses.length > itemsCount"
            class="nav-btn shadow-sm next"
          >
            <ChevronRightIcon :size="35" />
          </div>
        </template>
      </Carousel>
      <div
        v-else-if="courses && !courses.length"
        class="d-flex flex-column justify-content-center align-items-center px-1 px-md-5 mb-2"
      >
        <img class="w-75 px-5" src="/img/online_presentation.png" />
        <h5 class="h5 mt-4 text-dark-gray text-center">
          {{ $t("iu.course.noUpcomingAvailable") }}
        </h5>
      </div>
    </section>
  </article>
</template>
<script>
import CourseCard from "@/components/IU/Courses/CourseCard.vue";
import LoadingCourse from "@/components/IU/Courses/LoadingCourse.vue";
import Carousel from "vue-owl-carousel";
import ChevronRightIcon from "vue-material-design-icons/ChevronRight.vue";
import ChevronLeftIcon from "vue-material-design-icons/ChevronLeft.vue";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  mixins: [devicesMixin],
  components: {
    CourseCard,
    LoadingCourse,
    Carousel,
    ChevronRightIcon,
    ChevronLeftIcon,
  },
  props: {
    courses: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
  computed: {
    itemsCount() {
      return this.$isPhone ? 1 : this.$isTablet ? 2 : 3;
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.nav-btn {
  position: absolute;
  z-index: 100;
  background-color: $orange;
  color: $static-white;
  border-radius: 10px;
  cursor: pointer;
}

.btn-font {
  font-size: 12px;
}

.prev {
  top: 40%;
  left: 10px;
}

.next {
  top: 40%;
  right: 10px;
}
</style>
