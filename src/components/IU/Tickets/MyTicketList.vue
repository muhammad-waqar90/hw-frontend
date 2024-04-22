<template>
  <div class="px-4 pt-4 pb-3">
    <div class="row">
      <div class="col-12">
        <h4 class="mb-0 text-lg-start text-center color-gray">
          {{ $t("iu.ticket.myTickets") }}
        </h4>
      </div>
    </div>
    <hr />
    <div>
      <TicketStatusFilter
        :selected-status="selectedStatus"
        @status-change="handleStatusChange"
      />
    </div>
    <div class="mt-4">
      <div
        v-if="ticketList.length && !loading"
        ref="ticketList"
        class="tickets-list position-relative pb-3 scrollbar-blue pe-2"
      >
        <div
          v-for="item in ticketList"
          :key="item.id"
          class="rounded-card ticket-item text-dark-gray mt-3 p-4 cursor-pointer"
          :class="selectedTicketId == item.id && 'active'"
          @click="handleOpenTicket(item.id)"
        >
          <MyTicketListItem :ticket="item" />
        </div>
        <Observer
          v-if="showObserver && !individualTicketSelect"
          :on-observed="loadMoreTickets"
          :custom-css="observerCustomCss"
        />
        <div
          v-if="individualTicketSelect"
          class="d-flex justify-content-center my-3"
        >
          <button
            class="btn blue-btn btn-font font-weight-600 rounded-card px-3"
            @click="$emit('init-ticket-list')"
          >
            GO BACK TO ALL TICKETS
          </button>
        </div>
      </div>
      <template v-else>
        <div class="text-center tickets-list scrollbar-blue">
          <template v-if="loading">
            <LoadingTicketList />
          </template>
          <template v-else>
            <TicketsNotFound />
          </template>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Observer from "@/components/Misc/Observer";
import TicketStatusFilter from "@/components/IU/Tickets/MyTicketList/TicketStatusFilter";
import MyTicketListItem from "@/components/IU/Tickets/MyTicketList/MyTicketListItem";
import TicketsNotFound from "@/components/IU/Tickets/MyTicketList/TicketsNotFound";
import LoadingTicketList from "@/components/IU/Tickets/MyTicketList/LoadingTicketList";
export default {
  components: {
    TicketStatusFilter,
    MyTicketListItem,
    TicketsNotFound,
    LoadingTicketList,
    Observer,
  },
  props: {
    ticketList: {
      type: Array,
      default: () => [],
    },
    selectedTicketId: null,
    selectedStatus: null,
    loading: {
      type: Boolean,
    },
    individualTicketSelect: false,
  },
  data() {
    return {
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
      showObserver: true,
    };
  },
  watch: {
    ticketList() {
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
    $route() {
      if (this.$route.query.redirect) this.$emit("status-change", null);
    },
  },
  methods: {
    handleStatusChange(value) {
      this.$emit("status-change", value);
      if (this.$refs.ticketList) this.$refs.ticketList.scrollTop = 0;
    },
    loadMoreTickets() {
      this.$emit("load-more-tickets");
      this.showObserver = false;
    },
    handleOpenTicket(id) {
      this.$emit("opened-ticket", id);
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.ticket-item {
  display: block;
  background-color: $lightgray;
  border: 2px solid $lightgray;
}
.active {
  border: 2px solid $blue;
}
.tickets-list {
  height: calc(100vh - 400px);
  overflow: auto;
}
.tickets-list > div:first-child {
  margin-top: 0 !important;
}
.btn-font {
  font-size: 14px;
}
@media (max-width: $smallPhoneWidth) {
  .tickets-list {
    height: calc(100vh - 300px);
  }
}
@media (min-width: $smallPhoneWidth) and (max-width: $laptopWidth) {
  .tickets-list {
    height: calc(100vh - 395px);
  }
}
</style>
