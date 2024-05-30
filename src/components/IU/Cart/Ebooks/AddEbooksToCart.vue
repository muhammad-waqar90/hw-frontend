<template>
  <div>
    <div
      class="ebook-button rounded-card text-white col-12 col-md-6 mx-auto p-3 text-uppercase d-flex align-items-center justify-content-center font-weight-600"
      :class="{ 'mt-3': $isPhone }"
    >
      <div class="ps-3">
        {{ $t("iu.cart.types.ebook") }}
      </div>
      <div :class="$isPhone || $isTablet ? 'ps-3' : 'ps-5'">
        <BookOpenOutline :size="36" />
      </div>
    </div>
    <div class="mt-3 mt-md-5">
      <Page1 v-if="page == 1" @on-buy="onNextPage" @on-cancel="onCancel" />
      <Page2
        v-if="page == 2 && course.id"
        :course="course"
        :course-modules="courseModules"
        :select-module="selectModule"
        @on-item-click="handleItemClick"
        @on-select-all="handleSelectAll"
        @on-add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script>
import BookOpenOutline from "vue-material-design-icons/BookOpenBlankVariant";
import Page1 from "@/components/IU/Cart/Ebooks/AddEbooksPage1";
import Page2 from "@/components/IU/Cart/Ebooks/AddEbooksPage2";

import { getCourseWithAvailableEbooks as iuGetCourseWithAvailableEbooks } from "@/services/IU/iuEbookService";
import { getCourseWithAvailableEbooks as guGetCourseWithAvailableEbooks } from "@/services/GU/guCourseService";

import { mapGetters } from "vuex";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import userRoleMixin from "@/mixins/User/userRoleMixin";
import toastMixin from "@/mixins/toastMixin";

export default {
  components: {
    BookOpenOutline,
    Page1,
    Page2,
  },
  mixins: [userRoleMixin, toastMixin, devicesMixin],
  props: {
    courseId: Number,
    levelValue: Number,
    selectAll: {
      type: Boolean,
      default: false,
    },
    selectModule: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      course: {},
      courseModules: [],
      page: 1,
    };
  },
  computed: {
    getCourseWithAvailableEbooks() {
      return this.$userIsGU
        ? guGetCourseWithAvailableEbooks
        : iuGetCourseWithAvailableEbooks;
    },
    ...mapGetters({ list: "cart/getList" }),
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const response = await this.getCourseWithAvailableEbooks(
        this.courseId,
        this.levelValue
      );

      if (response.error) return this.handleLoadingError(response);

      if (response.courseModules.length == 0) this.onCancel();

      this.parseCourse(response);
    },
    parseCourse(response) {
      const { courseModules, ...course } = response;

      this.courseModules = courseModules.map((item) => {
        if (this.selectAll || this.selectModule == item.id || item.disabled)
          item.selected = true;

        return item;
      });
      this.course = course;
    },
    handleItemClick(data) {
      this.courseModules = this.courseModules.map((item) => {
        if (item.disabled || item.id != data.id) return item;

        item.selected = data.value;
        return item;
      });
    },
    handleSelectAll(value) {
      this.courseModules = this.courseModules.map((item) => {
        if (item.disabled) return item;

        item.selected = value;
        return item;
      });
    },
    handleAddToCart() {
      let data = [];

      for (const item of this.courseModules)
        if (item.selected && !item.disabled)
          data.push(this.parseItemForCart(item));

      this.$emit("on-added", data);
    },
    parseItemForCart(item) {
      let parsedItem = {};
      this.list.forEach((listItem) => {
        if (listItem.type == "physical_product") {
          if (listItem.course_module_id == item.id) {
            parsedItem.bookBindingDiscount = 0;
          }
        }
      });
      parsedItem.id = item.id;
      parsedItem.name = `${this.course.name} - ${this.course.level_name} - ${item.name}`;
      parsedItem.price = item.price;

      return parsedItem;
    },
    onNextPage() {
      this.page = 2;
    },
    onCancel() {
      this.$emit("on-cancel");
    },
    handleLoadingError(response) {
      this.$displayServerResponse(response);
      this.onCancel();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.ebook-button {
  background: $green;
}
</style>
