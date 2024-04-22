<template>
  <div>
    <div class="row" :class="$isPhone ? 'py-0' : 'py-1'">
      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model="contactInfo.address"
              placeholder=" "
              :class="{
                'text-red': validation.profile.contactInfo.address.$anyError,
              }"
              type="text"
              @input="(e) => onUpdateField('address', e.target.value)"
            />
            <label>{{ $t("iu.profile.labels.address") }}*</label>
            <PencilOutline class="edit-icon" />
          </div>
        </div>

        <ErrorMessage
          v-if="validation.profile.contactInfo.address.$anyError"
          :param="validation.profile.contactInfo.address"
        />
      </div>

      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model="contactInfo.city"
              placeholder=" "
              :class="{
                'text-red': validation.profile.contactInfo.city.$anyError,
              }"
              type="text"
              @input="(e) => onUpdateField('city', e.target.value)"
            />
            <label>{{ $t("iu.profile.labels.city") }}*</label>
            <PencilOutline class="edit-icon" />
          </div>
        </div>

        <ErrorMessage
          v-if="validation.profile.contactInfo.city.$anyError"
          :param="validation.profile.contactInfo.city"
        />
      </div>
    </div>

    <div class="row" :class="$isPhone ? 'py-0' : 'py-1'">
      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model="contactInfo.country"
              placeholder=" "
              :class="{
                'text-red': validation.profile.contactInfo.country.$anyError,
              }"
              type="text"
              @input="(e) => onUpdateField('country', e.target.value)"
            />
            <label>{{ $t("iu.profile.labels.country") }}*</label>
            <PencilOutline class="edit-icon" />
          </div>
        </div>

        <ErrorMessage
          v-if="validation.profile.contactInfo.country.$anyError"
          :param="validation.profile.contactInfo.country"
        />
      </div>

      <div class="d-flex flex-column col-12 col-md-6 py-1">
        <div class="container-mt-outline-input">
          <div class="material-textfield">
            <input
              v-model="contactInfo.postalCode"
              placeholder=" "
              :class="{
                'text-red': validation.profile.contactInfo.postalCode.$anyError,
              }"
              type="text"
              @input="(e) => onUpdateField('postalCode', e.target.value)"
            />
            <label>{{ $t("iu.profile.labels.postalCode") }}*</label>
            <PencilOutline class="edit-icon" />
          </div>
        </div>
        <ErrorMessage
          v-if="validation.profile.contactInfo.postalCode.$anyError"
          :param="validation.profile.contactInfo.postalCode"
        />
      </div>
    </div>
  </div>
</template>

<script>
import ErrorMessage from "@/components/IU/Profile/ErrorMessage";
import PencilOutline from "vue-material-design-icons/PencilOutline";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    ErrorMessage,
    PencilOutline,
  },

  props: {
    validation: Object,
    contactInfoProp: Object,
  },

  mixins: [devicesMixin],

  data() {
    return {
      contactInfo: {},
      groupName: "contactInfo",
    };
  },

  computed: {
    placeholderCity: function () {
      return this.$t("iu.profile.placeholders.city");
    },

    placeholderCountry: function () {
      return this.$t("iu.profile.placeholders.country");
    },

    placeholderAddress: function () {
      return this.$t("iu.profile.placeholders.address");
    },

    placeholderPostalCode: function () {
      return this.$t("iu.profile.placeholders.postalCode");
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.contactInfo = { ...this.contactInfoProp };
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

.input-search-icon {
  @extend .input-icon;
  right: 0;
  background-color: $blue;
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
</style>
