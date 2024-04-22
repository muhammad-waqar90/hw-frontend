<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3>Product - Create</h3>
      </div>
      <div class="py-3">
        <ProductCreateEdit
          v-show="isTab('book_info')"
          :is-submitting="isSubmitting"
          @on-save="createProduct"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import ProductCreateEdit from "@/components/AF/Products/ProductsInfo/ProductCreateEdit.vue";
import { createProduct } from "@/services/AF/afProductService";

export default {
  name: "AFBookCreate",
  components: {
    ProductCreateEdit,
  },
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
      tab: "book_info",
      hasChanged: false,
      isSubmitting: false,
    };
  },
  methods: {
    isTab(item) {
      return this.tab === item;
    },
    setTab(item) {
      if (Object.keys(this.$route.query).length !== 0) this.$router.replace({});
      this.tab = item;
    },
    async createProduct(data) {
      this.isSubmitting = true;
      let response = await createProduct(data);

      if (response.error) {
        this.isSubmitting = false;
        return this.$displayError(response);
      }
      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({
        name: "af-product-overview",
      });
    },
  },
};
</script>
