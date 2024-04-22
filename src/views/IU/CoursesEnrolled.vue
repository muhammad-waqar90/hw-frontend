<template>
  <section>
    <CommonCourses
      class="mb-4"
      :courses="enrolledCoursesApi.data"
      :loading="enrolledCoursesApi.loading"
      title="enrolled"
      type="enrolled"
      @on-scroll-end="loadMore"
    />
  </section>
</template>

<script>
import CommonCourses from "@/components/IU/Courses/CommonCourses";

import { getOwnedCoursesService } from "@/services/iuService";

import apiMixin, { getApiState } from "@/mixins/apiMixin";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";

export default {
  name: "CoursesEnrolled",

  components: {
    CommonCourses,
  },

  mixins: [toastMixin, devicesMixin, apiMixin, backButtonMixin],

  data() {
    return {
      enrolledCoursesApi: getApiState([]),
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(
        this.enrolledCoursesApi,
        () => getOwnedCoursesService(),
        []
      );
    },
    loadMore() {
      this.$fetchNextPageApi(this.enrolledCoursesApi);
    },
  },
};
</script>
