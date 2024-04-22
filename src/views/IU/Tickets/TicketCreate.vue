<template>
  <div class="p-4 h-100">
    <div v-if="$isMobile" class="mb-3">
      <ChevronLeftCircle
        class="cursor-pointer"
        :size="29"
        fill-color="#4D4D4D"
        @click="$emit('on-back')"
      />
    </div>
    <template v-if="sectionLoading">
      <div class="h-100 pt-5">
        <LoadingTicketCreate />
      </div>
    </template>
    <CreateTicketForm
      v-if="ticketSubjectList.length"
      :ticket-subjects="ticketSubjectList"
      :mode="'user'"
      :loading="loading"
      @on-save="storeTicket"
      @set-data-changed="setDataChanged"
    />
  </div>
</template>

<script>
import CreateTicketForm from "@/components/Ticket/CreateTicketForm";
import LoadingTicketCreate from "@/components/IU/Tickets/LoadingTicketCreate";
import {
  getAllTicketSubjects,
  createTicket,
} from "@/services/IU/iuTicketService";
import { other as otherSubject } from "@/dataObject/tickets/ticketSubjectData";

import ChevronLeftCircle from "vue-material-design-icons/ChevronLeftCircle";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    CreateTicketForm,
    LoadingTicketCreate,
    ChevronLeftCircle,
  },
  mixins: [toastMixin, devicesMixin],
  data() {
    return {
      ticketSubjectList: [],
      loading: false,
      sectionLoading: false,
    };
  },
  mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.sectionLoading = true;
      const response = await getAllTicketSubjects();
      this.sectionLoading = false;
      if (response.error) return this.$displayServerResponse(response);

      this.ticketSubjectList = response;
      this.ticketSubjectList.push(otherSubject);
    },
    async storeTicket(ticketData) {
      this.loading = true;
      const response = await createTicket(ticketData);
      this.loading = false;

      this.$displayServerResponse(response);
      if (response.error) return;

      this.$emit("ticket-created", response.data.id);
    },
    setDataChanged(bool) {
      this.$emit("set-data-changed", bool);
    },
  },
};
</script>
