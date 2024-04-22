<template>
  <section>
    <DashboardStatistics class="mb-4" />
    <EnrolledCourses
      class="mb-4"
      :courses="enrolledCourses"
      :loading="loading"
    />
    <TopCourses
      class="mb-4"
      :courses="topCourses"
      :loading="loading"
      @add-to-cart="onAddToCart"
    />
    <!-- Todo: Need to optimise these all modals into new components -->
    <!-- Start modal for lecture notes access -->
    <lectureNotesAccessModal
      v-if="modalMode == true"
      @close-modal="onCloseModalLec"
    >
      <template slot="body">
        <div class="text-center">
          <svgkudos />
        </div>
        <h2 class="pt-4 text-center text-primary">CONGRATULATIONS</h2>
        <div
          class="w-100 pt-3 h5 text-center"
          v-for="item in lectureNotesAccess"
          :key="item.id"
        >
          You're now eligible for the <strong>{{ item.book.name }}</strong> book
          in electronic format (lecture notes).
          <span v-show="!item.user_enrolled_to_course">
            You will automatically be granted access to the lecture notes after
            you have enrolled for the <strong>{{ item.name }}</strong> course.
          </span>
          <div class="d-flex justify-content-center mt-3">
            <hr class="hr w-50" v-if="lectureNotesAccess.length > 0" />
          </div>
        </div>
      </template>
    </lectureNotesAccessModal>
    <!-- End modal for lecture notes access -->

    <ComingSoonCourses
      class="mb-4"
      :courses="comingSoonCourses"
      :loading="loading"
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
    <!-- salary scale -->
    <ModalDiscount
      v-if="testModal && !enableSalaryScale && !salaryScale"
      :hide-footer="true"
      :hide-header="true"
      :close-on-click-outside="false"
    >
      <template slot="body">
        <div class="salary-scale-header">
          <img
            class="salary-scale-logo"
            src="/img/SalaryScale/logo-salary-scale.png"
            height="60"
          />
        </div>
        <div v-if="showSearchSection === false">
          <div class="p-4">
            <span
              >You may be entitled to a discount on our courses based on
              affordability. Click proceed to continue. This can also be
              completed later from within the user profile.</span
            >
          </div>
          <div class="d-flex gap-3 ps-4 pb-4 justify-content-center">
            <button
              type="button"
              class="btn btn-outline-secondary rounded-pill w-25"
              :class="{ 'mob-salary-scale-button': $isPhone }"
              @click="enableSalaryScaleFlag()"
            >
              Dismiss
            </button>
            <button
              type="button"
              class="btn btn-primary rounded-pill w-25"
              :class="{ 'mob-salary-scale-button': $isPhone }"
              @click="onClickProceed"
            >
              Proceed
            </button>
          </div>
        </div>
      </template>
    </ModalDiscount>
    <ModalDiscount
      v-if="showSearchSection || salaryScalePopupFlag"
      :hide-footer="true"
      :hide-header="true"
      :close-on-click-outside="false"
    >
      <template slot="body">
        <div class="salary-scale-header">
          <img
            class="salary-scale-logo"
            src="/img/SalaryScale/logo-salary-scale.png"
            height="60"
          />
        </div>
        <div>
          <div class="p-4">
            <span
              >Please select from the dropdown below to see the salary ranges
              for your country.</span
            >
          </div>
          <div class="d-flex dropdown-head position-relative">
            <select
              class="col form-field select-field cursor-pointer w-100"
              type="text"
              v-model="countrySelected"
              @change="(e) => handleSelect(e.target.value)"
            >
              <option disabled value="null" :class="'text-dark-gray'">
                Select Country
              </option>
              <option
                v-for="(item, index) in getDiscountedCountryListApi?.data"
                :key="index"
                :value="item.name"
                :class="'text-dark-gray'"
              >
                {{ item.name }}
              </option>
            </select>
            <div
              class="d-flex position-absolute end-0 justify-content-center align-items-center select-arrows-icon"
            >
              <ChevronDownIcon :size="35" />
            </div>
          </div>
        </div>
        <div
          v-if="discountRanges.length > 0"
          :class="{
            'mob-salary-scale-options scrollbar-blue': $isPhone,
          }"
        >
          <div
            class="progress-section h-25"
            :class="{ 'mob-progress-section': $isPhone }"
          >
            <span
              >Please confirm your annual household income by selecting the
              appropriate category below.</span
            >
          </div>
          <div
            v-for="(range, idx) in discountOptions"
            :key="idx"
            class="d-flex justify-content-center cursor-pointer dropdown-detail position-relative"
            :class="{
              selected: idx == currentStep,
              'mob-dropdown-detail': $isPhone,
            }"
            @click="setCurrentStep(idx, range)"
          >
            <div class="py-3 ps-6 fw-bold">
              {{ returnRanges(idx, range.discount_range) }}
            </div>
            <hr class="hr" />
            <div
              class="d-flex position-absolute text-uppercase justify-content-center align-items-center py-3 start-0 left-options"
            >
              <span>{{ range.discount_option }}</span>
            </div>
          </div>
          <div
            class="d-flex gap-3 mt-3 progress-checkbox"
            :class="{ 'mob-progress-checkbox': $isPhone }"
          >
            <RoundedCheckbox
              class="mb-3"
              label="I honestly declare that this statement is true."
              @on-change="setDeclaration"
            />
          </div>
          <div
            class="text-blue mx-5"
            :class="{ 'mob-salary-scale-instruction': $isPhone }"
          >
            <p>
              <Information :size="17" class="text-primary" />
              This information will be stored in your profile and can changed at
              any point.
            </p>
            <ButtonWithLoading
              class="btn blue-btn w-100 mt-2 mb-3 rounded-card"
              :loading="loading"
              @action="createScale"
              :disabled="disableSalaryScaleButton"
            >
              <slot>
                {{ loading ? "Saving..." : "PROCEED" }}
              </slot>
            </ButtonWithLoading>
          </div>
        </div>
      </template>
    </ModalDiscount>
  </section>
</template>

<script>
import svgkudos from "@/assets/svg/kudos.svg";
import RoundedCheckbox from "@/components/Misc/Inputs/RoundedCheckbox.vue";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown.vue";
import DashboardStatistics from "@/components/IU/Courses/DashboardStatistics";
import EnrolledCourses from "@/components/IU/Courses/EnrolledCourses";
import TopCourses from "@/components/IU/Courses/TopCourses";

import lectureNotesAccessModal from "@/components/Misc/lectureNotesAccessModal.vue";
import ComingSoonCourses from "@/components/IU/Courses/ComingSoonCourses";
import Modal from "@/components/Misc/Modal";
import ModalDiscount from "@/components/Misc/ModalDiscount.vue";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart.vue";
import {
  getOwnedCoursesService,
  getTopCoursesService,
  getComingSoonCoursesService,
} from "@/services/iuService";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import { CART_COURSE, CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";
import { mapGetters } from "vuex";
import {
  getDiscountedCountryList,
  createSalaryScale,
  enableSalaryScale,
} from "@/services/iuService";
import Information from "vue-material-design-icons/InformationOutline";

export default {
  name: "IUDashboard",

  components: {
    ChevronDownIcon,
    RoundedCheckbox,
    ButtonWithLoading,
    svgkudos,
    DashboardStatistics,
    EnrolledCourses,
    TopCourses,
    lectureNotesAccessModal,
    ModalDiscount,
    ComingSoonCourses,
    Modal,
    AddEbooksToCart,
    Information,
  },

  mixins: [toastMixin, devicesMixin, apiMixin],

  data() {
    return {
      testModal: true,
      showSearchSection: false,
      selectedCountry: "",
      getDiscountedCountryListApi: getApiState(),
      discountRanges: [],
      showDetailSection: "false",
      currentStep: null,
      scaleSelected: { declaration: false },
      declaration: false,
      steps: ["A", "B", "C", "D"],
      modalMode: "",
      enrolledCourses: [],
      topCourses: [],
      comingSoonCourses: [],
      loading: false,

      addToCartCourse: {},
      showAddToCartModal: false,
      countrySelected: null,

      attrs: [
        {
          highlight: {
            style: {
              background: "#1982EF",
            },
            contentStyle: {
              color: "white",
            },
          },
          dates: new Date(),
        },
      ],
    };
  },
  mounted() {
    this.modalMode = this.isModalOpen;
    this.init();
  },
  computed: {
    discountOptions() {
      if (this.discountRanges?.length > 0) {
        return this.discountRanges;
      } else {
        return this.steps;
      }
    },
    disableSalaryScaleButton() {
      if (!this.declaration || this.currentStep === null) {
        return true;
      } else {
        return false;
      }
    },
    ...mapGetters({
      lectureNotesAccess: "product/getLectureNotesAccess",
      isModalOpen: "product/isModalOpen",
      salaryScale: "user/getSalaryScale",
      enableSalaryScale: "user/getEnableSalaryScale",
      salaryScalePopupFlag: "user/getSalaryScalePopupFlag",
    }),
  },
  watch: {
    async salaryScalePopupFlag() {
      if (this.salaryScalePopupFlag)
        await this.$fetchApiData(this.getDiscountedCountryListApi, () =>
          getDiscountedCountryList()
        );
    },
  },
  methods: {
    async onClickProceed() {
      this.showSearchSection = true;
      await this.$fetchApiData(this.getDiscountedCountryListApi, () =>
        getDiscountedCountryList()
      );
    },
    handleSelect(country) {
      this.selectedCountry = country;
      this.getDiscountedCountryListApi?.data.map((country) => {
        if (country?.name === this.selectedCountry) {
          this.discountRanges = country?.discount_ranges;
        }
      });
      this.showCountries = false;
    },
    returnRanges(idx, range) {
      if (idx === 0) {
        return `Under £${range[0]} per year`;
      } else if (idx === 1 || idx === 2) {
        return `£${range[0]} to £${range[1]} per year`;
      } else {
        return `£${range[0]} per year`;
      }
    },
    setCurrentStep(index, range) {
      this.currentStep = index;
      this.scaleSelected = {
        discounted_country_id: range?.discounted_country_id,
        discounted_country_range_id: range?.id,
        declaration: this.declaration,
      };
    },
    setDeclaration(value) {
      this.declaration = value;
      this.scaleSelected.declaration = value;
    },
    async createScale() {
      this.loading = true;
      await createSalaryScale(this.scaleSelected).then((res) => {
        if (res) {
          this.loading = false;
          this.testModal = false;
          this.showSearchSection = false;
          this.$store.dispatch("user/setSalaryScalePopupFlag", false);
          this.$displaySuccessToast(
            "Salary scale has been successfully added!"
          );
        }
      });
      await this.$store.dispatch("user/setUserData");
    },
    onCloseModalLec() {
      this.$store.dispatch("product/setOpenModal");
      this.$store.state.product.openModal = "false";
      this.$store.state.product.lectureNotesAccess = [];
      this.modalMode = "";
    },
    async init() {
      this.loading = true;

      const owned = await getOwnedCoursesService();
      const top = await getTopCoursesService();
      const comingSoon = await getComingSoonCoursesService();

      this.enrolledCourses = owned.data;
      this.topCourses = top.data;
      this.comingSoonCourses = comingSoon.data;

      if (this.salaryScalePopupFlag)
        await this.$fetchApiData(this.getDiscountedCountryListApi, () =>
          getDiscountedCountryList()
        );

      this.loading = false;
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
    async enableSalaryScaleFlag() {
      this.testModal = false;
      const payload = {
        enable_salary_scale: true,
      };
      await enableSalaryScale(payload);
      await this.$store.dispatch("user/setUserData");
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/shared/profileForm.scss";

.select-field {
  -webkit-appearance: none;
  box-sizing: border-box;
}
.selected {
  border: 2px solid $blue;
}
.salary-scale-header {
  display: flex;
  background-image: url("/public/img/SalaryScale/bg-head-salary-scale.png");
  background-repeat: no-repeat;
  background-size: cover;
  height: 110px;
  width: calc(101% - 1px);
  align-items: center;
  justify-content: center;
}
.salary-scale-logo {
  width: auto;
}
.mob-salary-scale-button {
  padding: 4px 12px !important;
  width: fit-content !important;
  height: fit-content;
}
.mob-salary-scale-options {
  overflow-y: scroll;
  max-height: 400px;
}
.mob-salary-scale-instruction {
  margin-left: 26px !important;
  margin-right: 26px !important;
}
.rounded-bar {
  border-radius: 50px;
}

.search-icon {
  background-color: $white;
  border-color: $white;
  padding: 0 0 0 10px;
}

.calendar-card {
  > div {
    border-radius: 20px;
  }
}
.dropdown-head {
  margin-bottom: 20px;
  margin-left: 35px;
  margin-right: 35px;
}
.dropdown-detail {
  margin-left: 35px;
  margin-right: 35px;
  border-radius: 30px 30px;
  background-color: $offwhite;
  margin-bottom: 15px;
}
.mob-dropdown-detail {
  margin-right: 30px;
  margin-left: 30px;
  justify-content: start !important;
  padding-left: 52px;
}
.select-arrows-icon {
  @extend .input-icon;
  background-color: $orange;
  border-radius: 0 20px 20px 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
}
.left-options {
  @extend .input-icon;
  background-color: $blue;
  color: $static-white;
  width: 40px;
  border-radius: 30px 0 0 30px;
  padding-left: 1.5em;
  padding-right: 1.5em;
}
.progress-section {
  margin-left: 35px;
  margin-right: 35px;
  height: 200px;
  padding: 10px;
}
.mob-progress-section {
  margin-left: 26px;
  margin-right: 26px;
}
.progress-checkbox {
  margin-left: 30px;
  margin-right: 35px;
  padding: 10px;
}
.mob-progress-checkbox {
  margin-left: 26px;
  margin-right: 26px;
}
.progress-box {
  border-radius: 23px 23px;
  background: $white;
  margin-top: 20px;
}
.progresses {
  display: flex;
  align-items: center;
}

.line {
  height: 6px;
  background: $white;
  transition: width 0.3s;
  width: 65px;
  padding-left: 20px;
}

.steps {
  display: flex;
  background-color: #eff2f8;
  color: $static-white;
  font-size: 14px;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
}

.steps.active {
  background-color: $blue; // Update with your active color
}

.progresses {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
<style lang="scss">
@import "@/assets/sass/_variables.scss";
.vc-arrow {
  color: $blue !important;
}
.vc-title {
  line-height: 20px !important;
}
</style>
