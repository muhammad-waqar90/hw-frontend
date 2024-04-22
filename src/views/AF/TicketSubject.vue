<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Ticket Subjects</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            :search-placeholder="'Search by name'"
            @on-search="handleSearch"
          />
        </div>
        <div>
          <router-link to="/af/tickets/subjects/create" class="me-2">
            <button class="btn blue-btn ms-2">
              <plus :size="15" />
              Create
            </button>
          </router-link>
        </div>
      </div>
      <div v-if="tickets">
        <TicketSubjects
          :tickets="tickets"
          @on-ticket-delete="startDeletingTicket"
        />
      </div>
      <div v-if="links.length">
        <PaginationButtons :links="links" />
      </div>
    </article>
    <modal
      v-if="modalMode == 'deleteTicket'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to delete
        <b>{{ selectedTicket.name }}</b
        >?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="deleteTicket"
        />
      </template>
    </modal>
  </section>
</template>

<script>
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import TicketSubjects from "@/components/AF/Tickets/TicketSubjects";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import toastMixin from "@/mixins/toastMixin";
import {
  getTicketSubjectList,
  deleteTicketSubject,
} from "@/services/AF/afTicketService";
import { linksToPath } from "@/utils/urlUtils";
import Plus from "vue-material-design-icons/Plus";
import Modal from "@/components/Misc/Admin/AdminModal";

export default {
  name: "ManageTicketSubjects",
  components: {
    PaginationButtons,
    Plus,
    Modal,
    SearchWithButton,
    TicketSubjects,
    ConfirmationButtons,
  },
  mixins: [toastMixin],
  data() {
    return {
      searchText: "",
      page: null,
      tickets: [],
      links: [],
      modalMode: "",
      selectedTicket: {},
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.page = this.$route.query.page;
      this.searchText = this.$route.query.searchText
        ? this.$route.query.searchText
        : "";
      this.tickets = [];
      this.links = [];

      const response = await getTicketSubjectList(this.searchText, this.page);

      if (response.error) return this.$displayError(response);

      this.tickets = response.data;
      this.links = linksToPath(this.$route.path, response.links);
    },

    startDeletingTicket(ticket) {
      this.selectedTicket = ticket;
      this.openModal("deleteTicket");
    },

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
      this.selectedTicket = null;
    },

    async deleteTicket() {
      const response = await deleteTicketSubject(this.selectedTicket.id);

      this.$displayServerResponse(response);
      this.init();
      this.closeModal();
    },

    async handleSearch(searchText) {
      if (searchText == this.searchText) return;
      this.$router.replace({
        query: { searchText: searchText },
      });
    },
  },
};
</script>
