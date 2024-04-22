<template>
  <div class="row">
    <div class="col position-relative">
      <input
        v-model.trim="searchText"
        type="text"
        class="form-control pe-4 rounded-card border-0"
        :placeholder="searchPlaceholder"
        :title="searchPlaceholder"
        @keydown.enter="onSearch"
      />
      <span
        v-if="searchText"
        class="position-absolute clear-input cursor-pointer text-secondary fw-bold py-2 pe-1"
        @click="clearSearch"
        >x</span
      >
    </div>
    <div class="col-auto pe-3">
      <ButtonWithLoading
        class="btn blue-btn rounded-card"
        :loading="loading"
        @action="onSearch"
      >
        <slot>
          <search :size="20" />
          {{ $isMobile ? "" : "Search" }}
        </slot>
      </ButtonWithLoading>
    </div>
  </div>
</template>

<script>
import Search from "vue-material-design-icons/Magnify";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";
export default {
  components: {
    Search,
    ButtonWithLoading,
  },
  mixins: [devicesMixin, dompurifyMixin],
  props: {
    searchTextProp: { type: String },
    searchPlaceholder: {
      type: String,
      default: "Search keyword...",
    },
    toggleClearData: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      searchText: "",
    };
  },
  watch: {
    searchTextProp(newVal) {
      if (newVal !== this.searchText) this.init();
    },
    toggleClearData() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.searchText = this.searchTextProp;
    },
    clearSearch() {
      this.searchText = "";
      this.onSearch();
    },
    onSearch() {
      this.searchText = this.sanitizeSearchInput(this.searchText);
      this.$emit("on-search", this.searchText);
    },
  },
};
</script>

<style scoped>
.clear-input {
  top: -3px;
  right: 20px;
}
</style>
