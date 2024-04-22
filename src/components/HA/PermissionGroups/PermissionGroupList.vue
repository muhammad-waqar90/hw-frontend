<template>
  <div>
    <table v-if="permissionGroupsData" class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">Name</th>
          <th scope="col"># of Permissions</th>
          <th scope="col"># of Assignments</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="group in permissionGroupsData" :key="group.id">
          <td>{{ group.name }}</td>
          <td>{{ group.permissions_count }}</td>
          <td>{{ group.users_count }}</td>
          <td>
            <router-link :to="'/ha/permission-groups/' + group.id">
              <pen class="cursor-pointer text-dark" :size="20" />
            </router-link>

            <trash-can
              class="cursor-pointer"
              :size="20"
              @click="startDeletingPermGroup(group)"
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
    permissionGroupsData: { type: Array },
  },
  methods: {
    startDeletingPermGroup(item) {
      this.$emit("on-delete", item);
    },
  },
};
</script>
