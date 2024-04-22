<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Global Notifications</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by title/description'"
            @on-search="handleSearch"
          />
        </div>
        <div class="col-4 position-relative ms-4 d-flex align-items-baseline">
          <label class="me-2 word-break-normal">Status:</label>
          <select
            v-model="selectedArchiveStatus"
            class="form-select ms-2"
            @change="handleArchiveStatusChange()"
          >
            <option
              v-for="(status, index) in archiveStatus"
              :key="index"
              :value="status.value"
            >
              {{ status.name }}
            </option>
          </select>
        </div>
        <div>
          <router-link
            :to="{ name: 'af-global-notifications-create' }"
            class="me-2"
          >
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="items">
        <GlobalNotificationsTable
          :items="items"
          @on-item-delete="startDeleting"
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
        <b>"{{ selectedItem.title }}"</b>?
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
import GlobalNotificationsTable from "@/components/AF/GlobalNotifications/GlobalNotificationsTable.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import { linksToPath } from "@/utils/urlUtils";
import {
  getGlobalNotificationsList,
  deleteGlobalNotification,
} from "@/services/AF/afGlobalNotificationService";
import * as archiveStatusData from "@/dataObject/globalNotifications/archiveStatusData.js";

export default {
  name: "GlobalNotificationsOverview",
  components: {
    Plus,
    SearchWithButton,
    GlobalNotificationsTable,
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
      modalMode: "",
      selectedItem: {},
      selectedArchiveStatus: null,
      archiveStatus: [],
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
    this.init();
  },

  methods: {
    mapData() {
      this.archiveStatus.push(
        archiveStatusData.ALL,
        archiveStatusData.ACTIVE,
        archiveStatusData.ARCHIVED
      );
    },
    async init() {
      this.items = [];
      this.links = [];

      this.page = this.$route.query.page;
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";
      this.selectedArchiveStatus =
        this.$route.query.archiveStatus != null
          ? this.$route.query.archiveStatus
          : null;

      const response = await getGlobalNotificationsList(
        this.searchText,
        this.selectedArchiveStatus,
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
      const response = await deleteGlobalNotification(this.selectedItem.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },
    closeModal() {
      this.modalMode = "";
      this.selectedItem = null;
    },
    handleArchiveStatusChange() {
      this.handleRouteChange();
    },
    async handleRouteChange() {
      const query = {};
      if (this.searchText) query.searchText = this.searchText;
      if (this.selectedArchiveStatus != null)
        query.archiveStatus = this.selectedArchiveStatus;

      this.$router.replace({
        query,
      });
    },
  },
};
</script>
