<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID (Product ID)</th>
          <th scope="col">Name</th>
          <th scope="col">Category</th>
          <th scope="col">Amount</th>
          <th scope="col">InApp Tier</th>
          <th scope="col">#Level(s)</th>
          <th scope="col">Status</th>
          <th scope="col">Created At</th>
          <th scope="col">Updated At</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }} ({{ item.product_id }})</td>
          <td>{{ item.name }}</td>
          <td>{{ item.category }}</td>
          <td class="price">£{{ item.price.toFixed(2) }}</td>
          <td class="text-warning">
            {{ item.tier.label }}
          </td>
          <td>{{ item.levels }}</td>
          <td>
            <span :class="courseStatusClass[item.status - 1]">
              {{ courseStatus[item.status - 1] }}
            </span>
          </td>
          <td>{{ dateFormat(item.created_at) }}</td>
          <td>{{ dateFormat(item.updated_at) }}</td>
          <td>
            <router-link
              :to="{ name: 'af-course-edit', params: { id: item.id } }"
              class="mr-2 text-dark"
            >
              <pen class="cursor-pointer" :size="20" />
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Pen from "vue-material-design-icons/Pen";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";
import {
  DRAFT,
  PUBLISHED,
  UNPUBLISHED,
  COMING_SOON,
} from "@/dataObject/courses/coursesStatusData";

export default {
  name: "CoursesTable",

  components: {
    Pen,
  },

  props: {
    items: { type: Array },
  },

  data() {
    return {
      courseStatus: [
        DRAFT.name,
        PUBLISHED.name,
        UNPUBLISHED.name,
        COMING_SOON.name,
      ],
      courseStatusClass: [
        "badge bg-secondary",
        "badge bg-success",
        "badge bg-warning",
        "badge bg-primary",
      ],
    };
  },

  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
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
