<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Administrator Users</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            @on-search="handleSearch"
          />
        </div>
        <div>
          <router-link to="/ha/administrator-users/create" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="admins">
        <AdminList
          :admins="admins"
          @on-admin-delete="startDeletingAdmin"
          @on-admin-edit="startEditingAdmin"
          @on-admin-deactivate="startAdminDeactivation"
          @on-admin-activate="startAdminActivation"
        />
      </div>
      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
    <!-- create admin -->
    <modal
      v-if="modalMode == 'createAdmin'"
      :title="'Create new Administrator'"
      @close-modal="closeModal"
    >
      <div class="w-100">
        <CreateAdminForm @on-cancel="closeModal" @on-submit="createAdmin" />
      </div>
    </modal>
    <!-- confirm deletion -->
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
    <!-- confirm deactivation -->
    <modal
      v-if="modalMode == 'deactivateAdmin'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to deactivate
        <b>{{ selectedAdmin.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="deactivateAdmin"
        />
      </template>
    </modal>
    <!-- confirm activation -->
    <modal
      v-if="modalMode == 'activateAdmin'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to activate
        <b>{{ selectedAdmin.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="activateAdmin"
        />
      </template>
    </modal>
  </section>
</template>

<script>
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import CreateAdminForm from "@/components/HA/Admins/CreateAdminForm.vue";
import AdminList from "@/components/HA/Admins/AdminList.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import {
  getAdminList,
  createAdmin,
  deleteAdmin,
  activateAdmin,
  deactivateAdmin,
} from "@/services/haService";

import { linksToPath } from "@/utils/urlUtils";
import Plus from "vue-material-design-icons/Plus";
import Modal from "@/components/Misc/Admin/AdminModal";

export default {
  name: "AdministratorUsers",
  components: {
    PaginationButtons,
    Plus,
    Modal,
    SearchWithButton,
    AdminList,
    CreateAdminForm,
    ConfirmationButtons,
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
    startDeletingAdmin(admin) {
      this.selectedAdmin = admin;
      this.openModal("deleteAdmin");
    },

    startEditingAdmin(admin) {
      this.selectedAdmin = admin;
    },

    startAdminDeactivation(admin) {
      this.selectedAdmin = admin;
      this.openModal("deactivateAdmin");
    },

    startAdminActivation(admin) {
      this.selectedAdmin = admin;
      this.openModal("activateAdmin");
    },

    async deleteAdmin() {
      const response = await deleteAdmin(this.selectedAdmin.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async deactivateAdmin() {
      const response = await deactivateAdmin(this.selectedAdmin.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async activateAdmin() {
      const response = await activateAdmin(this.selectedAdmin.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async init() {
      this.page = this.$route.query.page;
      this.searchText = this.$route.query.searchText;

      const response = await getAdminList(this.searchText, this.page);

      if (response.error) this.$displayServerResponse(response);

      this.admins = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },
    async createAdmin(data) {
      const response = await createAdmin(data);

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
