<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Username</th>
          <th scope="col"># Permission Groups Assigned</th>
          <th scope="col">Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id">
          <td>{{ admin.first_name }} {{ admin.last_name }}</td>
          <td>{{ admin.name }}</td>
          <td>{{ admin.perm_groups_count }}</td>
          <td v-if="admin.is_enabled" class="text-success">
            <button
              class="btn green-btn activationButtons"
              @click="onAdminDeactivate(admin)"
            >
              Active
            </button>
          </td>
          <td v-else class="text-danger">
            <button
              class="btn btn-danger activationButtons"
              @click="onAdminActivate(admin)"
            >
              Inactive
            </button>
          </td>

          <td>
            <router-link
              title="Update"
              :to="'/ha/administrator-users/' + admin.id"
              class="me-2 text-dark"
            >
              <pen class="cursor-pointer" :size="20" />
            </router-link>

            <trash-can
              title="Delete"
              class="cursor-pointer"
              :size="20"
              @click="onAdminDelete(admin)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import TrashCan from "vue-material-design-icons/TrashCan";
import Pen from "vue-material-design-icons/Pen";

export default {
  components: {
    TrashCan,
    Pen,
  },
  props: {
    admins: { type: Array },
  },
  methods: {
    onAdminDelete(admin) {
      this.$emit("on-admin-delete", admin);
    },
    onAdminEdit(admin) {
      this.$emit("on-admin-edit", admin);
    },
    onAdminActivate(admin) {
      this.$emit("on-admin-activate", admin);
    },
    onAdminDeactivate(admin) {
      this.$emit("on-admin-deactivate", admin);
    },
  },
};
</script>

<style scoped>
.activationButtons {
  width: 90px;
}
</style>
