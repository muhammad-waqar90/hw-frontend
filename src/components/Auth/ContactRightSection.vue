<template>
  <div
    id="contactRightSection"
    class="d-flex flex-column justify-content-center align-items-center"
  >
    <create-ticket-form
      v-if="ticketSubjects"
      :ticket-subjects="ticketSubjects"
      :loading="loading"
      @on-save="storeTicket"
      @set-data-changed="setDataChanged"
    />
  </div>
</template>

<script>
import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";
import CreateTicketForm from "@/components/Ticket/CreateTicketForm";
import {
  getAllTicketSubjects,
  createTicket,
} from "@/services/GU/guTicketsService";
import { other } from "@/dataObject/tickets/ticketSubjectData";

import {
  required,
  minLength,
  maxLength,
  email,
  sameAs,
} from "vuelidate/lib/validators";

export default {
  name: "Tickets",
  components: { CreateTicketForm },

  mixins: [validationMixin, toastMixin],

  validations: {
    inputFirstName: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(20),
    },
    inputLastName: {
      required,
      minLength: minLength(2),
      maxLength: maxLength(20),
    },
    inputEmail: {
      required,
      email,
    },
    inputPassword1: {
      required,
      minLength: minLength(6),
    },
    inputPassword2: {
      sameAsPassword: sameAs("inputPassword1"),
    },
  },

  data() {
    return {
      inputFirstName: "",
      inputLastName: "",
      inputEmail: "",
      confirmEmail: "",
      inputPassword1: "",
      inputPassword2: "",
      check: false,
      ticketSubjects: [],
      loading: false,
    };
  },

  mounted() {
    this.getAllTicketSubjects();
  },

  methods: {
    async getAllTicketSubjects() {
      const response = await getAllTicketSubjects();
      if (response.error) return this.$displayServerResponse(response);

      this.ticketSubjects = response;
      this.ticketSubjects.push(other);
    },

    async storeTicket(ticketData) {
      this.loading = true;
      const response = await createTicket(ticketData);
      this.loading = false;

      if (response.error) return this.$displayServerResponse(response);

      this.$displayServerResponse(response);
      this.$router.push({ name: "homepage" });
    },
    setDataChanged(bool) {
      this.$emit("set-data-changed", bool);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
input.form-control {
  border-radius: 10px;
  height: 45px;
  font-size: 15px;
  background: $lightgray;
  border: none;
}
button.registerButton {
  border-radius: 20px;
  font-size: 18px;
}
textarea {
  background: $lightgray;
}
</style>
