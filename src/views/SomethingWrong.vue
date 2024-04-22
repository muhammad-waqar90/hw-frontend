<template>
  <div class="container px-0 my-2 font-montserrat">
    <PageBackButton @on-back="$router.go(-1)" />
    <div
      class="bg-white rounded-card d-flex justify-content-center align-items-center flex-column px-5 pt-5"
    >
      <h1 class="text-404">OOPS!</h1>
      <hr class="w-50 mt-0 mb-5" />
      <h2 class="color-blue font-weight-600">SOMETHING WENT WRONG</h2>
      <p>
        Please try again. If this continues to happen, please create a ticket.
      </p>
      <button
        class="btn blue-btn rounded-card btn-text font-weight-600 px-4"
        @click="onCreateTicketClick"
      >
        CREATE A TICKET
      </button>
      <svg-bottom-hijaz-logo class="bottom-svg mt-4" />
    </div>
  </div>
</template>

<script>
import SvgBottomHijazLogo from "@/assets/svg/bottomHijazLogo.svg";
import PageBackButton from "@/components/Misc/BackButtons/PageBackButton";
export default {
  name: "SomethingWrong",
  components: {
    SvgBottomHijazLogo,
    PageBackButton,
  },
  methods: {
    onCreateTicketClick() {
      this.handleRedirect("iu-ticket-dashboard");
    },
    handleRedirect(name) {
      return this.$router.push({
        name: name,
        query: { createSystemTicket: true },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
p {
  font-size: 24;
  font-weight: 600;
  color: #bac7d9;
}
.text-404 {
  font-size: 160px;
  font-weight: 700;
  color: #bac7d9;
}

.color-blue {
  color: $blue;
}

.bottom-svg {
  width: 100%;
  height: 180px;
}

.btn-text {
  font-size: 12px;
}
</style>
