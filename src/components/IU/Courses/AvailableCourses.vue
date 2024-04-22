<template>
  <article class="font-montserrat rounded-card bg-white mt-3 p-4">
    <div class="d-flex justify-content-between pb-4">
      <h4 class="text-dark-gray font-weight-600 mb-0">
        {{ $t("iu.course.availableCourses") }}
      </h4>
      <router-link
        :to="{ name: 'iu-courses-available' }"
        :class="{
          'disabled-link': !courses?.length,
        }"
      >
        <button
          class="btn blue-btn btn-font font-weight-600 rounded-card h-100 px-3 py-0"
        >
          ALL
        </button>
      </router-link>
    </div>

    <div v-if="loading && courses?.length == 0" class="py-md-3">
      <LoadingAvailableCourse :number-of-items="$isMobile ? 1 : 2" />
    </div>

    <section
      v-else-if="courses && courses?.length"
      class="row position-relative scrollbar-blue overflow-auto px-3"
      :class="$isPhone ? 'small-course-list' : 'course-list'"
    >
      <div
        v-for="course in courses"
        :key="course.id"
        class="col-4 px-0 pe-3 d-flex mt-4"
        :class="$isPhone ? 'col-11' : 'col-4'"
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
  max-height: calc(100vh - 200px);
}
.small-course-list {
  overflow-y: auto;
  max-height: calc(100vh - 320px);
}
</style>
