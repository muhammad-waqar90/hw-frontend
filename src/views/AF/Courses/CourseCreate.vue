<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3>Course - Create</h3>
      </div>
      <CourseTabs mode="create" :tab="tab" @set-tab="setTab" />
      <div class="py-3">
        <CourseCreateEdit
          v-show="isTab('course_info')"
          :is-submitting="isSubmitting"
          @on-save="createCourse"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CourseTabs from "@/components/AF/Courses/CourseTabs.vue";
import CourseCreateEdit from "@/components/AF/Courses/CourseInfo/CourseCreateEdit.vue";
import { createCourse } from "@/services/AF/afCourseService";

export default {
  name: "AFCourseCreate",
  components: {
    CourseTabs,
    CourseCreateEdit,
  },
  mixins: [toastMixin],
  beforeRouteLeave(to, from, next) {
    if (this.hasChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },
  data() {
    return {
      tab: "course_info",
      hasChanged: false,
      isSubmitting: false,
    };
  },
  methods: {
    isTab(item) {
      return this.tab === item;
    },
    setTab(item) {
      if (Object.keys(this.$route.query).length !== 0) this.$router.replace({});
      this.tab = item;
    },
    async createCourse(data) {
      this.isSubmitting = true;
      let response = await createCourse(data);

      if (response.error) {
        this.isSubmitting = false;
        return this.$displayError(response);
      }
      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({
        name: "af-course-edit",
        params: { id: response.course_id },
      });
    },
  },
};
</script>
