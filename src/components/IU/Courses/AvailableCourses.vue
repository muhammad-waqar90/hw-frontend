<template>
  <article class="font-montserrat rounded-card bg-white mt-3 p-4">
    <div
      class="d-flex justify-content-between"
      :class="$isPhone || $isTablet ? 'pb-2' : 'pb-4'"
    >
      <h4 class="text-dark-gray font-weight-600 mb-0">
        {{ $t("iu.course.availableCourses") }}
      </h4>
      <router-link
        :to="{ name: 'iu-courses-available' }"
        class="height-25"
        :class="{
          'disabled-link': !courses?.length,
        }"
      >
        <button
          class="btn blue-btn btn-font font-weight-600 rounded-card h-100 px-3 py-0 word-break-normal"
        >
          ALL
        </button>
      </router-link>
    </div>

    <div v-if="loading && courses?.length == 0" class="py-md-3">
      <LoadingCourse />
    </div>

    <section
      v-else-if="courses && courses?.length"
      class="row position-relative scrollbar-blue overflow-auto px-3"
      :class="$isPhone ? 'small-course-list' : 'course-list'"
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
        <CourseCard type="default" :course="course" @add-to-cart="addToCart" />
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="onScrollEnd"
        :custom-css="observerCustomCss"
      />
    </section>
    <section
      v-else-if="courses && !courses?.length"
      class="d-flex flex-column justify-content-center align-items-center px-1 px-md-5 pt-3 pb-2 mb-2"
    >
      <img class="w-75 px-5" src="/img/online_presentation.png" alt="" />
      <h5 class="h5 mt-4 text-dark-gray text-center">
        {{ $t("iu.course.noAvailable") }}
      </h5>
    </section>
  </article>
</template>

<script>
import CourseCard from "@/components/IU/Courses/CourseCard.vue";
import LoadingCourse from "@/components/IU/Courses/LoadingCourse";
import Observer from "@/components/Misc/Observer";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    CourseCard,
    LoadingCourse,
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
  },

  data() {
    return {
      showObserver: true,
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
    };
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

.btn-font {
  font-size: 12px;
}
.course-list {
  overflow-y: auto;
  max-height: calc(100vh - 195px);
}
.small-course-list {
  overflow-y: auto;
  max-height: calc(100vh - 320px);
}
</style>
