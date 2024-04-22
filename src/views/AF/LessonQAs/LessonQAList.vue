<template>
  <section class="container-fluid">
    <article id="enrolled-courses" class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Lecture Q&A Tickets</h3>
      </div>
      <div class="my-2 d-flex justify-content-between">
        <div class="position-relative d-flex align-items-baseline">
          <SearchWithButton
            :search-text-prop="subject"
            :search-placeholder="'Search by lecture'"
            :toggle-clear-data="toggleClearSearch"
            @on-search="handleSearch"
          />
          <div class="text-end truncate">
            <button class="btn btn-secondary ms-2" @click="reset">
              Reset Params
            </button>
          </div>
        </div>
        <div class="d-flex justify-content-end">
          <div class="position-relative ms-4 d-flex align-items-baseline">
            <label class="me-2 word-break-normal">Category:</label>
            <select v-model="category" class="form-select" @change="search()">
              <option
                v-for="(cat, index) in categories"
                :key="index"
                :value="cat.id"
              >
                {{ cat.name }}
              </option>
            </select>
          </div>
          <div class="position-relative ms-4 d-flex align-items-baseline">
            <label class="me-2 word-break-normal">Status:</label>
            <select v-model="status" class="form-select" @change="search()">
              <option
                v-for="(stat, index) in statuses"
                :key="index"
                :value="stat.id"
              >
                {{ stat.name }}
              </option>
            </select>
          </div>
          <div class="position-relative ms-4 d-flex align-items-baseline">
            <button class="btn blue-btn truncate" @click="isOpen = true">
              Find by ID
            </button>
          </div>
        </div>
      </div>
      <modal
        v-if="isOpen"
        title="Search Tickets by Id"
        :min-height="'300px'"
        @close-modal="isOpen = false"
      >
        <div class="w-100 pt-2">
          <div class="h5 d-flex flex-column form-group">
            <label> Type in a ticket id: </label>
            <input
              v-model="ticketId"
              type="number"
              placeholder="Ticket id..."
              class="form-control"
              @keydown.enter="goToTicket"
              @keydown="sanitizeNumberKey"
            />
          </div>
          <div class="form-group d-flex justify-content-end">
            <button
              :disabled="!ticketId"
              class="btn blue-btn"
              @click="goToTicket"
            >
              Search
            </button>
          </div>
        </div>
      </modal>
      <div>
        <TicketList
          subject="Lecture"
          :tickets="ticketsApiState.data"
          to="/af/lesson/qas/"
          @on-ticket-claim="ticketClaim"
        />
      </div>
      <div v-if="ticketsApiState.meta?.links">
        <PaginationButtons :links="ticketsApiState.meta.links" />
      </div>
    </article>
  </section>
</template>

<script>
import TicketList from "@/components/AF/Tickets/TicketList.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";

import toastMixin from "@/mixins/toastMixin";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

import {
  getTicketList,
  claimTicket,
  getTicket,
} from "@/services/AF/afTicketService";
import { sanitizeNumberKey } from "@/utils/generalUtils";
import Modal from "@/components/Misc/Admin/AdminModal";
import {
  UNCLAIMED,
  IN_PROGRESS,
  RESOLVED,
  REOPENED,
} from "@/dataObject/tickets/ticketStatusData";
import { LECTURE_QA } from "@/dataObject/tickets/ticketCategoryData";

export default {
  name: "LessonQAList",

  components: {
    PaginationButtons,
    TicketList,
    Modal,
    SearchWithButton,
  },

  mixins: [toastMixin, permissionsMixin, apiMixin],

  data() {
    return {
      page: null,
      categories: [],
      statuses: [],
      subject: null,
      status: null,
      category: LECTURE_QA,
      tickets: [],
      links: [],
      isOpen: false,
      ticketId: null,
      toggleClearSearch: false,
      ticketsApiState: getApiState(),
    };
  },

  watch: {
    $route() {
      this.page = this.$route.query.page ? this.$route.query.page : null;
      this.subject = this.$route.query.subject
        ? this.$route.query.subject
        : null;
      this.status = this.$route.query.status ? this.$route.query.status : null;
      this.category = this.$route.query.category
        ? this.$route.query.category
        : LECTURE_QA;
      this.init();
    },
  },
  created() {
    this.mapData();
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      await this.$fetchApiData(this.ticketsApiState, () =>
        getTicketList(this.status, this.category, this.subject, this.page)
      );
    },

    async goToTicket() {
      const response = await getTicket(this.ticketId);

      if (response.error) return this.$displayError(response);

      this.$router.push(`/af/tickets/${this.ticketId}`);
    },

    clearSearch() {
      this.subject = "";
      this.search();
    },

    handleDelete() {
      if (!this.subject) {
        this.search();
      }
    },

    async ticketClaim(ticket) {
      const response = await claimTicket(ticket.id);

      if (response.error) this.$displayServerResponse(response);

      this.$displayServerResponse(response);

      this.init();
    },

    handleSearch(data) {
      this.subject = data;
      this.search();
    },

    search() {
      const query = {};
      if (this.subject) query.subject = this.subject;
      if (this.category) query.category = this.category;
      if (this.status) query.status = this.status;

      if (
        this.$route.query.subject != query.subject ||
        this.$route.query.category != query.category ||
        this.$route.query.status != query.status ||
        this.$route.query.page != this.page
      )
        this.$router.replace({
          query,
        });
    },

    mapData() {
      this.categories.push({ name: "Lecture Q&A", id: LECTURE_QA });

      this.statuses.push(
        { name: "unclaimed", id: UNCLAIMED },
        { name: "in progress", id: IN_PROGRESS },
        { name: "resolved", id: RESOLVED },
        { name: "reopened", id: REOPENED },
        { name: "all", id: null }
      );

      if (this.$route.query.page) this.page = this.$route.query.page;
      if (this.$route.query.subject) this.subject = this.$route.query.subject;
      if (this.$route.query.status) this.status = this.$route.query.status;
      if (this.$route.query.category)
        this.category = this.$route.query.category;
    },
    reset() {
      this.status = UNCLAIMED;
      this.subject = null;
      this.category = LECTURE_QA;
      this.page = null;
      this.toggleClearSearch = !this.toggleClearSearch;

      this.search();
    },
    sanitizeNumberKey,
  },
};
</script>

<style lang="scss" scoped>
select {
  min-width: 180px;
}
.clear-input {
  top: -3px;
  right: 0;
}
.truncate {
  white-space: nowrap;
}
</style>
