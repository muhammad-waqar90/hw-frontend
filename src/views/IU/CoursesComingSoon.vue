<template>
  <section>
    <CommonCourses
      class="mb-4"
      :courses="comingCoursesApi.data"
      :loading="comingCoursesApi.loading"
      title="comingSoon"
      type="coming-soon"
      @on-scroll-end="loadMore"
    />
  </section>
</template>

<script>
import CommonCourses from "@/components/IU/Courses/CommonCourses.vue";
import { getComingSoonCoursesService } from "@/services/iuService";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";

export default {
  name: "CoursesComingSoon",

  components: {
    CommonCourses,
  },

  mixins: [toastMixin, devicesMixin, apiMixin, backButtonMixin],

  data() {
    return {
      comingCoursesApi: getApiState([]),
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      await this.$fetchApiData(
        this.comingCoursesApi,
        () => getComingSoonCoursesService(),
        []
      );
    },

    loadMore() {
      this.$fetchNextPageApi(this.comingCoursesApi);
    },
  },
};
</script>
