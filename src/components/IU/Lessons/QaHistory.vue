<template>
  <div>
    <div v-if="qaApi.data?.length" class="mt-1 mb-5">
      <div class="row qa-list-header rounded-card">
        <h5 class="col font-weight-600 mb-1 font-size-19">
          {{ $t("iu.lesson.previousQaList") }}
        </h5>
        <div class="col-auto d-flex justify-content-end align-self-center">
          <div @click="expandQaHistory = !expandQaHistory">
            <ChevronDownCircle
              v-if="!expandQaHistory"
              class="icon-small cursor-pointer"
            />
          </div>
          <div @click="expandQaHistory = !expandQaHistory">
            <ChevronUpCircle
              v-if="expandQaHistory"
              class="icon-small cursor-pointer"
            />
          </div>
        </div>
      </div>
      <QaHistoryList
        v-if="expandQaHistory"
        :alt-qa-list="qaApi.data"
        :loading="qaApi.loading"
        class="qa-list-body row rounded-card px-3"
        @load-more-qa="loadMoreQa"
      />
    </div>
    <LoadingCategories
      v-if="qaApi.loading && !qaApi.data?.length"
      class="row"
      :number-of-items="1"
    />
  </div>
</template>
<script>
import { getLessonQAList } from "@/services/iuService";
import { getNextPage } from "@/services/generalService";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import QaHistoryList from "@/components/IU/Lessons/QaHistoryList";
import ChevronUpCircle from "vue-material-design-icons/ChevronUpCircle";
import ChevronDownCircle from "vue-material-design-icons/ChevronDownCircle";
import LoadingCategories from "@/components/Common/Faqs/Dashboard/LoadingCategories";
export default {
  components: {
    QaHistoryList,
    ChevronUpCircle,
    ChevronDownCircle,
    LoadingCategories,
  },
  mixins: [apiMixin],
  props: {
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      expandQaHistory: false,
      qaApi: getApiState(),
      nextPageUrl: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(this.qaApi, () =>
        getLessonQAList(
          this.$route.params.courseId,
          this.$route.params.lessonId
        )
      );
      this.nextPageUrl = this.qaApi.meta.next_page_url;
    },
    async loadMoreQa() {
      if (!this.nextPageUrl) return;
      this.qaApi.loading = true;
      const response = await getNextPage(this.nextPageUrl);
      this.qaApi.loading = false;
      this.qaApi.data.push(...response.data);
      this.nextPageUrl = response.next_page_url;
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.qa-list-header {
  background-color: $blue;
  color: $static-white;
  position: relative;
  top: 50px;
  z-index: 2;
  padding: 1rem !important;
  border-radius: 50px;
}
.blue-border {
  border: 2px solid $blue;
}
.qa-list-body {
  padding-top: 60px !important;
  margin-bottom: -8% !important;
}
.icon-small {
  svg {
    fill: $static-white;
    width: 26.5px;
    height: 26.5px;
  }
}
.font-size-19 {
  font-size: 19px !important;
}
</style>
