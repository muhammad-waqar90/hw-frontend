<template>
  <section>
    <CommonCourses
      class="mb-4"
      :courses="availableCoursesApi.data"
      :loading="availableCoursesApi.loading"
      title="available"
      @add-to-cart="onAddToCart"
      @on-scroll-end="loadMore"
    />

    <portal to="out-of-app-content">
      <Modal
        v-if="showAddToCartModal"
        :hide-footer="true"
        :hide-header="true"
        :close-on-click-outside="false"
        @close-modal="handleAddToCart(addToCartCourse)"
      >
        <template slot="body">
          <AddEbooksToCart
            :level-value="1"
            :course-id="addToCartCourse.id"
            :select-all="true"
            @on-added="(e) => handleAddToCart(addToCartCourse, e)"
            @on-cancel="handleAddToCart(addToCartCourse)"
          />
        </template>
      </Modal>
    </portal>
  </section>
</template>

<script>
import CommonCourses from "@/components/IU/Courses/CommonCourses";
import Modal from "@/components/Misc/Modal";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart";

import { getAvailableCoursesService } from "@/services/iuService";

import apiMixin, { getApiState } from "@/mixins/apiMixin";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import backButtonMixin from "@/mixins/Misc/backButtonMixin";

import { CART_COURSE, CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";

export default {
  name: "CoursesAvailable",

  components: {
    CommonCourses,
    Modal,
    AddEbooksToCart,
  },

  mixins: [toastMixin, devicesMixin, apiMixin, backButtonMixin],

  data() {
    return {
      availableCoursesApi: getApiState([]),

      addToCartCourse: {},
      showAddToCartModal: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      await this.$fetchApiData(
        this.availableCoursesApi,
        () => getAvailableCoursesService(),
        []
      );
    },
    onAddToCart(data) {
      if (!data.has_level_1_ebook) return this.handleAddToCart(data);

      this.addToCartCourse = data;
      this.showAddToCartModal = true;
    },
    handleAddToCart(course, ebooks = null) {
      this.showAddToCartModal = false;

      const data = { ...course, type: CART_COURSE };
      if (ebooks)
        data.items = ebooks.map((item) => {
          item.type = CART_EBOOK;
          return item;
        });

      this.$store.dispatch("cart/addItem", data);

      this.addToCartCourse = {};
    },
    loadMore() {
      this.$fetchNextPageApi(this.availableCoursesApi);
    },
  },
};
</script>
