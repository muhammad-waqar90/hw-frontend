<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Events</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by title'"
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
          <router-link :to="{ name: 'af-events-create' }" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div>
        <EventsTable :items="items" @on-item-delete="startDeleting" />
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
        Are you sure you want to delete <b>{{ selectedItem.title }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons @on-cancel="closeModal" @on-confirm="deleteItem" />
      </template>
    </modal>
  </section>
</template>

<script>
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import EventsTable from "@/components/AF/Event/EventsTable.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import { getEventsList, deleteEvent } from "@/services/AF/afEventService";
import { linksToPath } from "@/utils/urlUtils";
import Plus from "vue-material-design-icons/Plus";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import { GLOBAL, NATIONAL, ALL } from "@/dataObject/event/eventData";

export default {
  name: "AFEventsOverview",
  components: {
    SearchWithButton,
    EventsTable,
    PaginationButtons,
    Modal,
    ConfirmationButtons,
    Plus,
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
        { id: ALL.value, name: ALL.name },
        { id: GLOBAL.value, name: GLOBAL.name },
        { id: NATIONAL.value, name: NATIONAL.name },
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
      this.page = this.$route.query.page;
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";
      this.selectedType = this.$route.query.type
        ? this.$route.query.type
        : null;
      this.items = [];
      this.links = [];

      const response = await getEventsList(
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

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
      this.selectedItem = null;
    },

    async deleteItem() {
      const response = await deleteEvent(this.selectedItem.id);

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
