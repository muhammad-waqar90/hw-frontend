<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3>Product ({{ product.name }}) - Edit</h3>
      </div>
      <div class="py-3">
        <ProductCreateEdit
          v-if="showEdit"
          mode="edit"
          :product="product"
          :is-submitting="isSubmitting"
          :is-allow-add-delete="true"
          @on-save="updateProduct"
          @on-change="hasChanged"
          @on-delete="startDeletingProduct"
        />
      </div>
      <Modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete product
          <b>"{{ selectedProduct.name }}"</b>? <br />
        </div>
        <template slot="footer">
          <ConfirmationButtonsWithInput
            :name="selectedProduct.name"
            :placeholder="
              'Please type the product name for confirming the delete action e.g ' +
              selectedProduct.name
            "
            :is-submitting="isSubmitting"
            loading-label="Deleting..."
            @on-confirm="deleteProduct"
          />
        </template>
      </Modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import ProductCreateEdit from "@/components/AF/Products/ProductsInfo/ProductCreateEdit.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";
import {
  getProduct,
  updateProduct,
  deleteProduct,
} from "@/services/AF/afProductService";
import permissionsMixin from "@/mixins/AF/permissionsMixin";

export default {
  name: "AFProductEdit",
  components: {
    ProductCreateEdit,
    Modal,
    ConfirmationButtonsWithInput,
  },
  mixins: [toastMixin, permissionsMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasProductChanged || this.hasEntityChanged)
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
      hasProductChanged: false,
      showEdit: false,
      product: {},
      selectedProduct: {},
      modalMode: "",
      isSubmitting: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      let response = await getProduct(this.$route.params.id);

      if (response.error) return this.$displayError(response);
      this.product = response;
      this.showEdit = true;
    },
    async updateProduct(data) {
      this.isSubmitting = true;
      let response = await updateProduct(this.$route.params.id, data);
      this.isSubmitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasProductChanged = false;
      this.$router.push({
        name: "af-product-overview",
      });
    },
    startDeletingProduct(item) {
      this.selectedProduct = item;
      this.openModal("delete");
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
      this.selectedProduct = {};
    },
    async deleteProduct() {
      this.isSubmitting = true;
      const response = await deleteProduct(this.selectedProduct.id);
      this.isSubmitting = false;

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.closeModal();
      this.hasProductChanged = false;
      this.$router.push({ name: "af-products" });
    },
    hasChanged(key, value) {
      this.hasProductChanged = this.product[key] != value;
    },
    isTab(item) {
      return this.tab === item;
    },
    setTab(item) {
      if (Object.keys(this.$route.query).length !== 0) this.$router.replace({});
      this.tab = item;
    },
    reload() {
      this.init();
    },
  },
};
</script>
