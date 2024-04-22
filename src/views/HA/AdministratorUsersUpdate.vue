<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Administrator Users - Update</h3>
      </div>
      <div class="py-3">
        <create-edit-administrator-user
          v-if="showEdit"
          mode="edit"
          :admin="admin"
          @on-save="updateAdminUser"
          @on-delete="deleteAdminUser"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CreateEditAdministratorUser from "@/components/HA/Admins/CreateEditAdminUser";
import { getAdmin, updateAdmin, deleteAdmin } from "@/services/haService";

export default {
  name: "AdminUserEdit",
  components: { CreateEditAdministratorUser },
  mixins: [toastMixin],
  beforeRouteLeave(to, from, next) {
    if (this.hasChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },
  data() {
    return {
      admin: {},
      showEdit: false,
      hasChanged: false,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async updateAdminUser(data) {
      const updateData = { permGroupIds: data.permGroupIds };

      let response = await updateAdmin(this.adminId, updateData);
      this.handleResponse(response);
    },

    async init() {
      this.adminId = this.$route.params.id;
      const response = await getAdmin(this.adminId);

      if (response.error) return this.$displayServerResponse(response);

      this.admin = response;
      this.showEdit = true;
    },

    async deleteAdminUser() {
      let response = await deleteAdmin(this.adminId);
      this.handleResponse(response);
    },

    handleResponse(response) {
      if (response.error) return this.$displayServerResponse(response);
      this.$displayServerResponse(response);
      this.hasChanged = false;
      this.$router.push({ name: "ha-administrator-users" });
    },
  },
};
</script>
