<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">FAQ Entries</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by question'"
            @on-search="handleSearch"
          />
        </div>
        <div>
          <router-link :to="{ name: 'af-faqs-entries-create' }" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="items">
        <FaqsTable
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
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete
        <b>"{{ selectedItem.question }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons @on-cancel="closeModal" @on-confirm="deleteItem" />
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
        <b>"{{ selectedItem.question }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          :disabled="publishApi.loading"
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
        <b>"{{ selectedItem.question }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          :disabled="unpublishApi.loading"
          @on-cancel="closeModal"
          @on-confirm="unpublishItem"
        />
      </template>
    </modal>
  </section>
</template>

<script>
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import FaqsTable from "@/components/AF/Faqs/Entries/FaqsTable";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import {
  getFaqsList,
  deleteFaq,
  publishFaq,
  unpublishFaq,
} from "@/services/AF/afFaqService";
import { linksToPath } from "@/utils/urlUtils";
import Plus from "vue-material-design-icons/Plus";
import Modal from "@/components/Misc/Admin/AdminModal";

export default {
  name: "FaqsOverview",
  components: {
    PaginationButtons,
    Plus,
    Modal,
    SearchWithButton,
    FaqsTable,
    ConfirmationButtons,
  },
  mixins: [toastMixin, apiMixin],
  data() {
    return {
      searchText: "",
      page: null,
      items: [],
      links: [],
      modalMode: "",
      selectedItem: {},
      publishApi: getApiState(),
      unpublishApi: getApiState(),
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

      const response = await getFaqsList(this.searchText, this.page);

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
      const response = await deleteFaq(this.selectedItem.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async publishItem() {
      await this.$fetchApiData(this.publishApi, () =>
        publishFaq(this.selectedItem.id)
      );

      this.init();
      this.closeModal();
    },

    async unpublishItem() {
      await this.$fetchApiData(this.unpublishApi, () =>
        unpublishFaq(this.selectedItem.id)
      );

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

      this.$router.replace({
        query,
      });
    },
  },
};
</script>
