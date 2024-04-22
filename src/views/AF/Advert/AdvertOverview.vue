<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Adverts</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by name'"
            @on-search="handleSearch"
          />
        </div>
        <div class="col-4 position-relative ms-4 d-flex align-items-baseline">
          <label class="me-2 word-break-normal">Status:</label>
          <select
            v-model="selectedStatus"
            class="form-select ms-2"
            @change="handleRouteChange()"
          >
            <option
              v-for="(item, index) in status"
              :key="index"
              :value="item.value"
            >
              {{ item.name }}
            </option>
          </select>
        </div>
        <div>
          <router-link :to="{ name: 'af-adverts-create' }" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="advertApi.data">
        <AdvertTable
          :is-draggable="isDraggable"
          :items="advertApi.data"
          @on-drag-drop="handleDragDrop"
          @on-item-delete="startDeleting"
          @on-list-end="loadMoreAdvert"
        />
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
        <ConfirmationButtons
          :disabled="advertApi.loading"
          @on-cancel="closeModal"
          @on-confirm="deleteItem"
        />
      </template>
    </modal>
  </section>
</template>

<script>
import Plus from "vue-material-design-icons/Plus";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import AdvertTable from "@/components/AF/Advert/AdvertTable.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import {
  getAdvertList,
  deleteAdvert,
  sortAdvert,
} from "@/services/AF/afAdvertService";
import {
  ACTIVE as ACTIVE_STATUS,
  INACTIVE as INACTIVE_STATUS,
} from "@/dataObject/advert/advertData.js";

import apiMixin, { getApiState } from "@/mixins/apiMixin";

export default {
  name: "AdvertOverview",
  components: {
    Plus,
    SearchWithButton,
    AdvertTable,
    Modal,
    ConfirmationButtons,
  },
  mixins: [toastMixin, apiMixin],

  data() {
    return {
      searchText: "",
      items: [],
      links: [],
      modalMode: "",
      selectedItem: {},
      selectedStatus: ACTIVE_STATUS,
      status: [],
      nextPageUrl: null,
      advertApi: getApiState(),
    };
  },

  computed: {
    isDraggable() {
      return this.selectedStatus == ACTIVE_STATUS.value;
    },
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
      this.status.push(ACTIVE_STATUS, INACTIVE_STATUS);
    },
    async init() {
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";
      this.selectedStatus =
        this.$route.query.status != null ? this.$route.query.status : 1;

      await this.$fetchApiData(this.advertApi, () =>
        getAdvertList(this.searchText, this.selectedStatus)
      );
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
      await this.$postApiData(this.advertApi, () =>
        deleteAdvert(this.selectedItem.id)
      );
      if (this.advertApi.error) return;

      this.init();
      this.closeModal();
    },
    closeModal() {
      this.modalMode = "";
      this.selectedItem = null;
    },
    async handleRouteChange() {
      const query = {};
      if (this.searchText) query.searchText = this.searchText;
      if (this.selectedStatus != null) query.status = this.selectedStatus;

      this.$router.replace({
        query,
      });
    },
    async handleDragDrop(list) {
      let data = {
        data: list.map(function (item, key) {
          return { id: item.id, priority: key + 1 };
        }),
      };
      await this.$postApiData(this.advertApi, () => sortAdvert(data));
    },
    async loadMoreAdvert() {
      this.$fetchNextPageApi(this.advertApi);
    },
  },
};
</script>
