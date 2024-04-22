<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Advert - Edit</h3>
      </div>
      <div class="py-3">
        <AdvertCreateEdit
          v-if="advertApi.data"
          :advert="advertApi.data"
          mode="edit"
          :loading="advertApi.loading"
          @on-save="updateAdvert"
          @on-change="checkHasChanged"
          @on-delete="startDeletingAdvert"
        />
      </div>
      <modal
        v-if="modalMode == 'delete'"
        :title="'Confirm Action'"
        :min-height="'300px'"
        @close-modal="closeModal"
      >
        <div class="w-100 pt-2 h5">
          Are you sure you want to delete
          <b>"{{ advertApi.data?.name }}"</b>?
        </div>
        <template slot="footer">
          <ConfirmationButtons
            :disabled="advertApi.loading"
            @on-cancel="closeModal"
            @on-confirm="deleteAdvert"
          />
        </template>
      </modal>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import AdvertCreateEdit from "@/components/AF/Advert/AdvertCreateEdit.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import {
  getAdvert,
  updateAdvert,
  deleteAdvert,
} from "@/services/AF/afAdvertService";

import apiMixin, { getApiState } from "@/mixins/apiMixin";

export default {
  name: "AdvertEdit",
  components: {
    AdvertCreateEdit,
    Modal,
    ConfirmationButtons,
  },
  mixins: [toastMixin, apiMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },

  data() {
    return {
      hasChanged: false,
      advert: {},
      advertApi: getApiState(),
      modalMode: "",
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      await this.$fetchApiData(this.advertApi, () =>
        getAdvert(this.$route.params.id)
      );
    },
    async updateAdvert(data) {
      await this.$postApiData(this.advertApi, () =>
        updateAdvert(this.$route.params.id, data)
      );
      if (this.advertApi.error) return;

      this.hasChanged = false;
      this.$router.push({ name: "af-adverts" });
    },
    startDeletingAdvert() {
      this.openModal("delete");
    },
    openModal(mode) {
      this.modalMode = mode;
    },
    closeModal() {
      this.modalMode = "";
    },
    async deleteAdvert() {
      await this.$postApiData(this.advertApi, () =>
        deleteAdvert(this.$route.params.id)
      );
      if (this.advertApi.error) return;

      this.hasChanged = false;
      this.$router.push({ name: "af-adverts" });
    },

    checkHasChanged(key, value) {
      this.hasChanged = this.advertApi.data[key] != value;
    },
  },
};
</script>
