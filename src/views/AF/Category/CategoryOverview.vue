<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Categories</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by category name'"
            @on-search="handleSearch"
          />
        </div>
        <div>
          <router-link :to="{ name: 'af-category-create' }" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="items">
        <CategoryTable :items="items" @on-item-delete="startDeleting" />
      </div>
      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
    <modal
      v-if="modalMode == 'delete'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete
        <b>"{{ selectedItem.name }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons @on-cancel="closeModal" @on-confirm="deleteItem" />
      </template>
    </modal>
  </section>
</template>

<script>
import Plus from "vue-material-design-icons/Plus";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import CategoryTable from "@/components/AF/Category/CategoryTable.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import { linksToPath } from "@/utils/urlUtils";
import {
  getCategoryListDetailed,
  deleteCategory,
} from "@/services/AF/afCategoryService";

export default {
  name: "CategoryOverview",
  components: {
    Plus,
    SearchWithButton,
    CategoryTable,
    PaginationButtons,
    Modal,
    ConfirmationButtons,
  },
  mixins: [toastMixin],

  data() {
    return {
      searchText: "",
      page: null,
      items: [],
      links: [],
      selectedItem: {},
      modalMode: "",
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

      const response = await getCategoryListDetailed(
        this.searchText,
        this.page
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
    startDeleting(item) {
      this.selectedItem = item;
      this.openModal("delete");
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    async deleteItem() {
      const response = await deleteCategory(this.selectedItem.id);

      if (response.error) return this.handleDeleteError(response);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },
    handleDeleteError(response) {
      this.$displayError(response);
      if (response.status == 400) this.closeModal();
    },
    closeModal() {
      this.modalMode = "";
      this.selectedItem = null;
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
