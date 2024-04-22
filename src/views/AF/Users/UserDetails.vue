<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">
          User - {{ user.first_name }} {{ user.last_name }} ({{ user.name }})
        </h3>
      </div>
      <div class="d-flex justify-content-between py-4">
        <div class="d-flex mt-3">
          <div>
            <span
              :class="[
                isTab('user_info')
                  ? 'active-tab rounded fw-bold'
                  : 'inactive-tab text-dark border',
              ]"
              class="p-3 cursor-pointer"
              @click.prevent="!isTab('user_info') && setTab('user_info')"
              >USER INFO</span
            >
          </div>
          <div>
            <span
              :class="[
                isTab('courses_info')
                  ? 'active-tab rounded fw-bold'
                  : 'inactive-tab text-dark border',
                loading && 'disabled-tab',
              ]"
              class="p-3 cursor-pointer"
              @click.prevent="
                !(loading || isTab('courses_info')) && setTab('courses_info')
              "
              >COURSES INFO</span
            >
          </div>
          <div v-if="$isAbleToViewUserPurchaseHistory">
            <span
              :class="[
                isTab('purchase_history')
                  ? 'active-tab rounded fw-bold'
                  : 'inactive-tab text-dark border',
                loading && 'disabled-tab',
              ]"
              class="p-3 cursor-pointer"
              @click.prevent="
                !(loading || isTab('purchase_history')) &&
                  setTab('purchase_history')
              "
              >PURCHASE HISTORY</span
            >
          </div>
        </div>
        <div class="d-flex mt-1">
          <div class="d-flex action-buttons me-4">
            <button
              v-if="!loading"
              class="btn blue-btn mx-2"
              :disabled="!$isGDPRManager"
              @click="onExportGDPR()"
            >
              EXPORT GDPR
            </button>
            <button
              v-if="!loading && !isEnabled"
              class="btn blue-btn mx-2"
              @click="onEnable()"
            >
              ENABLE
            </button>
            <button
              v-if="!loading && isEnabled"
              class="btn btn-secondary mx-2"
              @click="onDisable()"
            >
              DISABLE
            </button>
            <button
              v-if="!loading"
              class="btn btn-danger mx-2"
              :disabled="!$isAbleToDeleteUsers"
              @click="onDelete()"
            >
              {{ deletionType }}
            </button>
          </div>
        </div>
      </div>

      <div class="py-3">
        <UserInfo v-if="isTab('user_info')" :user="user" />
        <CourseInfo v-if="isTab('courses_info')" :user-id="userId" />
        <section
          v-if="isTab('purchase_history')"
          class="container-fluid purchase-history-outer py-3"
        >
          <UserPurchases :user="user" :with-title="false" />
        </section>
      </div>
    </article>
    <modal
      v-if="modalMode == 'exportGDPR'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to <b>Export GDPR</b> Data for User
        <b>"{{ user.first_name }} {{ user.last_name }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons @on-cancel="closeModal" @on-confirm="exportGDPR" />
      </template>
    </modal>
    <modal
      v-if="modalMode == 'enable'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to <b>Enable</b> User
        <b>"{{ user.first_name }} {{ user.last_name }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons @on-cancel="closeModal" @on-confirm="enableUser" />
      </template>
    </modal>
    <modal
      v-if="modalMode == 'disable'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to <b>Disable</b> User
        <b>"{{ user.first_name }} {{ user.last_name }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons
          @on-cancel="closeModal"
          @on-confirm="disableUser"
        />
      </template>
    </modal>
    <modal
      v-if="modalMode == 'delete'"
      :title="'Confirm Action'"
      :min-height="'300px'"
      @close-modal="closeModal"
    >
      <div class="w-100 pt-2 h5">
        Are you sure you want to <b>{{ deletionType }}</b> User
        <b>"{{ user.first_name }} {{ user.last_name }}"</b>?
      </div>
      <template slot="footer">
        <ConfirmationButtons @on-cancel="closeModal" @on-confirm="deleteUser" />
      </template>
    </modal>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import UserInfo from "@/components/AF/Users/UserInfo.vue";
import CourseInfo from "@/components/AF/Users/CourseInfo.vue";
import UserPurchases from "@/components/AF/Users/Purchases/UserPurchases.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import {
  getUserInfo,
  exportGDPR,
  enableUser,
  disableUser,
  deleteUser,
} from "@/services/AF/afUserService";

export default {
  name: "User",

  components: {
    UserInfo,
    CourseInfo,
    UserPurchases,
    Modal,
    ConfirmationButtons,
  },

  mixins: [toastMixin, permissionsMixin],

  data() {
    return {
      tab: "user_info",
      userId: null,
      user: {},
      modalMode: "",
      loading: true,
    };
  },

  computed: {
    isEnabled() {
      return this.user && this.user.is_enabled;
    },
    deletionType() {
      return this.user && (this.user.deleted_at || this.user.restore_user)
        ? "FULL DELETE"
        : "DELETE";
    },
  },

  watch: {
    tab: function () {
      this.init();
    },
  },

  mounted() {
    this.userId = Number.parseInt(this.$route.params.id, 10);
    this.init();
  },

  methods: {
    async init() {
      this.getUserInfo();
    },

    async getUserInfo() {
      const response = await getUserInfo(this.userId);

      if (response.error) this.$displayServerResponse(response);
      this.user = { ...(response.user_profile || {}), ...response };
      this.loading = false;
    },

    isTab(item) {
      return this.tab === item;
    },

    setTab(item) {
      if (Object.keys(this.$route.query).length !== 0) this.$router.replace({});
      this.tab = item;
    },

    onExportGDPR() {
      this.openModal("exportGDPR");
    },

    onEnable() {
      this.openModal("enable");
    },

    onDisable() {
      this.openModal("disable");
    },

    onDelete() {
      this.openModal("delete");
    },

    openModal(mode) {
      this.modalMode = mode;
    },

    closeModal() {
      this.modalMode = "";
    },

    async exportGDPR() {
      if (this.handleTrashedUser("Can not export a deleted user")) return;

      const response = await exportGDPR(this.userId);

      this.$displayServerResponse(response);
      if (response.errors) return;

      this.closeModal();
    },

    async enableUser() {
      if (this.handleTrashedUser("Can not enable a deleted user")) return;

      const response = await enableUser(this.userId);

      this.$displayServerResponse(response);
      if (response.errors) return;

      this.user.is_enabled = 1;
      this.closeModal();
    },

    async disableUser() {
      if (this.handleTrashedUser("Can not disable a deleted user")) return;

      const response = await disableUser(this.userId);

      this.$displayServerResponse(response);
      if (response.errors) return;

      this.user.is_enabled = 0;
      this.closeModal();
    },

    handleTrashedUser(msg) {
      if (this.user.deleted_at || this.user.restore_user) {
        this.closeModal();
        this.$displayErrorToast(msg);
      }
      return this.user.deleted_at || this.user.restore_user ? true : false;
    },

    async deleteUser() {
      const response = await deleteUser(this.userId);

      this.$displayServerResponse(response);
      if (response.errors) return;

      this.closeModal();
      this.$router.push({ name: "af-users-overview" });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.purchase-history-outer {
  background-color: $lightgray;
  padding-bottom: 5vh;
}

.active-tab {
  background-color: $blue;
  border-color: $blue;
  color: $static-white;
}

.inactive-tab {
  background-color: $lightgray;
}

.disabled-tab {
  color: #d4d4d4 !important;
  cursor: not-allowed !important;
  pointer-events: none;
}
</style>
