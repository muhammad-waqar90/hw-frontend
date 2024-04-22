<template>
  <div
    :class="{ 'full-height': !$isPhone }"
    class="d-flex justify-content-center"
  >
    <div class="container font-montserrat my-auto">
      <div class="row custom-container bg-white rounded-card">
        <div v-if="!$isPhone" class="col-6 px-0">
          <ContactLeftSection />
        </div>
        <div class="col-12 col-md-6 form-padding">
          <ContactRightSection @set-data-changed="setDataChanged" />
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
/**
 * Vuelidate annotation
 * @property { object } $v
 */
import ContactRightSection from "@/components/Auth/ContactRightSection";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import WarningModal from "@/components/Misc/WarningModal";

export default {
  name: "Contact",

  components: {
    ContactRightSection,
    ContactLeftSection: () =>
      import(
        /* webpackChunkName: "ContactLeftSectionComponent" */ "@/components/Auth/ContactLeftSection"
      ),
    WarningModal,
  },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      displayModal: false,
      nextRoute: null,
    };
  },

  beforeRouteLeave(to, from, next) {
    if (this.dataChanged) {
      this.displayModal = true;
      this.nextRoute = next;
    } else next();
  },

  methods: {
    setDataChanged(bool) {
      this.dataChanged = bool;
    },
    closeModal() {
      this.displayModal = false;
      this.$router.go(1);
      this.nextRoute = null;
    },
    handleRoute() {
      this.displayModal = false;
      this.nextRoute();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.custom-container {
  min-height: 605px;
}

.full-height {
  min-height: calc(95vh - 56px - 2rem);
}

.form-padding {
  padding: 3rem 4rem;
}

@media (max-width: $laptopWidth) {
  .form-padding {
    padding: 3rem 2rem;
  }
}
</style>
