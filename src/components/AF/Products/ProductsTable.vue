<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID (Product ID)</th>
          <th scope="col">Name</th>
          <th scope="col">Amount</th>
          <th scope="col">Created At</th>
          <th scope="col">Updated At</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <td class="price">£{{ item.price.toFixed(2) }}</td>
          <td>{{ dateFormat(item.created_at) }}</td>
          <td>{{ dateFormat(item.updated_at) }}</td>
          <td>
            <router-link
              :to="{
                name: 'af-product-edit',
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
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
import TrashCan from "vue-material-design-icons/TrashCan";
import Pen from "vue-material-design-icons/Pen";

export default {
  name: "ProductsTable",

  components: {
    Pen,
    TrashCan,
  },

  props: {
    items: { type: Array },
  },

  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
    onItemDelete(item) {
      this.$emit("on-item-delete", item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.price {
  color: $blue;
  font-size: 16px;
  font-weight: bold;
}
</style>
