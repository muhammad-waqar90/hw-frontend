<template>
  <div class="pb-3 sub-category-list scrollbar-blue overflow-y-auto pe-1">
    <template v-if="parsedList.length">
      <div
        v-for="item in parsedList"
        :key="item.id"
        class="px-4 mt-3 subcategory rounded-card py-4"
      >
        <div class="row">
          <div class="col title color-gray text-capitalize">
            {{ item.name }}
          </div>
          <div
            class="col-auto text-end cursor-pointer toggle px-0"
            @click="onSubcategoryClick(item.id)"
          >
            <ChevronUpCircleOutline
              v-if="item.opened"
              class="svg-arrow-icons-blue"
            />
            <ChevronDownCircle
              v-if="!item.opened"
              class="svg-arrow-icons-blue"
            />
          </div>
        </div>
        <div v-if="item.opened">
          <SubcategoryFaqList :list="item.faqs" />
        </div>
      </div>
      <Observer
        v-if="showObserver"
        :on-observed="loadMore"
        :custom-css="observerCustomCss"
      />
    </template>
    <template v-if="loading">
      <LoadingCategories />
    </template>
  </div>
</template>

<script>
import SubcategoryFaqList from "@/components/Common/Faqs/Dashboard/SubcategoryFaqList";
import LoadingCategories from "@/components/Common/Faqs/Dashboard/LoadingCategories";
import Observer from "@/components/Misc/Observer";
import ChevronUpCircleOutline from "vue-material-design-icons/ChevronUpCircleOutline";
import ChevronDownCircle from "vue-material-design-icons/ChevronDownCircle";

export default {
  components: {
    LoadingCategories,
    SubcategoryFaqList,
    Observer,
    ChevronUpCircleOutline,
    ChevronDownCircle,
  },
  props: {
    list: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      parsedList: [],
      showObserver: true,
      observerCustomCss: "height: 0px; width: 50px; position: relative;",
    };
  },
  watch: {
    list() {
      this.parsedList = this.list.map((item) => {
        item.opened = item.opened ? item.opened : false;
        return item;
      });
      setTimeout(() => {
        this.showObserver = true;
      }, 100);
    },
  },
  methods: {
    onSubcategoryClick(itemId) {
      this.parsedList = this.parsedList.map((item) => {
        if (item.id == itemId) item.opened = !item.opened;
        return item;
      });
    },
    loadMore() {
      this.showObserver = false;
      this.$emit("load-more");
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.subcategory {
  background: $lightgray;
}
.title {
  font-size: 18px;
  font-weight: 600;
}
.toggle {
  svg {
    fill: $orange;
    border-radius: 50%;
  }
}
.sub-category-list {
  overflow-y: auto;
  max-height: calc(100vh - 140px);
}
</style>
