<template>
  <div class="position-relative">
    <input
      v-model.trim="searchText"
      type="text"
      class="form-control w-100 ps-5 pe-4 rounded-pill border-0"
      :placeholder="placeholder"
      :title="placeholder"
    />
    <span
      v-if="searchText"
      class="position-absolute clear-input cursor-pointer text-secondary fw-bold py-2 pe-2"
      @click="clearSearch"
      >x</span
    >
    <span
      class="position-absolute search-icon cursor-pointer text-secondary fw-bold py-2 ps-1"
    >
      <search :size="26" />
    </span>
  </div>
</template>

<script>
import Search from "vue-material-design-icons/Magnify";
import { debounce } from "@/utils/generalUtils";
import dompurifyMixin from "@/mixins/dompurifyMixin";
export default {
  components: {
    Search,
  },
  mixins: [dompurifyMixin],
  props: {
    searchTextProp: { type: String },
    placeholder: { type: String },
  },
  data() {
    return {
      searchText: null,
    };
  },
  watch: {
    searchTextProp(newVal) {
      if (newVal !== this.searchText) this.init();
    },
    searchText: debounce(function () {
      this.onSearch();
    }, 500),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      if (this.searchText != this.searchTextProp)
        this.searchText = this.searchTextProp;
    },
    clearSearch() {
      this.searchText = null;
      //this.onSearch();
    },
    onSearch() {
      this.searchText = this.sanitizeSearchInput(this.searchText);
      this.$emit("on-search", this.searchText);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.clear-input {
  top: -3px;
  right: 0;
}
.search-icon {
  top: -2px;
  left: 6px;
  svg {
    fill: $blue;
  }
}
</style>
