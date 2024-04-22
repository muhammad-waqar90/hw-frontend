<template>
  <div>
    <div class="my-2 d-flex justify-content-between">
      <div class="form-group d-flex">
        <SearchWithButton
          search-placeholder="Search by course name"
          :search-text-prop="searchText"
          @on-search="handleSearch"
        />
      </div>
    </div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Course Name</th>
          <th scope="col">Status</th>
          <th scope="col">User Progress</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ courseText.enrolled }}</td>
          <td>{{ item.progress || 0 }}%</td>
        </tr>
      </tbody>
    </table>
    <div v-if="links.length">
      <PaginationButtons :links="links" />
    </div>
  </div>
</template>

<script>
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import { linksToPath } from "@/utils/urlUtils";
import { getUserCourses } from "@/services/AF/afUserService";
import toastMixin from "@/mixins/toastMixin";
import { courseText } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  name: "CourseInfo",
  components: {
    SearchWithButton,
    PaginationButtons,
  },
  mixins: [toastMixin],
  props: {
    userId: { type: Number },
  },
  data() {
    return {
      searchText: "",
      page: null,
      items: [],
      links: [],
      courseText,
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.page = this.$route.query.page;
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";

      this.getUserCourses();
    },

    async getUserCourses() {
      this.items = [];
      const response = await getUserCourses(
        this.userId,
        this.page,
        this.searchText
      );

      if (response.error) return this.$displayError(response);

      this.items = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },

    handleSearch(searchText) {
      if (searchText == this.searchText) return;
      this.searchText = searchText;
      this.handleRouteChange();
    },

    async handleRouteChange() {
      const query = {};
      if (this.searchText) query.searchText = this.searchText;

      this.$router.replace({
        query,
      });
    },
  },
};
</script>
