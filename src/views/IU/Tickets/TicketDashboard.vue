<template>
  <div class="position-relative overflow-hidden">
    <div class="content tickets-dashboard-outer">
      <div
        class="row search-create-section-outer"
        :class="{
          'my-tickets-section--inactive': selectedTicketId || mode == 'create',
        }"
      >
        <div class="col">
          <SearchWithoutButtons
            :placeholder="$t('iu.ticket.searchBySubject')"
            :search-text-prop="selectedSubject"
            @on-search="handleSearch"
          />
        </div>
        <div class="col-auto px-3 mt-3 mt-lg-0" :class="{ 'w-100': $isMobile }">
          <ButtonWithLoading
            class="btn blue-btn rounded-card h-100 py-lg-0"
            :disabled="mode == 'create'"
            @action="handleModeChange('create')"
          >
            <slot>
              <plus :size="25" />
              {{ $t("iu.ticket.reportIssueCreateTicket") }}
            </slot>
          </ButtonWithLoading>
        </div>
      </div>
      <div class="row mt-3">
        <div
          class="col my-tickets-outer"
          :class="{
            'my-tickets-section--inactive':
              selectedTicketId || mode == 'create',
          }"
        >
          <div class="bg-white rounded-card h-100">
            <MyTicketList
              :ticket-list="ticketList"
              :selected-ticket-id="selectedTicketId"
              :selected-status="selectedStatus"
              :loading="loading"
              :individual-ticket-select="isIndividualTicketSelect"
              @status-change="handleStatusChange"
              @init-ticket-list="init"
              @load-more-tickets="loadMoreTickets"
              @opened-ticket="handleOpenTicket"
            />
          </div>
        </div>
        <div
          class="col ticket-outer"
          :class="{
            'ticket-outer--active': selectedTicketId || mode == 'create',
          }"
        >
          <div class="bg-white rounded-card h-100">
            <template v-if="mode == 'ticket' && !loading">
              <Ticket
                v-if="mode == 'ticket' && !loading"
                :selected-ticket-id="selectedTicketId"
                @status-change="handleStatusChange"
                @on-back="onBack"
                @set-data-changed="setDataChanged"
              />
            </template>
            <template v-if="mode == 'create'">
              <TicketCreate
                @ticket-created="
                  handleStatusChange(availableStatuses.UNCLAIMED)
                "
                @on-back="onBack"
                @set-data-changed="setDataChanged"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
    <portal to="out-of-app-content">
      <WarningModal
        v-if="displayModal"
        :with-confirmation-buttons="true"
        :only-confirm="false"
        :hide-close-button="false"
        @close-modal="closeModal"
        @on-confirm="handleRoute()"
      >
        <b slot="body">
          {{ $t("iu.profile.areYouSure") }}
        </b>
      </WarningModal>
    </portal>
  </div>
</template>

<script>
import TicketCreate from "./TicketCreate.vue";
import SearchWithoutButtons from "@/components/Misc/Admin/SearchWithoutButtons.vue";
import MyTicketList from "@/components/IU/Tickets/MyTicketList.vue";
import Ticket from "./Ticket.vue";

import Plus from "vue-material-design-icons/Plus";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";

import { getMyTicketList, getTicket } from "@/services/IU/iuTicketService";
import toastMixin from "@/mixins/toastMixin";
import { getNextPage } from "@/services/generalService";
import { removeDuplicatesByKey } from "@/utils/generalUtils";
import * as availableStatuses from "@/dataObject/tickets/ticketStatusData";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";
import WarningModal from "@/components/Misc/WarningModal";

export default {
  name: "TicketDashboard",
  components: {
    MyTicketList,
    SearchWithoutButtons,
    Plus,
    ButtonWithLoading,
    Ticket,
    TicketCreate,
    WarningModal,
  },
  mixins: [toastMixin, devicesMixin, backButtonMixin],
  beforeRouteLeave(to, from, next) {
    if (this.dataChanged) {
      this.displayModal = true;
      this.nextRoute = next;
      return;
    }
    next();
  },
  data() {
    return {
      ticketList: [],
      selectedStatus: null,
      selectedSubject: null,
      nextPageUrl: null,
      selectedTicketId: null,
      mode: "ticket",
      availableStatuses,
      loading: false,
      dataChanged: false,
      isIndividualTicketSelect: false,
      displayModal: false,
      nextRoute: null,
      modalPromise: false,
      resolveModal: null,
      updateComponent: false,
    };
  },
  watch: {
    $route() {
      if (this.$route.params.id !== this.selectedTicketId)
        this.handleOpenTicket(this.$route.params.id);
    },
  },
  mounted() {
    this.setDefaultRoute("iu-faq-dashboard");
    this.selectedTicketId = this.$route.params.id;
    if (this.$route.query.individualTicketSelect)
      this.isIndividualTicketSelect = this.$route.query.individualTicketSelect;
    this.init(this.selectedTicketId);
  },
  methods: {
    async init(selectId = null) {
      this.isIndividualTicketSelect = this.$route.query.individualTicketSelect
        ? this.$route.query.individualTicketSelect
        : false;
      if (!this.selectedTicketId) this.selectedTicketId = selectId;
      this.loading = true;
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
      if (this.$route.query.createSystemTicket) {
        this.loading = false;
        return this.handleModeChange("create");
      }
      if (this.ticketList.length && !this.$isMobile)
        this.handleOpenTicket(
          selectId ? selectId : this.ticketList[0].id,
          true
        );

      this.loading = false;
    },
    mapTicketData(response) {
      if (this.isIndividualTicketSelect) {
        this.ticketList = new Array({
          ...response?.ticket,
          latest_ticket_message: response?.messages?.data?.[0]?.message,
        });
        this.$route.query.redirect = false;
        this.$route.query.individualTicketSelect = false;
      } else {
        this.ticketList = response?.data;
        this.nextPageUrl = response?.next_page_url;
        if (this.$route.query.redirect && this.$route.params.id)
          this.$route.query.redirect = false;
      }
    },
    async handleStatusChange(value) {
      if (await this.handleChange()) return;
      this.handleModeChange("ticket");
      this.selectedStatus = value;
      if (!this.$isMobile) this.selectedTicketId = null;
      let redirectedTicketId = null;
      if (this.$route.query.redirect && this.$route.params.id) {
        redirectedTicketId = this.$route.params.id;
        this.$route.query.redirect = false;
      }

      this.init(redirectedTicketId);
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
    async handleSearch(searchText) {
      if (await this.handleChange()) return;
      this.handleModeChange("ticket");
      if (searchText == this.selectedSubject) return;
      this.selectedSubject = searchText;
      this.selectedTicketId = null;
      this.init();
    },
    async handleOpenTicket(id, setFirst = false) {
      if (await this.handleChange()) return;
      this.handleModeChange("ticket");
      this.selectedTicketId = id;
      this.ticketList = this.ticketList.map((item) => {
        if (item.id != id) return item;
        item.seen_by_me = 1;
        return item;
      });
      if (setFirst)
        this.ticketList.sort((x, y) => {
          return x.id == id ? -1 : y.id == id ? 1 : 0;
        });
      if (
        this.$router.name == "iu-ticket-dashboard" &&
        this.$route.params.id != this.selectedTicketId
      )
        this.$router.replace({
          name: "iu-ticket-dashboard",
          params: { id: this.selectedTicketId },
        });
    },
    async handleModeChange(mode) {
      if (await this.handleChange()) return;
      this.mode = mode;
      if (this.mode == "create") this.selectedTicketId = null;
    },
    onBack(navigate) {
      this.handleModeChange("ticket");
      this.selectedTicketId = null;
      if (navigate) this.$router.replace({ name: "iu-ticket-dashboard" });
    },
    setDataChanged(bool) {
      this.dataChanged = bool;
    },
    async handleChange() {
      if (this.dataChanged) {
        this.modalPromise = true;
        await this.handlePopup();
        if (!this.updateComponent) {
          this.updateComponent = false;
          return true;
        } else {
          this.dataChanged = false;
          return false;
        }
      }
      return false;
    },
    closeModal() {
      this.displayModal = false;
      this.updateComponent = false;
      this.mountBackButton();
      if (!this.modalPromise) return (this.nextRoute = null);
      this.resolveModal();
      this.modalPromise = false;
    },
    handleRoute() {
      this.displayModal = false;
      this.updateComponent = true;
      if (!this.modalPromise) return this.nextRoute();
      this.resolveModal();
      this.modalPromise = false;
    },
    handlePopup() {
      return new Promise((resolve) => {
        this.displayModal = true;
        this.resolveModal = resolve;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.my-tickets-outer {
  min-height: 650px;
  flex: 0 0 450px;
}
.tickets-dashboard-outer {
  overflow: hidden;
}

@media (max-width: $smallPhoneWidth) {
  .ticket-outer {
    height: calc(var(--vh, 1vh) * 100 - 50px) !important;
  }
}
@media (max-width: $laptopWidth) {
  .ticket-outer {
    position: absolute;
    top: 0px;
    left: 0px;
    transform: translateX(100vw);
    transition: all, 0.3s ease-in-out;
    padding-left: 0px;
    padding-right: 0px;
    height: calc(var(--vh, 1vh) * 100 - 129px);
    &.ticket-outer--active {
      transform: translateX(0);
    }
  }
  .my-tickets-outer {
    flex: 0 0 100%;
    transition: all, 0.3s ease-in-out;
  }
  .tickets-dashboard-outer {
    transition: all, 0.3s ease-in-out;
  }
  .my-tickets-section--inactive {
    transform: translateX(-100vw);
  }
  .search-create-section-outer {
    transition: all, 0.3s ease-in-out;
  }
}
</style>
