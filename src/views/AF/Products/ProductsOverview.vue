<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Products</h3>
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
          <router-link :to="{ name: 'af-product-create' }" class="mr-2">
            <button class="btn blue-btn ml-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="items">
        <ProductsTable :items="items" @on-item-delete="startDeleting" />
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
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import ProductsTable from "@/components/AF/Products/ProductsTable.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import { linksToPath } from "@/utils/urlUtils";
import {
  getProductsList,
  deleteProduct,
} from "@/services/AF/afProductService.js";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import Plus from "vue-material-design-icons/Plus";

export default {
  name: "AFProductsOverview",
  components: {
    SearchWithButton,
    ProductsTable,
    PaginationButtons,
    Plus,
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

      const response = await getProductsList(this.searchText, this.page);

      if (response.error) return this.$displayError(response);

      this.items = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },
    startDeleting(item) {
      this.selectedItem = item;
      this.openModal("delete");
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    async deleteItem() {
      const response = await deleteProduct(this.selectedItem.id);

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
