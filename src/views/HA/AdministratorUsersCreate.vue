<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Administrator Users - Create</h3>
      </div>
      <div class="py-3">
        <create-edit-administrator-user
          mode="create"
          @on-save="createAdminUser"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CreateEditAdministratorUser from "@/components/HA/Admins/CreateEditAdminUser";
import { createAdmin } from "@/services/haService";

export default {
  name: "AdminUserCreate",
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
      hasChanged: false,
    };
  },
  methods: {
    async createAdminUser(data) {
      let response = await createAdmin(data);

      if (response.error) return this.$displayServerResponse(response);

      this.$displayServerResponse(response);
      this.hasChanged = false;
      this.$router.push({ name: "ha-administrator-users" });
    },
  },
};
</script>
