<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">FAQ Categories</h3>
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
          <div class="position-relative ms-4 d-flex align-items-baseline">
            <label class="me-2 word-break-normal">Types:</label>
            <select
              v-model="selectedType"
              class="form-select"
              @change="handleRouteChange"
            >
              <option v-for="item in types" :key="item.id" :value="item.id">
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>
        <div>
          <router-link :to="{ name: 'af-faqs-categories-create' }" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="items">
        <FaqCategoriesTable
          :items="items"
          @on-item-delete="startDeleting"
          @on-item-publish="startPublishing"
          @on-item-unpublish="startUnpublishing"
        />
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
      <div class="w-100 pt-2">
        <div class="h5">
          Are you sure you want to delete
          <b>{{ selectedItem.name }}</b
          >?
        </div>
        <div>
          Deleting a Faq category also deletes all it's children Faq categories
          as well as Faq Entries associated with it
        </div>
      </div>
      <template slot="footer">
        <ConfirmationButtonsWithInput
          :name="selectedItem.name"
          :placeholder="`To confirm type '${selectedItem.name}'`"
          :is-submitting="false"
          @on-confirm="deleteItem"
        />
      </template>
    </modal>
    <modal
      v-if="modalMode == 'publish'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to publish
        <b>{{ selectedItem.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="publishItem"
        />
      </template>
    </modal>
    <modal
      v-if="modalMode == 'unpublish'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to unpublish
        <b>{{ selectedItem.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="unpublishItem"
        />
      </template>
    </modal>
  </section>
</template>

<script>
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import FaqCategoriesTable from "@/components/AF/Faqs/Categories/FaqCategoriesTable";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";

import toastMixin from "@/mixins/toastMixin";
import {
  getFaqCategoriesList,
  deleteFaqCategory,
  publishFaqCategory,
  unpublishFaqCategory,
} from "@/services/AF/afFaqService";
import { linksToPath } from "@/utils/urlUtils";
import Plus from "vue-material-design-icons/Plus";
import Modal from "@/components/Misc/Admin/AdminModal";

export default {
  name: "FaqCategoriesOverview",
  components: {
    PaginationButtons,
    Plus,
    Modal,
    SearchWithButton,
    FaqCategoriesTable,
    ConfirmationButtons,
    ConfirmationButtonsWithInput,
  },
  mixins: [toastMixin],
  data() {
    return {
      searchText: "",
      page: null,
      items: [],
      links: [],
      modalMode: "",
      selectedItem: {},
      selectedType: null,
      types: [
        { id: null, name: "All" },
        { id: 1, name: "Root" },
        { id: 2, name: "Sub" },
      ],
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
      this.items = [];
      this.links = [];

      this.page = this.$route.query.page;
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";
      this.selectedType = this.$route.query.type
        ? this.$route.query.type
        : null;

      const response = await getFaqCategoriesList(
        this.searchText,
        this.selectedType,
        this.page
      );

      if (response.error) return this.$displayError(response);

      this.items = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },

    startDeleting(item) {
      this.selectedItem = item;
      this.openModal("delete");
    },

    startPublishing(item) {
      this.selectedItem = item;
      this.openModal("publish");
    },

    startUnpublishing(item) {
      this.selectedItem = item;
      this.openModal("unpublish");
    },

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
      this.selectedItem = null;
    },

    async deleteItem() {
      const response = await deleteFaqCategory(this.selectedItem.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async publishItem() {
      const response = await publishFaqCategory(this.selectedItem.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async unpublishItem() {
      const response = await unpublishFaqCategory(this.selectedItem.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    handleSearch(searchText) {
      if (searchText == this.searchText) return;
      this.searchText = searchText;
      this.handleRouteChange();
    },

    async handleRouteChange() {
      const query = {};
      if (this.searchText) query.searchText = this.searchText;
      if (this.selectedType) query.type = this.selectedType;

      this.$router.replace({
        query,
      });
    },
  },
};
</script>
