<template>
  <section v-if="!loading && !display404" class="font-montserrat">
    <CourseOwned
      v-if="!isPreview"
      :course="course"
      :modules="modules"
      :category="category"
      :course-levels="courseLevels"
      :parent-category-tree="parentCategoryTree"
      :progress="progress"
      :level-data="levelData"
      :loading-level="loadingLevel"
      @level-change="onLevelChange"
    />
    <CoursePreview
      v-else
      :course="course"
      :modules="modules"
      :category="category"
      :course-levels="courseLevels"
      :parent-category-tree="parentCategoryTree"
      :loading-level="loadingLevel"
      @level-change="onLevelChange"
    />
  </section>

  <section v-else-if="display404">
    <SomethingWrong />
  </section>
</template>

<script>
import {
  getCourseService as iuGetCourseService,
  getCourseLevelService as iuGetCourseLevelService,
} from "@/services/iuService";
import {
  getCourseService as guGetCourseService,
  getCourseLevelService as guGetCourseLevelService,
} from "@/services/GU/guCourseService";

import { generateParentCategoryTree } from "@/utils/categoryUtils";

import CourseOwned from "@/components/IU/Courses/CourseOwned";
import CoursePreview from "@/components/IU/Courses/CoursePreview";
import SomethingWrong from "@/views/SomethingWrong.vue";

import toastMixin from "@/mixins/toastMixin";
import userRoleMixin from "@/mixins/User/userRoleMixin";
import metaTagsUpdateMixin from "@/mixins/Misc/metaTagsUpdateMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";

export default {
  name: "Course",

  components: { CoursePreview, CourseOwned, SomethingWrong },

  mixins: [toastMixin, userRoleMixin, metaTagsUpdateMixin, backButtonMixin],

  data() {
    return {
      id: this.$route.params.id,
      loading: true,
      loadingLevel: false,
      course: {},
      modules: [],
      category: {},
      parentCategoryTree: [],
      display404: false,
      isPreview: true,
      progress: null,
      showModuleExams: false,
      showYearExams: false,
      level: 1,
      levelData: {},
      courseLevels: [],
    };
  },
  computed: {
    getCourseService() {
      return this.$userIsGU ? guGetCourseService : iuGetCourseService;
    },
    getCourseLevelService() {
      return this.$userIsGU ? guGetCourseLevelService : iuGetCourseLevelService;
    },
  },

  mounted() {
    //so that this view properly works with hot reloading in development env
    if (process.env.NODE_ENV == "development") this.init();
  },

  activated() {
    this.init();
  },

  methods: {
    async init() {
      this.id = this.$route.params.id;
      const response = await this.getCourseService(this.id);
      if (response.error) return this.handleCourseErr(response);

      this.handleCourseRes(response);
      this.loading = false;
    },

    handleCourseRes(response) {
      // course
      const {
        course_level,
        course_levels,
        category_with_recursive_parents,
        preview,
        progress,
        ...courseData
      } = response;
      const { course_modules, ...levelData } = course_level;

      this.course = courseData;
      this.progress = progress;
      this.isPreview = preview ? preview : false;
      this.courseLevels = course_levels;

      // parent categories
      const { parent_categories_recursive, ...categoryData } =
        category_with_recursive_parents;
      this.category = { id: categoryData.id, name: categoryData.name };
      this.parentCategoryTree = generateParentCategoryTree(
        category_with_recursive_parents
      );

      if (this.level && this.level != 1) return this.onLevelChange(this.level);

      this.modules = course_modules;
      this.levelData = levelData;
      this.level = levelData.value;

      this.$updateMeta(this.course.name);
    },

    async onLevelChange(level) {
      if (this.level !== level) this.loadingLevel = true;

      const response = await this.getCourseLevelService(this.course.id, level);
      if (response.error) return this.$displayError(response);

      const { course_modules, ...levelData } = response;
      this.modules = course_modules;
      this.level = levelData.value;
      this.levelData = levelData;

      this.loadingLevel = false;
    },

    handleCourseErr(response) {
      this.$displayError(response);

      if (response.status === 404) return (this.display404 = true);
      if (response.status == 403)
        return this.$router.replace({ name: "homepage" });
    },
  },
};
</script>
