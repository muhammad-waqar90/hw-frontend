<template>
  <div v-if="maxPages < 6" class="d-flex justify-content-center mt-3">
    <button
      v-for="index in maxPages"
      :key="index"
      class="btn font-weight-700 mx-1 pagination-button"
      :class="[currentPage == index ? 'blue-btn' : 'gray-btn-text']"
      @click="setPage(index)"
    >
      {{ index }}
    </button>
  </div>
  <div v-else class="d-flex justify-content-center mt-3">
    <button
      class="btn font-weight-700 mx-1 pagination-button"
      :class="[currentPage == 1 ? 'blue-btn' : 'gray-btn-text']"
      @click="setPage(1)"
    >
      {{ 1 }}
    </button>
    <button
      v-if="currentPage > 3"
      class="btn gray-btn-text font-weight-700 mx-1 pagination-button"
      @click="setPage(previousDotIndex)"
    >
      <Dots :size="12" />
    </button>
    <button
      v-for="i in 3"
      :key="i"
      class="btn font-weight-700 mx-1 pagination-button"
      :class="[currentPage == i + startIndex ? 'blue-btn' : 'gray-btn-text']"
      @click="setPage(i + startIndex)"
    >
      {{ i + startIndex }}
    </button>
    <button
      v-if="currentPage < maxPages - 2"
      class="btn gray-btn-text font-weight-700 mx-1 pagination-button"
      @click="setPage(nextDotIndex)"
    >
      <Dots :size="12" />
    </button>
    <button
      class="btn font-weight-700 mx-1 pagination-button"
      :class="[currentPage == maxPages ? 'blue-btn' : 'gray-btn-text']"
      @click="setPage(maxPages)"
    >
      {{ maxPages }}
    </button>
  </div>
</template>

<script>
import Dots from "vue-material-design-icons/DotsHorizontal";
export default {
  name: "PaginationButtonsCallback",
  components: { Dots },
  props: {
    currentPage: {
      type: Number,
      default: 1,
    },
    maxPages: {
      type: Number,
    },
  },
  computed: {
    startIndex() {
      if (this.currentPage < 4) return 1;
      if (this.currentPage > this.maxPages - 2) return this.maxPages - 4;
      return this.currentPage - 2;
    },
    previousDotIndex() {
      return Math.round(this.currentPage / 2);
    },
    nextDotIndex() {
      return Math.round((this.currentPage + this.maxPages) / 2);
    },
  },
  methods: {
    next() {
      if (this.currentPage == this.maxPages) return;
      this.$emit("set-current-page", this.currentPage + 1);
    },
    previous() {
      if (this.currentPage == 1) return;
      this.$emit("set-current-page", this.currentPage - 1);
    },
    setPage(index) {
      this.$emit("set-current-page", index);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.pagination-button {
  padding: 4px 8px;
  font-size: 12px;
}
</style>
