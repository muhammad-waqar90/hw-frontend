<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">FAQ Entry - Create</h3>
      </div>
      <div class="py-3">
        <FaqCreateEdit
          mode="create"
          @on-save="createFaq"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import FaqCreateEdit from "@/components/AF/Faqs/Entries/FaqCreateEdit";
import { createFaq } from "@/services/AF/afFaqService";

export default {
  name: "FaqsCreate",

  components: { FaqCreateEdit },

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
    async createFaq(data) {
      let response = await createFaq(data);

      if (response.error) return this.$displayServerResponse(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-faqs-entries" });
    },
  },
};
</script>
