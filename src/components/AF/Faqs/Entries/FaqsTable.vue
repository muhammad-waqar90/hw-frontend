<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">Question</th>
          <th scope="col">Short Answer</th>
          <th scope="col">Faq Category</th>
          <th scope="col">Publish Status</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.question }}</td>
          <td>{{ item.short_answer }}</td>
          <td>{{ item.faq_category.name }}</td>
          <td>
            <button
              v-if="item.published"
              class="btn blue-btn"
              @click="onItemUnpublish(item)"
            >
              Published
            </button>
            <button
              v-if="!item.published"
              class="btn orange-btn text-white"
              @click="onItemPublish(item)"
            >
              Unpublished
            </button>
          </td>
          <td>
            <router-link
              :to="{ name: 'af-faqs-entries-edit', params: { id: item.id } }"
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
