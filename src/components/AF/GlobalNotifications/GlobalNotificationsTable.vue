<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Posted By</th>
          <th scope="col">Created At</th>
          <th scope="col">Updated At</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ item.description }}</td>
          <td>{{ item.user.name }} ({{ item.admin_profile.email }})</td>
          <td>{{ dateFormat(item.created_at) }}</td>
          <td>{{ dateFormat(item.updated_at) }}</td>
          <td>
            <router-link
              :to="{
                name: 'af-global-notifications-edit',
                params: { id: item.id },
              }"
              class="me-2 text-dark"
            >
              <pen class="cursor-pointer" :size="20" />
            </router-link>

            <trash-can
              class="cursor-pointer"
              :size="20"
              @click="onItemDelete(item)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Pen from "vue-material-design-icons/Pen";
import TrashCan from "vue-material-design-icons/TrashCan";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";

export default {
  name: "GlobalNotificationsTable",

  components: {
    Pen,
    TrashCan,
  },
  props: {
    items: { type: Array },
  },

  methods: {
    onItemDelete(item) {
      this.$emit("on-item-delete", item);
    },
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
  },
};
</script>
