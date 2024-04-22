<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Permission Groups</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            @on-search="handleSearch"
          />
        </div>
        <div>
          <router-link to="/ha/permission-groups/create" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div>
        <PermissionGroupList
          :permission-groups-data="permissionGroupsData"
          @on-delete="startDeletingPermGroup"
        />
      </div>

      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
    <modal
      v-if="deletingGroup"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete
        <b>{{ selectedGroup.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="deleteGroup"
        />
      </template>
    </modal>
  </section>
</template>

<script>
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import PermissionGroupList from "@/components/HA/PermissionGroups/PermissionGroupList.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import toastMixin from "@/mixins/toastMixin";
import { getPermGroupList, deletePermGroup } from "@/services/haService";

import { linksToPath } from "@/utils/urlUtils";
import Plus from "vue-material-design-icons/Plus";
import Modal from "@/components/Misc/Admin/AdminModal";

export default {
  name: "HAPermissionGroups",
  components: {
    PaginationButtons,
    Plus,
    SearchWithButton,
    Modal,
    PermissionGroupList,
    ConfirmationButtons,
  },
  mixins: [toastMixin],
  data() {
    return {
      searchText: "",
      links: [],
      page: null,
      permissionGroupsData: [],
      selectedGroup: null,
      deletingGroup: false,
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

      const response = await getPermGroupList(this.searchText, this.page);

      if (response.error) this.$displayServerResponse(response);

      this.permissionGroupsData = response.data.data;
      this.links = linksToPath(this.$route.path, response.data.links);
    },

    startDeletingPermGroup(group) {
      this.selectedGroup = group;
      this.deletingGroup = true;
    },

    async deleteGroup() {
      const response = await deletePermGroup(this.selectedGroup.id);

      this.$displayServerResponse(response);
      this.init();
      this.deletingGroup = false;
    },

    async searchGroups() {
      this.page = this.$route.query.page;

      const response = await getPermGroupList(this.searchText, this.page);

      if (response.error) this.$displayServerResponse(response);

      this.permissionGroupsData = response.data.data;
      this.links = linksToPath(this.$route.path, response.data.links);
    },

    clearSearch() {
      this.searchText = "";
      this.searchGroups();
    },
    closeModal() {
      this.deletingGroup = false;
    },
    async handleSearch(searchText) {
      this.$router.replace({
        query: { searchText: searchText },
      });
    },
  },
};
</script>

<style scoped>
.clear-input {
  top: 0;
  right: 0;
}
</style>
