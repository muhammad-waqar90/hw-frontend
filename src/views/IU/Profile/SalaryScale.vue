<template>
  <div class="container font-montserrat" :class="$isPhone ? 'px-0' : 'px-3'">
    <div
      class="row bg-white rounded-card p-0 mx-0"
      :class="{ 'justify-content-center': $isPhone || $isTablet }"
    >
      <div class="p-4 text-center text-md-start">
        <h4 class="font-weight-600 color-gray mb-0">
          {{ $t("iu.profile.labels.salaryScale.salaryScale") }}
        </h4>
      </div>
      <hr class="mx-10 mt-0" />
      <div
        v-if="countriesLoaded"
        class="col-6 py-5 item rounded-card animated-loading-background"
        :class="$isPhone || $isTablet ? 'small-item col-12' : 'ms-4'"
      />
      <LoadingSalaryScale
        v-if="countriesLoaded"
        class="col-6 py-3"
        :class="{ 'col-12': $isPhone || $isTablet }"
        :number-of-items="4"
      />
      <div
        v-if="!countriesLoaded"
        class="col-6 pt-3"
        :class="{ 'col-12': $isPhone || $isTablet, 'px-5': $isTablet }"
      >
        <div
          class="left-header text-white p-3"
          :class="{ 'small-header': $isPhone || $isTablet }"
        >
          {{ $t("iu.profile.labels.salaryScale.discountEntitlement") }}
        </div>
        <div
          class="left-section mr-4 ml-4 p-4"
          :class="$isPhone || $isTablet ? 'mb-2' : 'mb-4'"
        >
          <div class="d-flex flex-column py-2 text-dark-gray">
            {{ $t("iu.profile.labels.salaryScale.selectCountryLabel") }}
            <div class="d-flex position-relative mt-3">
              <select
                v-model="countrySelected"
                class="col form-field select-field cursor-pointer"
                type="text"
                @change="(e) => handleSelect(e.target.value)"
              >
                <option disabled hidden value="" :class="'text-dark-gray'">
                  {{ $t("iu.profile.labels.salaryScale.selectCountry") }}
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
                class="d-flex position-absolute justify-content-center align-items-center select-arrows-icon"
              >
                <ChevronDownIcon :size="35" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="!countriesLoaded"
        class="col-6 pt-3"
        :class="{
          'opacity-50 pe-none': discountRanges.length === 0,
          'col-12 pb-4': $isPhone || $isTablet,
          'px-5': $isTablet,
        }"
      >
        <div class="right-section p-3">
          <div class="right-header text-black pb-3">
            {{ $t("iu.profile.labels.salaryScale.householdIncomeText") }}
          </div>
          <div v-if="countrySelected">
            <div v-for="(range, idx) in discountOptions" :key="idx">
              <div class="d-flex position-relative mt-2 border-primary">
                <div
                  class="col discount-list w-100"
                  :class="{
                    active: idx == currentStep,
                    'small-discount-list': $isPhone || $isTablet,
                  }"
                  @click="setCurrentStep(idx, range)"
                >
                  {{ returnRanges(idx, range.discount_range) }}
                </div>
                <button
                  class="d-flex position-absolute border-0 justify-content-center align-items-center discount-options-icon"
                >
                  <div class="text-capitalize text-center">
                    {{ range.discount_option }}
                  </div>
                </button>
              </div>
            </div>
          </div>
          <RoundedCheckbox
            :key="this.declaration"
            class="pt-3"
            :class="{ 'pt-5': !countrySelected }"
            :label="$t('iu.profile.labels.salaryScale.honestlyDeclare')"
            :prop-checked="this.declaration"
            @on-change="setDeclaration"
          />
        </div>
        <ButtonWithLoading
          class="btn blue-btn w-100 my-2 rounded-card"
          :class="{
            'mt-4': $isPhone || $isTablet,
          }"
          :loading="salaryScaleApi?.loading"
          @action="createUpdateScale"
          :disabled="disableSalaryScaleButton"
        >
          <slot>
            {{ buttonText }}
          </slot>
        </ButtonWithLoading>
      </div>
    </div>
  </div>
</template>

<script>
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import LoadingSalaryScale from "@/components/IU/Profile/LoadingSalaryScale.vue";
import RoundedCheckbox from "@/components/Misc/Inputs/RoundedCheckbox.vue";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import apiMixin, { getApiState } from "@/mixins/apiMixin";

import {
  getDiscountedCountryList,
  createSalaryScale,
  updateSalaryScale,
} from "@/services/iuService";
import {
  CLASS_A,
  CLASS_B,
  CLASS_C,
  CLASS_D,
} from "@/dataObject/salaryScale/salaryScaleData";
import { mapGetters } from "vuex";

export default {
  components: {
    ChevronDownIcon,
    ButtonWithLoading,
    LoadingSalaryScale,
    RoundedCheckbox,
  },
  mixins: [toastMixin, devicesMixin, apiMixin],
  data() {
    return {
      countrySelected: "",
      discountRanges: [],
      selectedOption: null,
      currentStep: null,
      scaleSelected: { declaration: false },
      declaration: false,
      steps: ["A", "B", "C", "D"],
      countriesLoaded: true,
      salaryScaleApi: getApiState(),
      getDiscountedCountryListApi: getApiState(),
    };
  },
  mounted() {
    this.init();
  },
  computed: {
    discountOptions() {
      if (this.discountRanges.length > 0) {
        return this.discountRanges;
      } else {
        return this.steps;
      }
    },
    buttonText() {
      if (this.salaryScale) {
        return this.salaryScaleApi.loading ? "Updating..." : "Update";
      } else {
        return this.salaryScaleApi.loading ? "Saving..." : "Save";
      }
    },
    disableSalaryScaleButton() {
      if (this.salaryScale) {
        return this.salaryScale.discounted_country_range_id ==
          this.scaleSelected.discounted_country_range_id || !this.declaration
          ? true
          : false;
      } else {
        if (!this.declaration || this.currentStep === null) {
          return true;
        } else {
          return false;
        }
      }
    },
    ...mapGetters({
      salaryScale: "user/getSalaryScale",
      discountPercentage: "user/getDiscountPercentage",
      cartList: "cart/getList",
    }),
  },
  methods: {
    async init() {
      await this.$fetchApiData(this.getDiscountedCountryListApi, () =>
        getDiscountedCountryList()
      );
      if (this.salaryScale) {
        this.handleSelect(this.salaryScale?.discounted_country?.name);
        if (this.discountPercentage == CLASS_A?.value) {
          this.currentStep = 0;
        } else if (this.discountPercentage == CLASS_B?.value) {
          this.currentStep = 1;
        } else if (this.discountPercentage == CLASS_C?.value) {
          this.currentStep = 2;
        } else if (this.discountPercentage == CLASS_D?.value) {
          this.currentStep = 3;
        }

        this.scaleSelected = {
          discounted_country_id: this.salaryScale?.discounted_country_id,
          discounted_country_range_id:
            this.salaryScale?.discounted_country_range_id,
          declaration: this.declaration,
        };
      }
      this.countriesLoaded = false;
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
    async createUpdateScale() {
      if (this.salaryScale == null) {
        await this.$postApiData(this.salaryScaleApi, () =>
          createSalaryScale(this.scaleSelected)
        );
      } else {
        delete this.scaleSelected?.declaration;
        await this.$postApiData(this.salaryScaleApi, () =>
          updateSalaryScale(this.scaleSelected)
        );
      }

      if (this.salaryScaleApi.error) return;
      await this.$store.dispatch("user/setUserData");
    },
    setCurrentStep(index, range) {
      this.currentStep = index;
      this.scaleSelected = {
        discounted_country_id: range.discounted_country_id,
        discounted_country_range_id: range.id,
        declaration: this.declaration,
      };
    },
    handleSelect(country) {
      this.countrySelected = country;
      this.getDiscountedCountryListApi?.data.map((country) => {
        if (country.name === this.countrySelected) {
          this.discountRanges = country.discount_ranges;
        }
      });
      this.showCountries = false;
    },
    setDeclaration(value) {
      this.declaration = value;
      this.scaleSelected.declaration = value;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/shared/profileForm.scss";
.item {
  height: 218px;
  width: 45%;
  margin-top: 24px;
}
.small-item {
  width: 90%;
}

@media (max-width: $tabletWidth) {
  .item {
    height: 450px;
  }
}
.select-field {
  -webkit-appearance: none;
  box-sizing: border-box;
  background-color: $white;
}

.discount-list {
  appearance: none;
  -webkit-appearance: none;
  box-sizing: border-box;
  border: none;
  cursor: pointer;
  //background-color: $lightgray;
  background-color: $white;
  font-weight: 600;
  color: $darkgray;
  padding: 0.73em;
  border: 1px;
  border-radius: 25px;
  text-align: center;
  &:focus {
    outline: none;
  }
}
.discount-list.active {
  border: 2px solid;
  border-color: $blue;
  // Update with your active color
}
.small-discount-list {
  padding-left: 44px;
}

.discount-options-icon {
  @extend .input-icon;
  left: 0;
  background-color: $blue;
  border-radius: 25px 0 0 25px;
  padding-left: 1em;
  padding-right: 1em;
}

.select-arrows-icon {
  @extend .input-icon;
  right: 0;
  background-color: $orange;
  border-radius: 0 20px 20px 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.edit-icon {
  position: absolute;
  right: 10px;
  top: calc(42% - 10px);
  pointer-events: none;
  svg {
    width: 29px;
    height: 29px;
    fill: $blue;
  }
}

.container-mt-outline-input {
  height: fit-content !important;
}

.material-textfield input {
  padding-right: 40px;
}
.left-header {
  background-image: url("/public/img/salaryScaleBg.png");
  background-repeat: no-repeat;
  background-size: cover;
}
.small-header {
  border-radius: 30px 30px 0px 0px;
}
.countries-list {
  background-color: $white;
}
.left-section {
  background-color: $offwhite;
  border-radius: 0 0 30px 30px;
}

.right-section {
  background-color: $offwhite;
  border-radius: 30px;
}
.progresses {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.steps {
  display: flex;
  background-color: $offwhite;
  color: $static-white;
  font-size: 14px;
  width: 30px;
  height: 30px;
  align-items: center;
  justify-content: space-between;
  border-radius: 50%;
  cursor: pointer;
}
</style>
