<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">FAQ Category - Edit</h3>
      </div>
      <div class="py-3">
        <div v-if="showEdit" class="row">
          <div class="col-6">
            <FaqCategoriesCreateEdit
              mode="edit"
              :faq-category="faqCategory"
              @on-save="updateFaqCategory"
              @on-change="hasChanged = true"
              @on-delete="startDeletingFaqCategory"
              @on-item-publish="startPublishing"
              @on-item-unpublish="startUnpublishing"
            />
          </div>
          <div class="col-6">
            <FaqSubcategoriesList
              :list="children"
              :is-sub-category="isSubCategory"
            />
          </div>
        </div>
      </div>
      <modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2">
          <div class="h5">
            Are you sure you want to delete
            <b>{{ faqCategory.name }}</b
            >?
          </div>
          <div>
            Deleting a Faq category also deletes all it's children Faq
            categories as well as Faq Entries associated with it
          </div>
        </div>
        <template slot="footer">
          <ConfirmationButtonsWithInput
            :name="faqCategory.name"
            :placeholder="`To confirm type '${faqCategory.name}'`"
            :is-submitting="false"
            @on-confirm="deleteFaqCategory"
          />
        </template>
      </modal>
      <modal
        v-if="modalMode == 'publish'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to publish
          <b>{{ faqCategory.name }}</b
          >?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            @on-cancel="closeModal"
            @on-confirm="publishItem"
          />
        </template>
      </modal>
      <modal
        v-if="modalMode == 'unpublish'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to unpublish
          <b>{{ faqCategory.name }}</b
          >?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            @on-cancel="closeModal"
            @on-confirm="unpublishItem"
          />
        </template>
      </modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import FaqCategoriesCreateEdit from "@/components/AF/Faqs/Categories/FaqCategoriesCreateEdit";
import FaqSubcategoriesList from "@/components/AF/Faqs/Categories/FaqSubcategoriesList";
import {
  updateFaqCategory,
  getFaqCategory,
  deleteFaqCategory,
  publishFaqCategory,
  unpublishFaqCategory,
} from "@/services/AF/afFaqService";
import Modal from "@/components/Misc/Admin/AdminModal";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import ConfirmationButtonsWithInput from "@/components/Misc/Admin/ConfirmationButtonsWithInput.vue";

export default {
  name: "FaqCategoriesEdit",

  components: {
    FaqCategoriesCreateEdit,
    Modal,
    ConfirmationButtons,
    FaqSubcategoriesList,
    ConfirmationButtonsWithInput,
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
      hasChanged: false,
      faqCategory: {},
      showEdit: false,
      modalMode: "",
    };
  },

  computed: {
    isSubCategory() {
      return !!this.faqCategory.faq_category_id;
    },
    children() {
      return this.isSubCategory
        ? this.faqCategory.faqs
        : this.faqCategory.faq_categories;
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    async updateFaqCategory(data) {
      let response = await updateFaqCategory(this.$route.params.id, data);

      if (response.error) return this.$displayServerResponse(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-faqs-categories" });
    },

    async init() {
      let response = await getFaqCategory(this.$route.params.id);

      if (response.error) return this.$displayServerResponse(response);

      this.faqCategory = response;
      this.showEdit = true;
    },

    startDeletingFaqCategory() {
      this.openModal("delete");
    },

    startPublishing() {
      this.openModal("publish");
    },

    startUnpublishing() {
      this.openModal("unpublish");
    },

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
    },

    async deleteFaqCategory() {
      const response = await deleteFaqCategory(this.faqCategory.id);

      this.$displayServerResponse(response);

      this.closeModal();

      this.hasChanged = false;
      this.$router.push({ name: "af-faqs-categories" });
    },

    async publishItem() {
      const response = await publishFaqCategory(this.faqCategory.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async unpublishItem() {
      const response = await unpublishFaqCategory(this.faqCategory.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },
  },
};
</script>
