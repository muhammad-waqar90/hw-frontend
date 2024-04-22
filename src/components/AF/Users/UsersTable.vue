<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Full Name</th>
          <th scope="col">Username</th>
          <th scope="col"># Enrolled Courses</th>
          <th scope="col">Trashed</th>
          <th scope="col">Last Active</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.first_name }} {{ item.last_name }}</td>
          <td>{{ item.name }}</td>
          <td>{{ item.enrolled_courses_count }}</td>
          <td>
            <span :class="trashStatusClass(item.deleted_at, item.restore_user)">
              {{ trashStatus(item.deleted_at, item.restore_user) }}
            </span>
          </td>
          <td>{{ item.last_active }}</td>
          <td>
            <router-link :to="'/af/users/' + item.id" class="btn blue-btn">
              VIEW
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "UsersTable",

  props: {
    items: { type: Array },
  },

  methods: {
    trashStatus(deleted_at, restore_user) {
      return deleted_at || restore_user ? "YES" : "NO";
    },
    trashStatusClass(deleted_at, restore_user) {
      return deleted_at || restore_user
        ? "badge bg-danger"
        : "badge bg-success";
    },
  },
};
</script>

<style lang="scss" scoped>
.claimButtons {
  width: 85px;
}
</style>
