<template>
  <div>
    <div class="row" :class="$isPhone ? 'py-0' : 'py-1'">
      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              :disabled="true"
              :value="basicInfo.firstName"
              placeholder=" "
              type="text"
            />
            <label>{{ $t("iu.profile.labels.firstName") }}</label>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              :disabled="true"
              :value="basicInfo.lastName"
              placeholder=" "
              type="text"
            />
            <label>{{ $t("iu.profile.labels.lastName") }}</label>
          </div>
        </div>
      </div>
    </div>
    <div class="row" :class="$isPhone ? 'py-0' : 'py-1'">
      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              :disabled="true"
              :value="dobFormatted"
              placeholder=" "
              type="text"
            />
            <label>{{ $t("iu.profile.labels.dob") }}</label>
          </div>
        </div>
      </div>

      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="d-flex position-relative">
          <select
            v-model="basicInfo.gender"
            class="col form-field select-field cursor-pointer"
            :class="{
              'text-red': validation.profile.basicInfo.gender.$anyError,
            }"
            type="text"
            @change="(e) => onUpdateField('gender', e.target.value)"
          >
            <option disabled hidden :value="null">
              {{ $t("iu.profile.labels.gender.select") }}*
            </option>
            <option value="M">
              {{ $t("iu.profile.labels.gender.male") }}
            </option>
            <option value="F">
              {{ $t("iu.profile.labels.gender.female") }}
            </option>
          </select>
          <div
            class="d-flex position-absolute justify-content-center align-items-center select-arrows-icon"
          >
            <ChevronDownIcon :size="35" />
          </div>
        </div>
        <ErrorMessage
          v-if="validation.profile.basicInfo.gender.$anyError"
          :param="validation.profile.basicInfo.gender"
        />
      </div>
    </div>
    <div class="row" :class="$isPhone ? 'py-0' : 'py-1'">
      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <!-- <label class="form-label font-weight-600 color-gray">{{ $t("iu.profile.labels.phoneNumber") }}*</label>
      <input
        v-model="basicInfo.phoneNumber"
        :placeholder="placeholderPhoneNumber"
        class="form-field"
        :class="{'text-red': validation.profile.basicInfo.phoneNumber.$anyError}"
        type="text"
        @input="(e) => onUpdateField('phoneNumber', e.target.value)"
      > -->

        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model="basicInfo.phoneNumber"
              placeholder=" "
              :class="{
                'text-red': validation.profile.basicInfo.phoneNumber.$anyError,
              }"
              type="text"
              @input="(e) => onUpdateField('phoneNumber', e.target.value)"
            />
            <label>{{ $t("iu.profile.labels.phoneNumber") }}*</label>
            <PencilOutline class="edit-icon" />
          </div>
        </div>

        <ErrorMessage
          v-if="validation.profile.basicInfo.phoneNumber.$anyError"
          :param="validation.profile.basicInfo.phoneNumber"
        />
      </div>

      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div
            class="material-textfield"
            :class="{ 'small-material-textfield': $isPhone || $isTablet }"
          >
            <input
              :disabled="true"
              :value="email"
              placeholder=" "
              type="text"
            />
            <label>{{ $t("iu.profile.labels.email") }}</label>
          </div>
        </div>
      </div>
    </div>
    <div
      class="d-flex flex-column col-12 col-md-6"
      :class="$isPhone ? 'py-1' : 'py-2 pe-2'"
    >
      <div class="d-flex position-relative">
        <select
          v-model="basicInfo.occupation"
          class="col form-field select-field cursor-pointer w-100"
          :class="{
            'text-red': validation.profile.basicInfo.occupation.$anyError,
          }"
          type="text"
          @change="(e) => onUpdateField('occupation', e.target.value)"
        >
          <option disabled hidden :value="null" :class="'text-dark-gray'">
            {{ $t("iu.profile.labels.occupation.select") }}*
          </option>
          <option
            v-for="(item, index) in occupationList"
            :key="index"
            :value="item.value"
            :class="'text-dark-gray'"
          >
            {{ item.title }}
          </option>
        </select>
        <div
          class="d-flex position-absolute justify-content-center align-items-center select-arrows-icon"
        >
          <ChevronDownIcon :size="35" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.basicInfo.occupation.$anyError"
        :param="validation.profile.basicInfo.occupation"
      />
    </div>
  </div>
</template>

<script>
import ErrorMessage from "@/components/IU/Profile/ErrorMessage";
import { OCCUPATION_LIST } from "@/dataObject/profile/profileData";
import { UTCtoLocalDateOnlyFormatted } from "@/utils/dateTimeUtils";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";
import PencilOutline from "vue-material-design-icons/PencilOutline";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    ChevronDownIcon,
    ErrorMessage,
    PencilOutline,
  },

  props: {
    validation: Object,
    basicInfoProp: Object,
    email: String,
  },

  mixins: [devicesMixin],

  data() {
    return {
      basicInfo: {},
      occupationList: OCCUPATION_LIST,
      groupName: "basicInfo",
    };
  },

  computed: {
    placeholderPhoneNumber: function () {
      return this.$t("iu.profile.placeholders.phoneNumber");
    },
    dobFormatted() {
      return UTCtoLocalDateOnlyFormatted(this.basicInfo.dateOfBirth);
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.basicInfo = { ...this.basicInfoProp };
    },
    onUpdateField(field, value) {
      const data = {
        group: this.groupName,
        field,
        value,
      };
      this.$emit("update-field", data);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/shared/profileForm.scss";

.select-field {
  -webkit-appearance: none;
  box-sizing: border-box;
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

.small-material-textfield input {
  padding-right: 10px !important;
}
</style>
