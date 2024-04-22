<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Advert - Create</h3>
      </div>
      <div class="py-3">
        <AdvertCreateEdit
          mode="create"
          :loading="api.loading"
          @on-save="createAdvert"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import AdvertCreateEdit from "@/components/AF/Advert/AdvertCreateEdit.vue";
import { createAdvert } from "@/services/AF/afAdvertService";

import apiMixin, { getApiState } from "@/mixins/apiMixin";

export default {
  name: "AdvertCreate",
  components: { AdvertCreateEdit },
  mixins: [apiMixin],

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
      api: getApiState(),
    };
  },

  methods: {
    async createAdvert(data) {
      await this.$postApiData(this.api, () => createAdvert(data));
      if (this.api.error) return;

      this.hasChanged = false;
      this.$router.push({ name: "af-adverts" });
    },
  },
};
</script>
