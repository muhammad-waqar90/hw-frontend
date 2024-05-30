<template>
  <section>
    <EnrolledCourses
      class="mb-4"
      :courses="enrolledCoursesApi.data"
      :loading="enrolledCoursesApi.loading"
    />

    <TopCourses
      class="mb-4"
      :courses="topCoursesApi.data"
      :loading="topCoursesApi.loading"
      @add-to-cart="onAddToCart"
    />

    <AvailableCourses
      class="mb-4"
      :courses="availableCoursesApi.data"
      :loading="availableCoursesApi.loading"
      @add-to-cart="onAddToCart"
      @on-scroll-end="loadMoreAvailable"
    />

    <ComingSoonCourses
      class="mb-1"
      :courses="comingSoonCoursesApi.data"
      :loading="comingSoonCoursesApi.loading"
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
import EnrolledCourses from "@/components/IU/Courses/EnrolledCourses";
import TopCourses from "@/components/IU/Courses/TopCourses";
import AvailableCourses from "@/components/IU/Courses/AvailableCourses";
import ComingSoonCourses from "@/components/IU/Courses/ComingSoonCourses.vue";

import Modal from "@/components/Misc/Modal";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart";

import apiMixin, { getApiState } from "@/mixins/apiMixin";

import {
  getAvailableCoursesService,
  getOwnedCoursesService,
  getTopCoursesService,
  getComingSoonCoursesService,
} from "@/services/iuService";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

import { mapGetters } from "vuex";

import { CART_COURSE, CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";

export default {
  name: "Courses",

  components: {
    EnrolledCourses,
    TopCourses,
    AvailableCourses,
    ComingSoonCourses,
    Modal,
    AddEbooksToCart,
  },

  mixins: [toastMixin, devicesMixin, apiMixin],

  data() {
    return {
      enrolledCoursesApi: getApiState(),
      topCoursesApi: getApiState(),
      availableCoursesApi: getApiState(),
      comingSoonCoursesApi: getApiState(),

      addToCartCourse: {},
      showAddToCartModal: false,
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
        this.enrolledCoursesApi,
        () => getOwnedCoursesService(),
        []
      );
      await this.$fetchApiData(
        this.topCoursesApi,
        () => getTopCoursesService(),
        []
      );
      await this.$fetchApiData(
        this.availableCoursesApi,
        () => getAvailableCoursesService(),
        []
      );
      await this.$fetchApiData(
        this.comingSoonCoursesApi,
        () => getComingSoonCoursesService(),
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
          this.list.forEach((listItem) => {
            if (
              listItem.type === "physical_product" &&
              listItem.course_module_id
            ) {
              if (item.id === listItem.course_module_id) {
                item.bookBindingDiscount = 0;
              }
            }
          });
          item.type = CART_EBOOK;
          return item;
        });

      this.$store.dispatch("cart/addItem", data);

      this.addToCartCourse = {};
    },
    loadMoreAvailable() {
      this.$fetchNextPageApi(this.availableCoursesApi);
    },
  },
};
</script>
