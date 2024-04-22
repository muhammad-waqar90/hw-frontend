<template>
  <div>
    <div class="row px-2 border-bottom border-2 align-items-center">
      <div class="col-10 col-md-10 px-1">
        <div class="px-3 bg-white py-1 py-md-2 text-break">
          <div class="row align-items-center">
            <div class="col-6 col-md-6 order-1">
              <h6>
                {{ item.name }}
              </h6>
            </div>
            <div class="col-4 col-md-4 order-2 order-md-2 small-text">
              <h6>
                {{ $t(`iu.certificates.types.${item.type}`) }}
              </h6>
            </div>
            <div class="col-2 col-md-2 order-3 order-md-3 small-text">
              <h6 :class="{ 'date-column ': $isPhone || $isTablet }">
                {{ formattedDate }}
              </h6>
            </div>
          </div>
        </div>
      </div>
      <div class="col-2 col-md-2 px-1 p-1 icon-align">
        <span
          v-show="loading"
          class="spinner-border spinner-color spinner-border-sm"
          role="status"
          aria-hidden="true"
        />
        <span v-show="!loading" class="cursor-pointer" @click="onDownload">
          <svg-download class="icon-small" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { UTCtoLocalDateOnlyFormatted } from "@/utils/dateTimeUtils";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { downloadCertificate } from "@/services/IU/iuCertificatesService";
import SvgDownload from "@/assets/svg/download.svg";

export default {
  components: {
    SvgDownload,
  },
  mixins: [devicesMixin],
  props: {
    item: Object,
  },
  data() {
    return {
      loading: false,
    };
  },
  computed: {
    formattedDate() {
      return UTCtoLocalDateOnlyFormatted(this.item.created_at);
    },
  },
  methods: {
    async onDownload() {
      this.loading = true;
      await this.handleDownload();
      this.loading = false;
    },
    async handleDownload() {
      const response = await downloadCertificate(this.item.id);
      if (response && response.error)
        return this.$displayServerResponse(response);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.icon-align {
  text-align: right;
  position: relative;
  bottom: 4px;
}

.link-icon {
  color: $orange;
}

.spinner-color {
  border-color: $orange;
  border-right-color: transparent;
}
.date-column {
  width: max-content;
}
@media (max-width: $tabletWidth) {
  .small-text h6 {
    font-size: 0.8rem !important;
  }
}
</style>
