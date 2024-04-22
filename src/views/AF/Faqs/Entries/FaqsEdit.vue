<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">FAQ Entry - Edit</h3>
      </div>
      <div class="py-3">
        <FaqCreateEdit
          v-if="showEdit"
          mode="edit"
          :faq-category="faq"
          @on-save="updateFaq"
          @on-change="hasChanged = true"
          @on-delete="startDeletingFaq"
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
          <b>"{{ selectedFaq.question }}"</b>?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            @on-cancel="closeModal"
            @on-confirm="deleteFaq"
          />
        </template>
      </modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import FaqCreateEdit from "@/components/AF/Faqs/Entries/FaqCreateEdit.vue";
import { updateFaq, getFaq, deleteFaq } from "@/services/AF/afFaqService";
import Modal from "@/components/Misc/Admin/AdminModal";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";

export default {
  name: "FaqEdit",

  components: { FaqCreateEdit, Modal, ConfirmationButtons },
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
      faq: {},
      showEdit: false,
      selectedFaq: {},
      modalMode: "",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async updateFaq(data) {
      let response = await updateFaq(this.$route.params.id, data);

      if (response.error) return this.$displayServerResponse(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "af-faqs-entries" });
    },

    async init() {
      let response = await getFaq(this.$route.params.id);

      if (response.error) return this.$displayServerResponse(response);

      this.faq = response;
      this.showEdit = true;
    },

    startDeletingFaq(item) {
      this.selectedFaq = item;
      this.openModal("delete");
    },

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
      this.selectedFaq = {};
    },

    async deleteFaq() {
      const response = await deleteFaq(this.selectedFaq.id);

      this.$displayServerResponse(response);

      this.closeModal();

      this.hasChanged = false;
      this.$router.push({ name: "af-faqs-entries" });
    },
  },
};
</script>
