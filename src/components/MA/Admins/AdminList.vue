<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Username</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="admin in admins" :key="admin.id">
          <td>{{ admin.first_name }} {{ admin.last_name }}</td>
          <td>{{ admin.name }}</td>
          <td>
            <trash-can
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

export default {
  components: {
    TrashCan,
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
  },
};
</script>
