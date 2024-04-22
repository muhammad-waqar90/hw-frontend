<template>
  <form @submit.prevent="onSubmit">
    <div class="h-100 course-discount-body py-4 px-4 rounded-card">
      <div>
        <div class="row">
          <div
            v-for="option in discountOptions"
            :key="option.percentage"
            class="col-sm"
          >
            <div class="mb-3">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text option-header">
                    {{ option.option }}
                  </span>
                </div>
                <input
                  type="text"
                  class="form-control"
                  id="discount"
                  disabled
                  v-model="option.percentage"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <RoundedCheckbox
        class="mb-3"
        label="Would you like to enable these discounts for this course?"
        :prop-checked="course.is_discounted"
        @on-change="onChangeDiscountStatus"
      />
    </div>
    <div class="d-flex justify-content-end pt-2 mr-2">
      <ButtonWithLoading
        class="btn blue-btn"
        :loading="api?.loading"
        :disabled="!isDiscountStatusChanged"
      >
        <slot>
          {{ api?.loading ? "Updating..." : "Update" }}
        </slot>
      </ButtonWithLoading>
    </div>
  </form>
</template>

<script>
import { courseText } from "@/dataObject/AF/afStaticTextsData.js";
import { updateCourseDiscounts } from "@/services/AF/afCourseDiscountService.js";
import toastMixin from "@/mixins/toastMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import { SALARY_SCALE_DISCOUNT_OPTIONS } from "@/dataObject/salaryScale/salaryScaleData";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading.vue";
import RoundedCheckbox from "@/components/Misc/Inputs/RoundedCheckbox.vue";

export default {
  name: "CourseDiscounts",
  components: {
    ButtonWithLoading,
    RoundedCheckbox,
  },
  mixins: [toastMixin, apiMixin],
  props: {
    course: { type: Object },
    isAllowAddDelete: { type: Boolean, default: false },
  },
  data() {
    return {
      courseText,
      isDiscounted: false,
      discountOptions: SALARY_SCALE_DISCOUNT_OPTIONS,
      isDiscountStatusChanged: false,
      api: getApiState(),
    };
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
      if (this.course?.is_discounted) {
        this.isDiscounted = true;
      }
    },
    onChangeDiscountStatus() {
      this.isDiscounted = !this.isDiscounted;
      this.isDiscountStatusChanged = !this.isDiscountStatusChanged;
    },
    async onSubmit() {
      const data = {
        course_id: this.course.id,
        is_discounted: this.isDiscounted,
      };
      await this.$postApiData(this.api, () => updateCourseDiscounts(data));

      if (this.api.error) return;
      this.isDiscountStatusChanged = !this.isDiscountStatusChanged;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.course-discount-body {
  background-color: $lightgray;
}
.option-header {
  background-color: $blue;
  color: $static-white;
}
</style>
