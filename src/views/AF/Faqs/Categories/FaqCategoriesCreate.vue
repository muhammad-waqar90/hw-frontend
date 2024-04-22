<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">FAQ Category - Create</h3>
      </div>
      <div class="py-3">
        <div class="row">
          <div class="col-lg-6 col-md-12">
            <FaqCategoriesCreateEdit
              mode="create"
              @on-save="createFaqCategory"
              @on-change="hasChanged = true"
            />
          </div>
        </div>
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import FaqCategoriesCreateEdit from "@/components/AF/Faqs/Categories/FaqCategoriesCreateEdit";
import { createFaqCategory } from "@/services/AF/afFaqService";

export default {
  name: "FaqCategoriesCreate",

  components: { FaqCategoriesCreateEdit },

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
    async createFaqCategory(data) {
      let response = await createFaqCategory(data);

      if (response.error) return this.$displayServerResponse(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-faqs-categories" });
    },
  },
};
</script>
