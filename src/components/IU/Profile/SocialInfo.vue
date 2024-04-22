<template>
  <div class="row">
    <div class="d-flex flex-column col-12 col-md-6 mb-4">
      <label class="form-label font-weight-600 color-gray">{{
        $t("iu.profile.labels.facebookUrl")
      }}</label>
      <div class="d-flex position-relative">
        <input
          v-model="socialInfo.facebookUrl"
          :placeholder="placeholderFacebook"
          class="col form-field form-field--social"
          :class="{
            'text-red': validation.profile.socialInfo.facebookUrl.$anyError,
          }"
          type="text"
          @input="(e) => onUpdateField('facebookUrl', e.target.value)"
        />
        <div
          class="d-flex position-absolute justify-content-center align-items-center input-social-icon"
        >
          <Facebook :size="30" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.socialInfo.facebookUrl.$anyError"
        :param="validation.profile.socialInfo.facebookUrl"
      />
    </div>

    <div class="d-flex flex-column col-12 col-md-6 mb-4">
      <label class="form-label font-weight-600 color-gray">{{
        $t("iu.profile.labels.snapchatUrl")
      }}</label>
      <div class="d-flex position-relative">
        <input
          v-model="socialInfo.snapchatUrl"
          :placeholder="placeholderSnapchat"
          class="col form-field form-field--social"
          :class="{
            'text-red': validation.profile.socialInfo.snapchatUrl.$anyError,
          }"
          type="text"
          @input="(e) => onUpdateField('snapchatUrl', e.target.value)"
        />
        <div
          class="d-flex position-absolute justify-content-center align-items-center input-social-icon"
        >
          <Snapchat :size="30" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.socialInfo.snapchatUrl.$anyError"
        :param="validation.profile.socialInfo.snapchatUrl"
      />
    </div>

    <div class="d-flex flex-column col-12 col-md-6 mb-4">
      <label class="form-label font-weight-600 color-gray">{{
        $t("iu.profile.labels.twitterUrl")
      }}</label>
      <div class="d-flex position-relative">
        <input
          v-model="socialInfo.twitterUrl"
          :placeholder="placeholderTwitter"
          class="col form-field form-field--social"
          :class="{
            'text-red': validation.profile.socialInfo.twitterUrl.$anyError,
          }"
          type="text"
          @input="(e) => onUpdateField('twitterUrl', e.target.value)"
        />
        <div
          class="d-flex position-absolute justify-content-center align-items-center input-social-icon"
        >
          <Twitter :size="30" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.socialInfo.twitterUrl.$anyError"
        :param="validation.profile.socialInfo.twitterUrl"
      />
    </div>

    <div class="d-flex flex-column col-12 col-md-6 mb-4">
      <label class="form-label font-weight-600 color-gray">{{
        $t("iu.profile.labels.instagramUrl")
      }}</label>
      <div class="d-flex position-relative">
        <input
          v-model="socialInfo.instagramUrl"
          :placeholder="placeholderInstagram"
          class="col form-field form-field--social"
          :class="{
            'text-red': validation.profile.socialInfo.instagramUrl.$anyError,
          }"
          type="text"
          @input="(e) => onUpdateField('instagramUrl', e.target.value)"
        />
        <div
          class="d-flex position-absolute justify-content-center align-items-center input-social-icon"
        >
          <Instagram :size="30" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.socialInfo.instagramUrl.$anyError"
        :param="validation.profile.socialInfo.instagramUrl"
      />
    </div>

    <div class="d-flex flex-column col-12 col-md-6 mb-4">
      <label class="form-label font-weight-600 color-gray">{{
        $t("iu.profile.labels.youtubeUrl")
      }}</label>
      <div class="d-flex position-relative">
        <input
          v-model="socialInfo.youtubeUrl"
          :placeholder="placeholderYoutube"
          class="col form-field form-field--social"
          :class="{
            'text-red': validation.profile.socialInfo.youtubeUrl.$anyError,
          }"
          type="text"
          @input="(e) => onUpdateField('youtubeUrl', e.target.value)"
        />
        <div
          class="d-flex position-absolute justify-content-center align-items-center input-social-icon"
        >
          <Youtube :size="30" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.socialInfo.youtubeUrl.$anyError"
        :param="validation.profile.socialInfo.youtubeUrl"
      />
    </div>

    <div class="d-flex flex-column col-12 col-md-6 mb-4">
      <label class="form-label font-weight-600 color-gray">{{
        $t("iu.profile.labels.pinterestUrl")
      }}</label>
      <div class="d-flex position-relative">
        <input
          v-model="socialInfo.pinterestUrl"
          :placeholder="placeholderPinterest"
          class="col form-field form-field--social"
          :class="{
            'text-red': validation.profile.socialInfo.pinterestUrl.$anyError,
          }"
          type="text"
          @input="(e) => onUpdateField('pinterestUrl', e.target.value)"
        />
        <div
          class="d-flex position-absolute justify-content-center align-items-center input-social-icon"
        >
          <Pinterest :size="30" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.socialInfo.pinterestUrl.$anyError"
        :param="validation.profile.socialInfo.pinterestUrl"
      />
    </div>

    <div class="d-flex flex-column col-12 col-md-6 mb-4">
      <label class="form-label font-weight-600 color-gray">{{
        $t("iu.profile.labels.linkedinUrl")
      }}</label>
      <div class="d-flex position-relative">
        <input
          v-model="socialInfo.linkedinUrl"
          :placeholder="placeholderLinkedin"
          class="col form-field form-field--social"
          :class="{
            'text-red': validation.profile.socialInfo.linkedinUrl.$anyError,
          }"
          type="text"
          @input="(e) => onUpdateField('linkedinUrl', e.target.value)"
        />
        <div
          class="d-flex position-absolute justify-content-center align-items-center input-social-icon"
        >
          <Linkedin :size="30" />
        </div>
      </div>
      <ErrorMessage
        v-if="validation.profile.socialInfo.linkedinUrl.$anyError"
        :param="validation.profile.socialInfo.linkedinUrl"
      />
    </div>
  </div>
</template>

<script>
import ErrorMessage from "@/components/IU/Profile/ErrorMessage";

import Facebook from "vue-material-design-icons/Facebook";
import Instagram from "vue-material-design-icons/Instagram";
import Twitter from "vue-material-design-icons/Twitter";
import Snapchat from "vue-material-design-icons/Snapchat";
import Linkedin from "vue-material-design-icons/Linkedin";
import Youtube from "vue-material-design-icons/Youtube";
import Pinterest from "vue-material-design-icons/Pinterest";

export default {
  components: {
    ErrorMessage,

    Facebook,
    Instagram,
    Twitter,
    Snapchat,
    Linkedin,
    Youtube,
    Pinterest,
  },

  props: {
    validation: Object,
    socialInfoProp: Object,
  },

  data() {
    return {
      socialInfo: {},
      groupName: "socialInfo",
    };
  },

  computed: {
    placeholderFacebook: function () {
      return this.$t("iu.profile.placeholders.facebookUrl");
    },

    placeholderSnapchat: function () {
      return this.$t("iu.profile.placeholders.snapchatUrl");
    },

    placeholderTwitter: function () {
      return this.$t("iu.profile.placeholders.twitterUrl");
    },

    placeholderInstagram: function () {
      return this.$t("iu.profile.placeholders.instagramUrl");
    },

    placeholderYoutube: function () {
      return this.$t("iu.profile.placeholders.youtubeUrl");
    },

    placeholderPinterest: function () {
      return this.$t("iu.profile.placeholders.pinterestUrl");
    },

    placeholderLinkedin: function () {
      return this.$t("iu.profile.placeholders.linkedinUrl");
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.socialInfo = { ...this.socialInfoProp };
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

.form-field--social {
  padding-left: 3.5em;
}

.input-social-icon {
  @extend .input-icon;
  background-color: $blue;
  border-radius: 20px 0 0 20px;
  padding-left: 0.7em;
  padding-right: 0.5em;
}
</style>
