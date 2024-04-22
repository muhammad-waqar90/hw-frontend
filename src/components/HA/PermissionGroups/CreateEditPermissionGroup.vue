<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <div class="row my-2">
        <div class="col-md-6 col-sm-12">
          <form @submit.prevent="onSubmit">
            <div class="form-group">
              <label>Title :</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.name.$model"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="Group Name"
                  :class="{ 'is-invalid': $v.name.$error }"
                />
              </div>
            </div>
            <div class="form-group position-relative">
              <label>Description :</label>
              <textarea
                v-model="$v.description.$model"
                class="form-control w-100"
                placeholder="Group Description"
                :class="{ 'is-invalid': $v.description.$error }"
                rows="10"
              />
            </div>
            <SelectedItemList
              :tab="tab"
              :title="title"
              :selected-items="
                tab == 'permissions' ? selectedPermissions : selectedUsers
              "
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
                  @click="startDeletingGroup"
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
            :tab="tab"
            :items="
              tab == 'permissions' ? filteredPermissionsData : filteredUsersData
            "
            @get-items="getItems"
            @add-item="addItem"
            @clear-search="clearSearch"
          />
        </div>
      </div>
    </div>
    <modal
      v-if="deletingGroup"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete the group
        <b>{{ group.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="deleteGroup"
        />
      </template>
    </modal>
  </div>
</template>

<script>
import SelectedItemList from "@/components/HA/Misc/SelectedItemList.vue";
import ItemList from "@/components/HA/Misc/ItemList.vue";
import Modal from "@/components/Misc/Admin/AdminModal";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import { getPermissionList, getAllAdmins } from "@/services/haService";
import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";

import { required, minLength, maxLength } from "vuelidate/lib/validators";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  name: "CreateEditPermissionGroup",

  components: {
    SelectedItemList,
    ItemList,
    Modal,
    ConfirmationButtons,
  },

  mixins: [toastMixin, validationMixin, dompurifyMixin],

  props: {
    group: {
      type: Object,
      default: function () {
        return { name: "", description: "", permissions: [], users: [] };
      },
    },
    tab: {
      type: String,
      default: "permissions",
    },
    mode: {
      type: String,
      default: "create",
    },
  },

  validations: {
    name: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(30),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    description: {
      minLength: maxLength(255),
      isSanitizeInput: function (value) {
        return this.sanitizeWithBusinesslogic(value);
      },
    },
  },

  data() {
    return {
      searchText: "",
      permissionsData: [],
      usersData: [],
      selectedUsers: [],
      selectedPermissions: [],
      name: "",
      description: "",
      deletingGroup: false,
      hasInitialized: false,
    };
  },

  computed: {
    title() {
      return this.tab == "permissions" ? "Permissions" : "Users";
    },

    searchTitle() {
      return this.tab == "permissions" ? "Search Permissions" : "Search Users";
    },

    emptyText() {
      return this.tab == "permissions"
        ? "No permissions selected"
        : "No users selected";
    },

    groupData() {
      return this.group;
    },

    filteredPermissionsData() {
      const filtered = [];
      for (let item of this.permissionsData) {
        if (this.selectedPermissions.some((perm) => perm.id === item.id))
          continue;
        filtered.push(item);
      }
      return filtered;
    },

    filteredUsersData() {
      const filtered = [];
      for (let item of this.usersData) {
        if (this.selectedUsers.some((user) => user.id === item.id)) continue;
        filtered.push({
          id: item.id,
          name: item.name,
          admin_profile: item.admin_profile,
        });
      }
      return filtered;
    },
  },
  watch: {
    tab: function () {
      this.init();
    },
    name() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    description() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    selectedPermissions() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    selectedUsers() {
      if (this.hasInitialized) this.$emit("on-change");
    },
  },
  mounted() {
    this.mapData();
    this.init();
  },
  methods: {
    async init() {
      if (this.tab == "permissions") {
        await this.getPermissions();
      } else {
        await this.getUsers();
      }
      this.hasInitialized = true;
    },
    onSubmit() {
      this.$v.$touch();
      if (this.$v.$invalid) return;

      const data = {
        name: this.name,
        description: this.description,
        permissions: this.selectedPermissions.map((item) => item.id),
        users: this.selectedUsers.map((item) => item.id),
      };

      this.$emit("on-save", data);
    },
    getItems(searchText = "") {
      if (this.tab === "permissions") {
        this.getPermissions(searchText);
      } else {
        this.getUsers(searchText);
      }
    },
    addItem(item) {
      if (this.tab === "permissions") {
        this.selectedPermissions.unshift(item);
      } else {
        this.selectedUsers.unshift(item);
      }
    },
    removeItem(item) {
      if (this.tab === "permissions") {
        this.selectedPermissions = this.selectedPermissions.filter(
          (selected) => {
            return selected.id !== item.id;
          }
        );
      } else {
        this.selectedUsers = this.selectedUsers.filter((selected) => {
          return selected.id !== item.id;
        });
      }
    },
    clearSearch() {
      this.searchText = "";
      this.$emit("get-permissions");
    },
    mapData() {
      this.name = this.group.name;
      this.description = this.group.description;
      this.selectedPermissions = this.group.permissions;
      this.selectedUsers = this.group.users;
    },
    async getPermissions(searchText = "") {
      const response = await getPermissionList(searchText);

      if (response.error) return this.$displayServerResponse(response);

      this.permissionsData = response;
    },
    async getUsers(searchText = "") {
      const response = await getAllAdmins(searchText);

      if (response.error) return this.$displayServerResponse(response);

      this.usersData = response;
    },
    startDeletingGroup() {
      this.deletingGroup = true;
    },
    deleteGroup() {
      this.$emit("on-delete");
    },
    closeModal() {
      this.deletingGroup = false;
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
