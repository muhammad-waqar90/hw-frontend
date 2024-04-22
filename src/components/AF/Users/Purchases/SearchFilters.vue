<template>
  <div id="searchFilters">
    <div class="my-2 d-flex justify-content-between">
      <div class="position-relative d-flex align-items-baseline">
        <div class="form-group d-flex">
          <SearchWithButton
            :search-text-prop="searchText"
            search-placeholder="Search by name"
            @on-search="onSearchByName"
          />
        </div>
        <div class="text-end truncate">
          <button
            class="btn btn-secondary ms-2"
            @click="toggleAdvanceSearchFiltersExpanded"
          >
            <ChevronDownIcon v-if="!expanded" :size="20" />
            <ChevronUpIcon v-else :size="20" /> Advanced Search Filters
          </button>
        </div>
        <div v-if="$route.query.searchId">
          <button class="btn btn-danger rounded-card ms-3 cursor-default">
            Filtering by Id: <b> {{ $route.query.searchId }}</b>
            <span class="cursor-pointer px-1 fw-bold" @click="onResetFilters"
              >x</span
            >
          </button>
        </div>
      </div>
      <div class="d-flex justify-content-end">
        <div class="position-relative ms-4 d-flex align-items-baseline">
          <label class="me-2 word-break-normal">Type:</label>
          <select
            v-model="type"
            class="form-select"
            @change="handleSearchByType"
          >
            <option v-for="(t, i) in types" :key="i" :value="t.id">
              {{ t.name }}
            </option>
          </select>
        </div>
        <div class="position-relative ms-4 d-flex align-items-baseline">
          <button
            class="btn blue-btn truncate"
            title="Find by Transaction Item ID"
            @click="isOpen = true"
          >
            Find by Trans. Item ID
          </button>
        </div>
        <div class="text-end truncate">
          <button class="btn btn-secondary ms-2" @click="onResetFilters">
            Reset Params
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="expanded"
      class="bg-white my-2 d-flex justify-content-between py-3"
    >
      <div class="d-flex justify-content-end">
        <div class="position-relative ms-4 d-flex align-items-baseline">
          <label class="me-2">Price (£):</label>
          <input
            v-model="priceFrom"
            type="number"
            class="form-control border-0 w-25 bg-light"
            placeholder="From"
            @keydown="sanitizeNumberKey"
          />
          <span class="ms-2 me-2"> - </span>
          <input
            v-model="priceTo"
            type="number"
            class="form-control border-0 w-25 bg-light"
            placeholder="To"
            @keydown="sanitizeNumberKey"
          />
        </div>
        <div class="position-relative ms-4 d-flex align-items-baseline">
          <label class="me-2 word-break-normal">Date:</label>
          <input
            v-model="dateFrom"
            type="date"
            max="9999-12-31"
            class="form-control border-0 w-50 bg-light"
            placeholder="From"
          />
          <span class="ms-2 me-2"> - </span>
          <input
            v-model="dateTo"
            type="date"
            max="9999-12-31"
            class="form-control border-0 w-50 bg-light"
            placeholder="To"
          />
        </div>
        <div class="position-relative ms-4 d-flex align-items-baseline">
          <button class="btn blue-btn" @click="handleAdvanceSearchFilters">
            Apply
          </button>
        </div>
      </div>
    </div>
    <modal
      v-if="isOpen"
      title="Search Transaction Item"
      :min-height="'300px'"
      @close-modal="isOpen = false"
    >
      <div class="w-100 pt-2">
        <div class="h5 d-flex flex-column form-group">
          <label title="Transaction Item ID"> Trans. Item Id: </label>
          <input
            v-model="searchId"
            type="number"
            placeholder="Transaction Item Id..."
            class="form-control"
            @keydown.enter="handleSearchById"
            @keydown="sanitizeNumberKey"
          />
        </div>
        <div class="form-group d-flex justify-content-end">
          <button
            :disabled="!searchId"
            class="btn blue-btn"
            :class="{ disabled: !searchId }"
            @click="handleSearchById"
          >
            Search
          </button>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import SearchWithButton from "@/components/Misc/Admin/SearchWithButton.vue";
import Modal from "@/components/Misc/Admin/AdminModal.vue";
import ChevronUpIcon from "vue-material-design-icons/ChevronUp";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";
import * as availablePurchaseItemTypes from "@/dataObject/purchases/purchaseItemTypeData";
import { sanitizeNumberKey } from "@/utils/generalUtils";

export default {
  name: "SearchFilters",
  components: {
    SearchWithButton,
    Modal,
    ChevronUpIcon,
    ChevronDownIcon,
  },

  data() {
    return {
      expanded: false,
      types: [],
      isOpen: false,
      searchId: null,
      searchText: null,
      type: null,
      priceFrom: null,
      priceTo: null,
      dateFrom: null,
      dateTo: null,
    };
  },

  created() {
    this.mapData();
  },

  methods: {
    mapData() {
      this.types = Object.entries(availablePurchaseItemTypes).map(
        ([key, value]) => {
          return { name: key, id: value };
        }
      );
    },
    toggleAdvanceSearchFiltersExpanded() {
      this.expanded = !this.expanded;
    },
    onSearchByName(searchText) {
      this.searchId = null;
      this.searchText = searchText;
      this.handleRouteChange();
    },
    handleSearchByType() {
      this.searchId = null;
      this.handleRouteChange();
    },
    handleSearchById() {
      this.isOpen = false;
      this.reset();
      this.handleRouteChange();
    },
    handleAdvanceSearchFilters() {
      this.searchId = null;
      this.handleRouteChange();
    },
    onResetFilters() {
      this.searchId = null;
      this.reset();
      this.handleRouteChange();
    },
    async handleRouteChange() {
      const query = {};
      if (this.searchId) query.searchId = this.searchId;
      if (this.searchText) query.searchText = this.searchText;
      if (this.type) query.type = this.type;
      if (this.priceFrom) query.priceFrom = this.priceFrom;
      if (this.priceTo) query.priceTo = this.priceTo;
      if (this.dateFrom) query.dateFrom = this.dateFrom;
      if (this.dateTo) query.dateTo = this.dateTo;

      if (
        this.$route.query.searchId != query.searchId ||
        this.$route.query.searchText != query.searchText ||
        this.$route.query.type != query.type ||
        this.$route.query.priceFrom != query.priceFrom ||
        this.$route.query.priceTo != query.priceTo ||
        this.$route.query.dateFrom != query.dateFrom ||
        this.$route.query.dateTo != query.dateTo
      )
        this.$router.replace({
          query,
        });
    },
    reset() {
      this.searchText = null;
      this.type = null;
      this.priceFrom = null;
      this.priceTo = null;
      this.dateFrom = null;
      this.dateTo = null;
      this.expanded = false;
    },
    sanitizeNumberKey,
  },
};
</script>
