<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Category - Edit</h3>
      </div>
      <div class="py-3">
        <CategoryCreateEdit
          v-if="showEdit"
          :category="category"
          mode="edit"
          @on-save="updateCategory"
          @on-change="checkHasChanged"
          @on-delete="startDeletingCategory"
        />
      </div>
      <modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete
          <b>"{{ category.name }}"</b>?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            @on-cancel="closeModal"
            @on-confirm="deleteCategory"
          />
        </template>
      </modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import CategoryCreateEdit from "@/components/AF/Category/CategoryCreateEdit.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import {
  getCategory,
  updateCategory,
  deleteCategory,
} from "@/services/AF/afCategoryService";

export default {
  name: "CategoryEdit",
  components: {
    CategoryCreateEdit,
    Modal,
    ConfirmationButtons,
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
      showEdit: false,
      hasChanged: false,
      category: {},
      modalMode: "",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      let response = await getCategory(this.$route.params.id);

      if (response.error) return this.$displayError(response);

      this.category = response;
      this.showEdit = true;
    },
    async updateCategory(data) {
      let response = await updateCategory(this.$route.params.id, data);

      if (response.error) return this.$displayError(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-category" });
    },
    startDeletingCategory(item) {
      this.category = item;
      this.openModal("delete");
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
      this.category = {};
    },
    async deleteCategory() {
      const response = await deleteCategory(this.category.id);

      if (response.error) return this.handleDeleteError(response);

      this.$displayServerResponse(response);
      this.closeModal();

      this.hasChanged = false;
      this.$router.push({ name: "af-category" });
    },

    handleDeleteError(response) {
      this.$displayError(response);
      if (response.status == 400) this.closeModal();
    },

    checkHasChanged(key, value) {
      this.hasChanged = this.category[key] != value;
    },
  },
};
</script>
