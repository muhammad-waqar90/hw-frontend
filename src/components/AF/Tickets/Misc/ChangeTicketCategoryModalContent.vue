<template>
  <portal to="out-of-app-content">
    <Modal
      title="Change Ticket Category"
      :min-height="'300px'"
      @close-modal="onCancelUpdate"
    >
      <div class="form-group w-100 pt-2 h5">
        <label class="form-label">Ticket Category:</label>
        <select
          v-model="selectedTicketCategoryId"
          class="form-select text-lowercase"
        >
          <option
            v-for="item in parsedAvailableCategories"
            :key="item.value"
            :disabled="ticket.ticket_category_id == item.value"
            :value="item.value"
          >
            {{ item.name }}
          </option>
        </select>
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="onCancelUpdate"
          @on-confirm="onChangeTicketCategory"
        />
      </template>
    </Modal>
  </portal>
</template>

<script>
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";

import * as availableCategories from "@/dataObject/tickets/ticketCategoryData";

export default {
  components: {
    Modal,
    ConfirmationButtons,
  },
  props: {
    ticket: null,
  },
  data() {
    return {
      selectedTicketCategoryId: null,
      availableCategories,
    };
  },
  computed: {
    parsedAvailableCategories() {
      return Object.entries(this.availableCategories)
        .map(([key, value]) => {
          return { name: key, value };
        })
        .filter((item) => {
          if (item.value != this.availableCategories.LECTURE_QA) {
            if (item.value != availableCategories.REFUND) return true;
            return !!this.ticket.user_id;
          } else return false;
        });
    },
  },
  mounted() {
    this.selectedTicketCategoryId = this.ticket.ticket_category_id;
  },
  methods: {
    onChangeTicketCategory() {
      this.selectedTicketCategoryId &&
        this.$emit("change-ticket-category", this.selectedTicketCategoryId);
    },
    onCancelUpdate() {
      this.$emit("on-cancel-update");
    },
  },
};
</script>
