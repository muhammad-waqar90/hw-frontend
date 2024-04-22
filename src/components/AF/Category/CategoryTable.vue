<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Category Name</th>
          <th scope="col">Parent Category</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td>{{ parentCategoryTreeString(item) }}</td>
          <td>
            <router-link
              :to="{
                name: 'af-category-edit',
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
import { generateParentCategoryTree } from "@/utils/categoryUtils.js";

export default {
  name: "CategoryTable",

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
    parentCategoryTreeString(data) {
      let categoriesHierarchy = generateParentCategoryTree(data).map(
        (category) => category.name
      );

      categoriesHierarchy.pop();
      return categoriesHierarchy.length ? categoriesHierarchy.join("/") : "--";
    },
  },
};
</script>
