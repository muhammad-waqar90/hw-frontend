<template>
  <div class="container col-12 mt-3">
    <h3 class="mb-3">My Support Tickets</h3>

    <div class="row justify-content-center">
      <div class="col-5 light-gray-bg rounded-card screen-height m-3 p-3">
        <div class="row mb-3">
          <div class="col-6">
            <label class="form-label">Subject:</label>
            <SearchWithoutButtons
              :placeholder="$t('iu.ticket.searchBySubject')"
              @on-search="handleSearch"
            />
          </div>

          <div class="col-6">
            <label class="form-label">Status:</label>
            <select
              v-model="selectedStatus"
              type="text"
              class="form-select rounded-card"
              @change="resetList"
            >
              <option
                v-for="item in availableStatusesArray"
                :key="item.value"
                :value="item.value"
              >
                {{ item.name }}
              </option>
            </select>
          </div>
        </div>

        <MyTicketsList
          :tickets="ticketList"
          :selected-ticket-id="selectedTicketId"
          :individual-ticket-select="isIndividualTicketSelect"
          @select-ticket="handleOpenTicket"
          @load-more-tickets="loadMoreTickets"
          @init-ticket-list="init"
        />
      </div>
      <div class="col-6 bg-white rounded-card m-3 py-3">
        <Ticket
          :selected-ticket-id="selectedTicketId"
          @reset-list="resetList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import MyTicketsList from "@/components/AF/Tickets/MyTicketsList";
import Ticket from "@/components/AF/Tickets/Ticket";
import SearchWithoutButtons from "@/components/Misc/Admin/SearchWithoutButtons";

import { getTicket, getMyTicketList } from "@/services/AF/afTicketService";
import { getNextPage } from "@/services/generalService";
import { removeDuplicatesByKey } from "@/utils/generalUtils";

import * as availableStatuses from "@/dataObject/tickets/ticketStatusData";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "MySupportTickets",

  components: {
    MyTicketsList,
    Ticket,
    SearchWithoutButtons,
  },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      loading: false,
      ticketList: [],
      selectedStatus: null,
      selectedSubject: null,
      selectedTicketId: null,
      nextPageUrl: null,
      isIndividualTicketSelect: false,

      selectedTicketCategory: {},

      availableStatuses,
    };
  },

  computed: {
    availableStatusesArray() {
      const array = Object.entries(this.availableStatuses)
        .map(([key, value]) => {
          return { name: key, value };
        })
        .filter((item) => {
          return (
            item.value == availableStatuses.IN_PROGRESS ||
            item.value == availableStatuses.RESOLVED ||
            item.value == availableStatuses.ON_HOLD
          );
        });

      array.push({ name: "ALL", value: null });

      return array;
    },
  },

  watch: {
    $route() {
      if (this.$route.params.id !== this.selectedTicketId)
        this.handleOpenTicket(
          this.$route.params.id,
          this.$route.query?.individualTicketSelect == true
        );
    },
    selectedTicketId() {
      if (this.$route.params.id != this.selectedTicketId)
        this.$router.replace({
          name: "af-my-support-tickets",
          params: { id: this.selectedTicketId },
        });
    },
  },

  mounted() {
    this.init(this.$route.params.id);
    if (this.$route.query.individualTicketSelect)
      this.isIndividualTicketSelect = this.$route.query.individualTicketSelect;
  },

  methods: {
    async init(selectedTicketId = null) {
      this.isIndividualTicketSelect = this.$route.query.individualTicketSelect
        ? this.$route.query.individualTicketSelect
        : false;

      this.loading = true;
      this.ticketList = [];
      this.selectedTicketId = selectedTicketId;

      var response;
      this.isIndividualTicketSelect
        ? (response = await getTicket(this.selectedTicketId))
        : (response = await getMyTicketList(
            this.selectedStatus,
            this.selectedSubject
          ));

      if (response.error) {
        this.$displayServerResponse(response);
        return (this.loading = false);
      }

      this.mapTicketData(response);

      if (this.ticketList.length && !this.$isMobile)
        this.handleOpenTicket(
          selectedTicketId ? selectedTicketId : this.ticketList[0].id,
          true
        );

      this.loading = false;
    },

    mapTicketData(response) {
      if (this.isIndividualTicketSelect) {
        this.ticketList = new Array({
          ...response.ticket,
          latest_ticket_message: response.messages.data[0].message,
        });
        this.$route.query.redirect = false;
        this.$route.query.individualTicketSelect = false;
      } else {
        this.ticketList = response.data;
        this.nextPageUrl = response.next_page_url;
        if (this.$route.query.redirect && this.$route.params.id)
          this.$route.query.redirect = false;
      }
    },

    async loadMoreTickets() {
      if (!this.nextPageUrl) return;

      const response = await getNextPage(this.nextPageUrl);
      if (response.error) return this.$displayServerResponse(response);

      this.ticketList = removeDuplicatesByKey(
        [...this.ticketList, ...response.data],
        "id"
      );
      this.nextPageUrl = response.next_page_url;
    },

    handleSearch(searchText) {
      if (searchText == this.selectedSubject) return;
      this.selectedSubject = searchText;
      this.selectedTicketId = null;
      this.init();
    },

    resetList() {
      this.selectedTicketId = null;
      this.init();
    },

    handleOpenTicket(id, setFirst = false) {
      this.selectedTicketId = id;
      this.ticketList = this.ticketList.map((item) => {
        if (item.id != id) return item;
        item.seen_by_me = 1;
        return item;
      });
      if (setFirst)
        this.ticketList = this.ticketList.sort((x, y) => {
          return x.id == id ? -1 : y.id == id ? 1 : 0;
        });
      if (this.$route.params.id != this.selectedTicketId)
        this.$router.replace({
          name: "af-my-support-tickets",
          params: { id: this.selectedTicketId },
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.light-gray-bg {
  background-color: $lightgray;
}
.screen-height {
  height: 80vh;
  min-height: 650px;
}
</style>
