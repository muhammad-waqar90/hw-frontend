<template>
  <div class="container-fluid">
    <section v-show="mode === 'userPurchases'">
      <article class="w-100">
        <HeaderPurchases v-if="withTitle" :user="user" />
        <SearchFilters />
        <ProceedToRefund
          :selected-items-count="allSelectedItemsCount"
          @on-proceed-to-refund="onProceedToRefund"
        />
        <div class="py-3">
          <PurchaseHistoryList
            :list="purchaseHistoryItems"
            :selected-item-list="selectedItemList"
            :selected-parent-item-list="selectedParentItemList"
            :with-refund="$isRefundsManager"
            @on-change-item-selection="onChangeItemSelection"
            @on-change-parent-item-selection="onChangeParentItemSelection"
          />
          <div v-if="links.length">
            <PaginationButtons :links="links" />
          </div>
        </div>
      </article>
    </section>

    <section v-show="mode === 'reviewSelectedItemsForRefund'">
      <ReviewPurchases
        :selected-item-list="allSelectedItemsList"
        :user="user"
        @on-back-to-purchases="mode = 'userPurchases'"
        @on-change-item-selection="onChangeItemSelection"
        @on-refunded="resetMode"
      />
    </section>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import HeaderPurchases from "@/components/AF/Users/Purchases/HeaderPurchases.vue";
import SearchFilters from "@/components/AF/Users/Purchases/SearchFilters.vue";
import ProceedToRefund from "@/components/AF/Users/Purchases/ProceedToRefund.vue";
import PurchaseHistoryList from "@/components/AF/Purchases/PurchaseHistoryList.vue";
import ReviewPurchases from "./ReviewPurchases.vue";
import PaginationButtons from "@/components/Misc/PaginationButtons.vue";
import { linksToPath } from "@/utils/urlUtils";
import {
  getUserPurchaseHistory,
  getUserUnselectedEbooks,
} from "@/services/AF/afUserService";
import * as availablePurchaseItemStatuses from "@/dataObject/purchases/purchaseItemStatusData";
import * as availablePurchaseItemTypes from "@/dataObject/purchases/purchaseItemTypeData";

export default {
  name: "UserPurchases",
  components: {
    HeaderPurchases,
    SearchFilters,
    ProceedToRefund,
    PurchaseHistoryList,
    ReviewPurchases,
    PaginationButtons,
  },
  mixins: [toastMixin, permissionsMixin, apiMixin],
  props: {
    user: {
      type: Object,
    },
    withTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      loading: true,
      mode: "userPurchases",
      purchaseHistoryItems: [],
      selectedItemList: [],
      selectedParentItemList: [],
      unSelectedEbookItemList: [],
      page: null,
      links: [],
      userPurchasesApi: getApiState(),
    };
  },
  computed: {
    allSelectedItemsList() {
      return this.selectedParentItemList.concat(
        this.selectedItemList,
        this.unSelectedEbookItemList
      );
    },
    allSelectedItemsCount() {
      return this.selectedItemList.length + this.selectedParentItemList.length;
    },
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.getUserPurchaseHistory();
    },
    async getUserPurchaseHistory() {
      this.purchaseHistoryItems = [];
      this.selectedItemList = [];
      this.selectedParentItemList = [];
      this.links = [];

      await this.$fetchApiData(this.userPurchasesApi, () =>
        getUserPurchaseHistory(
          this.user.id,
          this.$route.query.page,
          this.$route.query.searchId,
          this.$route.query.searchText,
          this.$route.query.type ? this.$route.query.type : null,
          this.$route.query.priceFrom,
          this.$route.query.priceTo,
          this.$route.query.dateFrom,
          this.$route.query.dateTo
        )
      );

      this.loading = false;

      this.purchaseHistoryItems = this.formatData(this.userPurchasesApi.data);
      this.links = linksToPath(this.$route.path, this.userPurchasesApi.links);
    },
    async onChangeItemSelection(checked, item) {
      if (checked) this.selectedItemList = [...this.selectedItemList, item];
      else
        this.selectedItemList = this.selectedItemList.filter(
          (selectedItem) => selectedItem.id !== item.id
        );

      if (!checked) this.handleParentSelection(item);
    },
    async onChangeParentItemSelection(checked, item) {
      if (checked)
        this.selectedParentItemList = [...this.selectedParentItemList, item];
      else
        this.selectedParentItemList = this.selectedParentItemList.filter(
          (selectedParentItem) => selectedParentItem.id !== item.id
        );

      item.purchaseItems.forEach((purchaseItem) => {
        if (checked) {
          purchaseItem.status === availablePurchaseItemStatuses.PAID &&
            !this.selectedItemList.includes(purchaseItem) &&
            this.onChangeItemSelection(checked, purchaseItem);
        } else this.onChangeItemSelection(checked, purchaseItem);
      });
    },
    async handleParentSelection(selectedItem) {
      let parentItem = null;
      this.purchaseHistoryItems.forEach((courseItem) => {
        courseItem.purchaseItems.map((item) => {
          if (item.id === selectedItem.id) parentItem = courseItem;
        });
      });
      if (
        selectedItem.type === availablePurchaseItemTypes.E_NOTES &&
        this.selectedParentItemList.includes(parentItem)
      ) {
        this.selectedParentItemList = this.selectedParentItemList.filter(
          (selectedParentItem) => selectedParentItem.id !== parentItem.id
        ); //unselect parent on unselecting Ebook
      }
    },
    async onProceedToRefund() {
      this.unSelectedEbookItemList = [];
      let items = this.selectedItemList
        .concat(this.selectedParentItemList)
        .map((item) => item.id);

      await this.$fetchApiData(this.userPurchasesApi, () =>
        getUserUnselectedEbooks(this.user.id, items)
      );

      this.unSelectedEbookItemList = this.userPurchasesApi.data;
      this.mode = "reviewSelectedItemsForRefund";
    },
    resetMode() {
      this.mode = "userPurchases";
      this.unSelectedEbookItemList = [];
      this.init();
    },
    formatData(data) {
      let formatedData = [];
      data &&
        data.forEach((item) => {
          let courseItem = null;
          let totalAmount = 0;
          let purchaseItems = [];
          item.purchaseItems.map((item) => {
            if (
              item.type === availablePurchaseItemTypes.COURSE &&
              courseItem == null
            ) {
              courseItem = item;
            } else if (
              item.exam_status != null &&
              purchaseItems.some(
                (selectedItem) =>
                  selectedItem.name === item.name &&
                  selectedItem.type === item.type
              )
            ) {
              item.exam_status = "Fail";
              purchaseItems.push(item);
            } else purchaseItems.push(item);
            totalAmount += item.amount;
          });
          courseItem = { ...courseItem, totalAmount: totalAmount };
          formatedData.push({ ...courseItem, purchaseItems: purchaseItems });
        });

      return formatedData;
    },
  },
};
</script>
