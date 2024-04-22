<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Category - Create</h3>
      </div>
      <div class="py-3">
        <CategoryCreateEdit
          mode="create"
          @on-save="createCategory"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CategoryCreateEdit from "@/components/AF/Category/CategoryCreateEdit.vue";
import { createCategory } from "@/services/AF/afCategoryService";

export default {
  name: "CategoryCreate",
  components: { CategoryCreateEdit },
  mixins: [toastMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },

  data() {
    return {
      hasChanged: false,
    };
  },

  methods: {
    async createCategory(data) {
      let response = await createCategory(data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-category" });
    },
  },
};
</script>
