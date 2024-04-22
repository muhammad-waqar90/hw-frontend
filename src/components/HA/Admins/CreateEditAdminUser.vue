<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <div class="row my-2">
        <div class="col-md-6 col-sm-12">
          <form @submit.prevent="onSubmit">
            <div class="form-group">
              <label>First Name:</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.firstName.$model"
                  :disabled="mode === 'edit' ? true : false"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="First Name"
                  :class="{ 'is-invalid': $v.firstName.$error }"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Last Name:</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.lastName.$model"
                  type="text"
                  :disabled="mode === 'edit' ? true : false"
                  required
                  class="form-control w-100"
                  placeholder="Last Name"
                  :class="{ 'is-invalid': $v.lastName.$error }"
                />
              </div>
            </div>
            <div class="form-group">
              <label>Email:</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.email.$model"
                  type="email"
                  :disabled="mode === 'edit' ? true : false"
                  required
                  class="form-control w-100"
                  placeholder="Email"
                  :class="{ 'is-invalid': $v.email.$error }"
                />
              </div>
            </div>
            <SelectedItemList
              :title="title"
              :selected-items="selectedPermissionGroups"
              :empty-text="emptyText"
              @remove-item="removeItem"
            />
            <div v-if="mode === 'create'" class="text-center mt-5 px-2">
              <button class="btn blue-btn" type="submit">Create</button>
            </div>
            <div v-if="mode === 'edit'" class="row mt-5 px-2">
              <div class="col-6">
                <button
                  class="btn btn-danger"
                  type="button"
                  @click="startDeletingAdmin"
                >
                  Delete
                </button>
              </div>
              <div class="col-6 text-end">
                <button class="btn blue-btn" type="submit">Save</button>
              </div>
            </div>
          </form>
        </div>
        <div class="col-md-6 col-sm-12">
          <ItemList
            :title="searchTitle"
            :items="filteredPermissionGroupsData"
            @get-items="getItems"
            @add-item="addItem"
            @clear-search="clearSearch"
          />
        </div>
      </div>
    </div>
    <modal
      v-if="deletingMode"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete the admin
        <b>{{ admin.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="deleteAdmin"
        />
      </template>
    </modal>
  </div>
</template>

<script>
import SelectedItemList from "@/components/HA/Misc/SelectedItemList";
import ItemList from "@/components/HA/Misc/ItemList";
import Modal from "@/components/Misc/Admin/AdminModal";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import { getPermGroupList } from "@/services/haService";
import { validationMixin } from "vuelidate";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import toastMixin from "@/mixins/toastMixin";
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";

export default {
  name: "CreateEditAdminUser",

  components: {
    SelectedItemList,
    ItemList,
    Modal,
    ConfirmationButtons,
  },

  mixins: [toastMixin, validationMixin, dompurifyMixin],

  props: {
    admin: {
      type: Object,
      default: () => {},
    },

    mode: {
      type: String,
      default: "create",
    },
  },

  validations: {
    firstName: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    lastName: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    email: {
      required,
      email,
    },
  },

  data() {
    return {
      searchText: "",
      page: null,
      permissionGroupsData: [],
      usersData: [],
      selectedPermissionGroups: [],
      firstName: "",
      lastName: "",
      email: "",
      description: "",
      deletingMode: false,
      hasInitialized: false,
    };
  },

  computed: {
    adminData() {
      return this.admin;
    },

    title() {
      return "Permissions Groups";
    },

    searchTitle() {
      return "Search Permission Groups";
    },

    emptyText() {
      return "No permission group selected";
    },

    groupData() {
      return this.admin;
    },

    filteredPermissionGroupsData() {
      const filtered = [];
      for (let item of this.permissionGroupsData) {
        if (this.selectedPermissionGroups.some((perm) => perm.id === item.id))
          continue;
        filtered.push({ id: item.id, name: item.name });
      }
      return filtered;
    },
  },
  watch: {
    firstName() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    lastName() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    email() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    selectedPermissionGroups() {
      if (this.hasInitialized) this.$emit("on-change");
    },
  },
  mounted() {
    if (this.mode === "edit") {
      this.mapData();
    }

    this.init();
  },
  methods: {
    async init() {
      await this.getPermissionGroups();
      this.hasInitialized = true;
    },

    onSubmit() {
      if (this.mode === "create") {
        this.$v.$touch();
        if (this.$v.$invalid) return;
      }

      const data = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        permGroupIds: this.selectedPermissionGroups.map((item) => item.id),
      };

      this.$emit("on-save", data);
    },

    getItems(searchText = "") {
      this.getPermissionGroups(searchText);
    },

    addItem(item) {
      this.selectedPermissionGroups.push(item);
    },

    removeItem(item) {
      this.selectedPermissionGroups = this.selectedPermissionGroups.filter(
        (selected) => {
          return selected.id !== item.id;
        }
      );
    },

    clearSearch() {
      this.searchText = "";
      this.$emit("get-permissions");
    },

    mapData() {
      this.firstName = this.adminData.first_name;
      this.lastName = this.adminData.last_name;
      this.email = this.adminData.admin_profile.email;

      this.selectedPermissionGroups = this.adminData.perm_groups;
    },

    async getPermissionGroups(searchText = "") {
      const response = await getPermGroupList(searchText, this.page);

      if (response.error) return this.$displayServerResponse(response);

      this.permissionGroupsData = response.data.data;
    },

    startDeletingAdmin() {
      this.deletingMode = true;
    },

    deleteAdmin() {
      this.$emit("on-delete");
    },

    closeModal() {
      this.deletingMode = false;
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
