<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Head Administrators</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            @on-search="handleSearch"
          />
        </div>
      </div>
      <div v-if="admins">
        <AdminList :admins="admins" @on-admin-delete="startDeletingAdmin" />
      </div>
      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
    <modal
      v-if="modalMode == 'deleteAdmin'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete
        <b>{{ selectedAdmin.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="deleteAdmin"
        />
      </template>
    </modal>
  </section>
</template>

<script>
import AdminList from "@/components/MA/Admins/AdminList.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import { getHaList, deleteHa } from "@/services/maService";

import { linksToPath } from "@/utils/urlUtils";

import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import Modal from "@/components/Misc/Admin/AdminModal";

export default {
  name: "MAAdministratorUsers",
  components: {
    PaginationButtons,
    SearchWithButton,
    AdminList,
    ConfirmationButtons,
    Modal,
  },
  mixins: [toastMixin],
  data() {
    return {
      searchText: "",
      links: [],
      page: null,
      admins: [],
      selectedAdmin: null,
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
      this.searchText = this.$route.query.searchText;

      const response = await getHaList(this.searchText, this.page);

      if (response.error) this.$displayServerResponse(response);

      this.admins = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },

    startDeletingAdmin(admin) {
      this.selectedAdmin = admin;
      this.openModal("deleteAdmin");
    },

    async deleteAdmin() {
      const response = await deleteHa(this.selectedAdmin.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
      this.selectedAdmin = null;
    },
    async handleSearch(searchText) {
      this.$router.replace({
        query: { searchText: searchText },
      });
    },
  },
};
</script>
