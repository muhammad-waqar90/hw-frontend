<template>
  <div class="container font-montserrat px-3" :class="{ 'px-4 ': $isPhone }">
    <div class="row">
      <div
        class="col"
        :class="{
          'certificates-container scrollbar-blue-white-bg ': $isPhone,
        }"
      >
        <div
          class="bg-white rounded-card py-2"
          :class="{ 'certificates-body ': $isPhone }"
        >
          <h3 class="py-3 px-4 title font-weight-600">
            {{ $t("iu.certificates.certificate") }}
          </h3>
          <div>
            <div class="px-5 py-2 bg-blue text-white">
              <div class="row d-flex">
                <div class="col-10">
                  <div class="row">
                    <div class="col-6">
                      <h6 class="mb-0">
                        {{ $t("iu.certificates.tableName") }}
                      </h6>
                    </div>
                    <div class="col-4">
                      <h6 class="mb-0">
                        {{ $t("iu.certificates.tableType") }}
                      </h6>
                    </div>
                    <div class="col-2">
                      <h6 class="mb-0">
                        {{ $t("iu.certificates.tableDate") }}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="!list.length && !certificateApi.loading"
            class="rounded-card text-light-gray my-4 px-4 py-4"
          >
            <CertificateNotFound :text="$t('iu.certificates.noCertificate')" />
          </div>
          <CertificatesList
            v-if="list.length || certificateApi.loading"
            class="color-gray mx-3"
            :list="list"
            :loading="certificateApi.loading"
          />
          <div v-if="certificatesList" class="text-center my-4 go-back">
            <button
              class="btn blue-btn rounded-pill text-uppercase px-4"
              @click="$router.push({ name: 'iu-certificates-dashboard' })"
            >
              {{ $t("iu.certificates.goBack") }}
            </button>
          </div>
          <div
            v-if="
              (list.length || certificateApi.loading) && !$route.query.redirect
            "
            class="mb-3 align-items-center"
          >
            <PaginationButtons
              :loading="certificateApi.loading"
              :links="links"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import CertificatesList from "@/components/IU/Certificates/CertificatesList";
import CertificateNotFound from "@/components/IU/Certificates/CertificateNotFound";
import PaginationButtons from "@/components/Misc/PaginationButtons";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import {
  getCertificateList,
  getCertificate,
} from "@/services/IU/iuCertificatesService";
import toastMixin from "@/mixins/toastMixin";
import { linksToPath } from "@/utils/urlUtils";
import { generateEntityTreeString } from "@/utils/courseUtils";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  name: "CertificatesDashboard",
  components: {
    CertificatesList,
    PaginationButtons,
    CertificateNotFound,
  },
  mixins: [toastMixin, apiMixin, devicesMixin],
  data() {
    return {
      page: null,
      list: [],
      links: [],
      certificateApi: getApiState(),
    };
  },
  computed: {
    certificatesList() {
      return this.list.length &&
        this.$route.query.redirect &&
        !this.certificateApi.loading
        ? true
        : false;
    },
  },
  watch: {
    $route() {
      this.handelCertificate();
    },
  },
  mounted() {
    this.handelCertificate();
  },
  methods: {
    handelCertificate() {
      if (this.$route.query.redirect && this.$route.params.id)
        this.getCertificateById(this.$route.params.id);
      else this.init();
    },
    async init() {
      this.page = this.$route.query.page ? this.$route.query.page : null;
      this.list = [];
      await this.$fetchApiData(
        this.certificateApi,
        () => getCertificateList(this.page),
        [],
        false
      );
      if (this.certificateApi.error)
        return this.handleError(this.certificateApi.error);
      this.list = this.certificateApi.data.map((item) => {
        item.name = generateEntityTreeString(item.hierarchy);
        return item;
      });

      this.links = linksToPath(this.$route.path, this.certificateApi.links);
    },
    async getCertificateById(id) {
      this.list = [];
      await this.$fetchApiData(
        this.certificateApi,
        () => getCertificate(id),
        [],
        false
      );
      if (this.certificateApi.error)
        return this.handleError(this.certificateApi.error);
      this.certificateApi.data.name = generateEntityTreeString(
        this.certificateApi.data.hierarchy
      );
      this.list.push(this.certificateApi.data);
    },
    handleError(error) {
      if (error.identityUnverified)
        return this.$router.replace({
          name: "iu-verification",
          query: { redirectType: "certificate" },
        });
      else if (error.profileIncomplete)
        return this.$router.replace({
          name: "iu-profile-info",
          query: { redirectType: "certificate" },
        });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.gray-container {
  background-color: $lightgray;
}
.title {
  color: $darkgray;
}
.loading-pagination-buttons {
  height: 52px;
  width: 25%;
}
.bg-blue {
  background-color: $blue;
}
.go-back {
  height: 330px;
}
.certificates-container {
  padding: 0px;
  overflow-x: scroll;
}
.certificates-body {
  width: max-content;
  min-width: 530px;
  margin-bottom: 5px;
}
</style>
