<template>
  <div>
    <TopBooks
      class="mb-4"
      :books="topBooksApi.data"
      :loading="topBooksApi.loading"
      @add-to-cart="onAddToCart"
    />
    <AvailableBooks
      class="mb-1"
      :books="availableBooksApi.data"
      :loading="availableBooksApi.loading"
      @add-to-cart="onAddToCart"
      @on-scroll-end="loadMoreAvailable"
    />
  </div>
</template>

<script>
import TopBooks from "@/components/IU/Products/TopBooks.vue";
import AvailableBooks from "@/components/IU/Products/AvailableBooks.vue";
import { mapGetters } from "vuex";
import { PHYSICAL_PRODUCT } from "@/dataObject/cart/cartItemTypeData";
import {
  getAvailableProductsService,
  getTopProductsService,
} from "@/services/iuService";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

export default {
  name: "BookShop",
  components: {
    TopBooks,
    AvailableBooks,
  },
  mixins: [apiMixin],
  data() {
    return {
      topBooksApi: getApiState(),
      availableBooksApi: getApiState(),
      addToCartProduct: {},
      showAddToCartModal: false,
      updatedList: [],
      updatedModules: [],
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    ...mapGetters({ list: "cart/getList" }),
  },
  methods: {
    async init() {
      await this.$fetchApiData(
        this.topBooksApi,
        () => getTopProductsService(),
        []
      );
      await this.$fetchApiData(
        this.availableBooksApi,
        () => getAvailableProductsService(),
        []
      );
    },
    checkModuleAddDiscount(book) {
      this.updatedList = this.list;
      var newList;
      newList = this.updatedList.map((item) => {
        if (item.type === "course" && item.items) {
          this.updatedModules = item.items.map((module) => {
            if (book.course_module_id === module.id) {
              return { ...module, bookBindingDiscount: 0 };
            } else {
              return module;
            }
          });
          const newItem = { ...item };
          delete newItem.items;
          return { ...newItem, items: this.updatedModules };
        } else if (item.type === "ebook") {
          if (book.course_module_id === item.id) {
            const newItem = { ...item };
            return { ...newItem, bookBindingDiscount: 0 };
          } else {
            return item;
          }
        } else {
          return item;
        }
      });
      this.$store.dispatch("cart/setList", [...newList].reverse());
    },
    onAddToCart(data) {
      this.addToCartBook = data;
      this.showAddToCartModal = true;
      this.handleAddToCart(this.addToCartBook);
    },
    handleAddToCart(book) {
      this.showAddToCartModal = false;

      const data = { ...book, type: PHYSICAL_PRODUCT };
      this.checkModuleAddDiscount(data);
      this.$store.dispatch("cart/addItem", data);

      this.addToCartProduct = {};
    },
    loadMoreAvailable() {
      this.$fetchNextPageApi(this.availableBooksApi);
    },
  },
};
</script>
