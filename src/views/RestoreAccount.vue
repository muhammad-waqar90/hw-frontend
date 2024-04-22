<template>
  <div class="content">
    <div class="w-100 position-relative">
      <section
        class="registerSuccess shadow col-12 mt-2 mt-lg-5 mb-0 mx-auto border bg-white row py-3 py-lg-5 px-0 position-relative"
      >
        <RestoreAccount />
      </section>
      <router-link
        :to="{ name: 'gu-faq-dashboard' }"
        class="contactPageLink mx-auto text-uppercase text-white truncate"
      >
        <span class="d-flex justify-content-center mt-3">
          {{ $t("auth.contactPageLink") }}
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import RestoreAccount from "@/components/Auth/RestoreAccount.vue";
import toastMixin from "@/mixins/toastMixin";
import { mapGetters } from "vuex";

export default {
  name: "RestoreAccountView",
  components: { RestoreAccount },
  mixins: [toastMixin],
  computed: {
    ...mapGetters({
      restoreToken: "auth/getRestoreToken",
    }),
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.container {
  .content {
    width: 100%;
    min-height: calc(100vh - 112px);
    display: flex;
    justify-content: center;
    align-items: center;
    section.registerSuccess {
      border-radius: 20px;
      height: 620px;
      font-family: "Montserrat", sans-serif;
      overflow: hidden;
    }

    .contactPageLink {
      text-decoration: none;
      font-size: 14px;
      font-weight: bold;
      position: absolute;
      bottom: -35px;
      left: 50%;
      transform: translateX(-50%);
      &:hover {
        color: #313336;
      }
    }
  }
}

@media (max-width: $tabletWidth) {
  .container {
    .content {
      width: 100%;
      height: calc(100vh - 112px);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      section.registerSuccess {
        max-height: 60vh;
        overflow: inherit;
      }
    }
  }
}
</style>
