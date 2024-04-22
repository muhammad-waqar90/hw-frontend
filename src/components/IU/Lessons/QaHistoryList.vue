<template>
  <article class="rounded-card bg-light-gray py-3">
    <div class="module-list-height overflow-y-auto scrollbar-blue px-2">
      <div v-if="qaList.length">
        <section
          v-for="qa in qaList"
          :key="qa.id"
          class="col-12 bg-white p-3 my-3 rounded-card"
        >
          <div class="row align-items-center">
            <div class="col">
              <h6 class="font-weight-600 color-gray mb-0">
                <span
                  class="me-2"
                  v-html-directive="capitalizeFirstLetter(qa.question)"
                />
              </h6>
            </div>
            <div class="col-auto d-flex justify-content-end">
              <div v-if="qa.expanded" @click="onQaExpand(qa.id)">
                <ChevronUpCircleOutline
                  class="svg-arrow-icons-blue cursor-pointer"
                />
              </div>

              <div v-else @click="onQaExpand(qa.id)">
                <ChevronDownCircle
                  class="svg-arrow-icons-blue cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div>
            <div v-if="qa.expanded">
              <hr class="mb-4" />
              <p class="text-black" v-html-directive="qa.answer" />
            </div>
          </div>
        </section>
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="loadMore"
        :custom-css="observerCustomCss"
      />
    </div>
    <template v-if="loading">
      <LoadingCategories :number-of-items="1" />
    </template>
  </article>
</template>

<script>
import LoadingCategories from "@/components/Common/Faqs/Dashboard/LoadingCategories";
import Observer from "@/components/Misc/Observer";
import ChevronDownCircle from "vue-material-design-icons/ChevronDownCircle";
import ChevronUpCircleOutline from "vue-material-design-icons/ChevronUpCircleOutline";
import { capitalizeFirstLetter } from "@/utils/stringUtils";
export default {
  name: "QaHistoryList",
  components: {
    LoadingCategories,
    Observer,
    ChevronDownCircle,
    ChevronUpCircleOutline,
  },
  props: {
    loading: {
      type: Boolean,
    },
    altQaList: {
      type: Array,
    },
  },
  data() {
    return {
      showObserver: true,
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
      qaList: [],
    };
  },

  watch: {
    altQaList() {
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
  },
  mounted() {
    this.qaList = this.altQaList;
  },
  methods: {
    onQaExpand(id) {
      this.qaList = this.altQaList.map((qaList) => {
        if (qaList.id === id) {
          qaList.expanded = !qaList.expanded;
        }
        return qaList;
      });
    },
    loadMore() {
      this.$emit("load-more-qa");
      this.showObserver = false;
    },
    capitalizeFirstLetter,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.bg-light-gray {
  background-color: $lightgray;
}
.small-font {
  font-size: 0.7rem;
}
.module-list-height {
  max-height: calc(82vh - 420px);
}
</style>
