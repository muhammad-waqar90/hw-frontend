<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Type</th>
          <th scope="col"># All Subcategories</th>
          <th scope="col"># Published Subcategories</th>
          <th scope="col"># All Faqs</th>
          <th scope="col"># Published Faqs</th>
          <th scope="col">Publish Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.name }}</td>
          <td>
            <span v-if="item.faq_category_id != null" class="text-blue">
              SUBCATEGORY
            </span>
            <span v-else class="text-danger"> ROOT CATEGORY </span>
          </td>
          <td>{{ item.faq_categories_count }}</td>
          <td>{{ item.published_faq_categories_count }}</td>
          <td>{{ item.faqs_count }}</td>
          <td>{{ item.published_faqs_count }}</td>
          <td>
            <button
              v-if="item.published"
              class="btn btn-success"
              @click="onItemUnpublish(item)"
            >
              Published
            </button>
            <button
              v-if="!item.published"
              class="btn btn-warning text-white"
              @click="onItemPublish(item)"
            >
              Unpublished
            </button>
          </td>
          <td>
            <router-link
              :to="{ name: 'af-faqs-categories-edit', params: { id: item.id } }"
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

export default {
  name: "FaqCategoriesTable",

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
    onItemPublish(item) {
      this.$emit("on-item-publish", item);
    },
    onItemUnpublish(item) {
      this.$emit("on-item-unpublish", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.claimButtons {
  width: 85px;
}
</style>
