<template>
  <portal to="out-of-app-content">
    <Modal
      :hide-header="true"
      :hide-footer="true"
      :close-on-click-outside="false"
      @close-modal="closeModal"
    >
      <template slot="body">
        <div
          class="blue-button rounded-card col-12 col-md-6 mx-auto p-3 text-uppercase d-flex align-items-center justify-content-center font-weight-600"
          :class="{ 'mt-3': $isPhone }"
        >
          <div class="ps-3">
            {{ $t("iu.cart.exams") }}
          </div>
          <div class="ps-5">
            <SchoolIcon :size="36" />
          </div>
        </div>
        <div v-if="!loading" class="mt-3 mt-md-5">
          <AddModuleExamToCart
            :course-modules="courseModules"
            :course="course"
            @on-item-click="handleItemClick"
            @on-select-all="handleSelectAll"
            @on-add-to-cart="handleAddToCart"
          />
        </div>
        <div v-else class="mt-3 mt-md-5">
          <LoadingModuleExamCart />
        </div>
      </template>
    </Modal>
  </portal>
</template>

<script>
import AddModuleExamToCart from "@/components/IU/Cart/Exams/AddModuleExamToCart";
import LoadingModuleExamCart from "@/components/IU/Cart/Exams/LoadingModuleExamCart";

import SchoolIcon from "vue-material-design-icons/School";
import Modal from "@/components/Misc/Modal";

import { getCourseModuleQuizAccess } from "@/services/IU/iuQuizService";

import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { CART_EXAM } from "@/dataObject/cart/cartItemTypeData";

export default {
  components: {
    AddModuleExamToCart,
    LoadingModuleExamCart,
    SchoolIcon,
    Modal,
  },
  mixins: [toastMixin, devicesMixin],
  props: {
    courseId: {
      type: Number,
    },
    courseModuleId: {
      type: Number,
    },
  },
  data() {
    return {
      course: {},
      courseModules: [],
      selectAll: true,
      loading: true,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      this.loading = true;

      const response = await getCourseModuleQuizAccess(
        this.courseId,
        this.courseModuleId
      );
      this.loading = false;

      if (response.error) return this.handleLoadingError(response);

      this.parseData(response);
    },
    parseData(response) {
      const { courseModules, ...course } = response;

      this.courseModules = response.courseModules.map((item) => {
        if (
          this.selectAll ||
          this.courseModuleId == item.course_module_id ||
          item.disabled
        )
          item.selected = true;
        else item.selected = false;

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
      for (const item of this.courseModules)
        if (item.selected && !item.disabled) {
          this.$store.dispatch("cart/addItem", this.parseItemForCart(item));
          this.$store.dispatch("cart/addRedirectToExamId", {
            courseId: this.courseId,
            courseModuleId: this.courseModuleId,
          });
        }
      this.closeModal();
    },
    parseItemForCart(item) {
      let parsedItem = {};

      parsedItem.id = item.id;
      parsedItem.name = `${this.course.name} - ${this.course.level_name} - ${item.name}`;
      parsedItem.price = item.price;
      parsedItem.type = CART_EXAM;

      return parsedItem;
    },
    handleLoadingError(response) {
      this.$displayServerResponse(response);
      this.closeModal();
    },
    closeModal() {
      this.$emit("close-modal");
    },
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.blue-button {
  color: $static-white;
  background: $blue;
}
</style>
