<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Title</th>
          <th scope="col">Type</th>
          <th scope="col">URL</th>
          <th scope="col">Start Date</th>
          <th scope="col">End Date</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.title }}</td>
          <td>{{ type(item.type) }}</td>
          <td>
            <div class="url-break">
              {{ item.url }}
            </div>
          </td>
          <td>{{ item.start_date }}</td>
          <td>{{ item.end_date }}</td>
          <td>
            <router-link
              :to="{ name: 'af-events-edit', params: { id: item.id } }"
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
import TrashCan from "vue-material-design-icons/TrashCan";
import Pen from "vue-material-design-icons/Pen";
import { GLOBAL, NATIONAL } from "@/dataObject/event/eventData";

export default {
  name: "EventsTable",

  components: {
    TrashCan,
    Pen,
  },

  props: {
    items: { type: Array },
  },

  methods: {
    onItemDelete(item) {
      this.$emit("on-item-delete", item);
    },
    type(type) {
      return (
        (type === GLOBAL.value && GLOBAL.name) ||
        (type === NATIONAL.value && NATIONAL.name)
      );
    },
  },
};
</script>

<style lang="scss" scoped>
div.url-break {
  word-break: break-all;
}
</style>
