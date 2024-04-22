<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Courses</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by name'"
            @on-search="handleSearch"
          />
        </div>
        <div>
          <router-link :to="{ name: 'af-course-create' }" class="mr-2">
            <button class="btn blue-btn ml-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="items">
        <CoursesTable :items="items" />
      </div>
      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
  </section>
</template>

<script>
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import CoursesTable from "@/components/AF/Courses/CoursesTable.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import { linksToPath } from "@/utils/urlUtils";
import { getCoursesList } from "@/services/AF/afCourseService";
import Plus from "vue-material-design-icons/Plus";

export default {
  name: "AFCoursesOverview",
  components: {
    SearchWithButton,
    CoursesTable,
    PaginationButtons,
    Plus,
  },

  mixins: [toastMixin],

  data() {
    return {
      searchText: "",
      page: null,
      items: [],
      links: [],
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
      this.items = [];
      this.links = [];

      const response = await getCoursesList(this.searchText, this.page);

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
