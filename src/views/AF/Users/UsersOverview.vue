<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Users (total users: {{ totalCount }})</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by full name/username'"
            @on-search="handleSearch"
          />
        </div>
        <div class="form-group d-flex">
          <div class="async-vue-select-outer">
            <AsyncVueSelect
              label="course"
              :selected-item="selectedCourse"
              :service="getCoursesForFilter"
              @on-change="handleCourseSelectionOption"
            />
          </div>
          <div class="col-6">
            <select
              v-model="selectedActivityStatus"
              class="form-select"
              @change="handleActiveStatusChange()"
            >
              <option
                v-for="(status, index) in activityStatuses"
                :key="index"
                :value="status.value"
              >
                {{ status.name }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="items">
        <UsersTable :items="items" />
      </div>
      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
  </section>
</template>

<script>
import UsersTable from "@/components/AF/Users/UsersTable.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import AsyncVueSelect from "@/components/Misc/Filters/AsyncVueSelect.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import * as availableActivityStatuses from "@/dataObject/activity/activityStatusData.js";
import { linksToPath } from "@/utils/urlUtils";
import { getUsersList } from "@/services/AF/afUserService";
import {
  getCoursesForFilter,
  getCourseForFilter,
} from "@/services/AF/afCourseService";

import toastMixin from "@/mixins/toastMixin";

export default {
  name: "UsersOverview",
  components: {
    SearchWithButton,
    AsyncVueSelect,
    UsersTable,
    PaginationButtons,
  },
  mixins: [toastMixin],
  data() {
    return {
      searchText: "",
      selectedCourseId: null,
      selectedCourse: null,
      activityStatuses: [],
      selectedActivityStatus: null,
      getCoursesForFilter,
      page: null,
      items: [],
      links: [],
      totalCount: null,
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  created() {
    this.mapData();
  },
  mounted() {
    this.mapFilter();
    this.init();
  },

  methods: {
    mapData() {
      this.activityStatuses.push(
        availableActivityStatuses.ALL,
        availableActivityStatuses.IS_ACTIVE,
        availableActivityStatuses.SEMI_ACTIVE_30_TO_90_DAYS,
        availableActivityStatuses.SEMI_ACTIVE_91_TO_270_DAYS,
        availableActivityStatuses.SEMI_ACTIVE_271_TO_365_DAYS,
        availableActivityStatuses.INACTIVE_366_DAYS_OR_MORE
      );
    },

    async mapFilter() {
      const courseId = this.$route.query.courseId || null;
      if (courseId) {
        const response = await getCourseForFilter(courseId);
        if (response.error) this.$displayServerResponse(response);
        this.selectedCourse = response;
      }
    },

    async init() {
      this.items = [];
      this.links = [];

      this.page = this.$route.query.page;
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";
      this.selectedCourseId = this.$route.query.courseId;
      this.selectedActivityStatus = this.$route.query.activeStatus || null;
      if (!this.selectedCourseId) this.selectedCourse = null;

      const response = await getUsersList(
        this.searchText,
        this.selectedCourseId,
        this.selectedActivityStatus,
        this.page
      );

      if (response.error) return this.$displayError(response);

      this.totalCount = response.total;
      this.items = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },

    handleSearch(searchText) {
      if (searchText == this.searchText) return;
      this.searchText = searchText;
      this.handleRouteChange();
    },

    handleCourseSelectionOption(selectedCourse) {
      this.selectedCourse = selectedCourse;
      this.selectedCourseId = selectedCourse?.id || null;
      this.handleRouteChange();
    },

    handleActiveStatusChange() {
      this.handleRouteChange();
    },

    async handleRouteChange() {
      const query = {};
      if (this.searchText) query.searchText = this.searchText;
      if (this.selectedCourseId) query.courseId = this.selectedCourseId;
      if (this.selectedActivityStatus)
        query.activeStatus = this.selectedActivityStatus;

      this.$router.replace({
        query,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.async-vue-select-outer {
  width: 600px;
  margin-right: 4px;
}
</style>
