<template>
  <section v-if="!loading && !display404" class="font-montserrat">
    <ProductPreview :book="book" :category="category" />
  </section>

  <section v-else-if="display404">
    <PageNotFound />
  </section>
</template>

<script>
import { getProductService as iuGetProductService } from "@/services/iuService";

import ProductPreview from "@/components/IU/Products/ProductPreview";
import PageNotFound from "@/views/PageNotFound.vue";

import toastMixin from "@/mixins/toastMixin";
import userRoleMixin from "@/mixins/User/userRoleMixin";
import metaTagsUpdateMixin from "@/mixins/Misc/metaTagsUpdateMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";

export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: "Product",

  components: { ProductPreview, PageNotFound },

  mixins: [toastMixin, userRoleMixin, metaTagsUpdateMixin, backButtonMixin],

  data() {
    return {
      id: this.$route.params.id,
      loading: true,
      book: {},
      category: {},
      display404: false,
    };
  },
  computed: {
    getProductService() {
      return iuGetProductService;
    },
  },

  mounted() {
    //so that this view properly works with hot reloading in development env
    if (process.env.NODE_ENV == "development") this.init();
  },

  activated() {
    this.init();
  },

  methods: {
    async init() {
      this.id = this.$route.params.id;
      const response = await this.getProductService(this.id);
      if (response.error) return this.handleProductErr(response);

      this.handleProductRes(response);
      this.loading = false;
    },

    handleProductRes(response) {
      // book
      const { ...bookData } = response;

      this.book = bookData;

      this.$updateMeta(this.book.name);
    },

    handleProductErr(response) {
      this.$displayError(response);

      if (response.status === 404) return (this.display404 = true);
      if (response.status == 403)
        return this.$router.replace({ name: "homepage" });
    },
  },
};
</script>
