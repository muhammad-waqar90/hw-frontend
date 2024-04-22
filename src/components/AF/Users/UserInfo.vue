<template>
  <div class="h-100 bg-white">
    <div class="row px-2">
      <div class="col-3 px-4 pt-3 pb-5">
        <FormGroupDisabledInput
          t-key="firstName"
          t-module="iu.profile"
          :value="user.first_name"
        />
        <FormGroupDisabledInput
          t-key="lastName"
          t-module="iu.profile"
          :value="user.last_name"
        />
        <FormGroupDisabledInput
          t-key="userName"
          t-module="iu.profile"
          :value="user.name"
        />
        <!-- <FormGroupDisabledInput
          t-key="dob"
          t-module="iu.profile"
          :value="user.date_of_birth"
        /> -->
        <FormGroupDisabledInput
          t-key="gender.title"
          t-module="iu.profile"
          :value="user.gender"
        />
        <FormGroupDisabledInput
          t-key="occupation.title"
          t-module="iu.profile"
          :value="userOccupation && userOccupation.title"
        />
      </div>

      <div class="col-3 px-4 pt-3 pb-5">
        <FormGroupDisabledInput
          t-key="city"
          t-module="iu.profile"
          :value="user.city"
        />
        <FormGroupDisabledInput
          t-key="country"
          t-module="iu.profile"
          :value="user.country"
        />
        <FormGroupDisabledInput
          t-key="address"
          t-module="iu.profile"
          :value="user.address"
        />
        <FormGroupDisabledInput
          t-key="postalCode"
          t-module="iu.profile"
          :value="user.postal_code"
        />
      </div>

      <!-- <div class="col-3 px-4 pt-3 pb-5">
        <FormGroupDisabledInput
          t-key="facebookUrl"
          t-module="iu.profile"
          :value="user.facebook_url"
        />
        <FormGroupDisabledInput
          t-key="linkedinUrl"
          t-module="iu.profile"
          :value="user.linkedin_url"
        />
        <FormGroupDisabledInput
          t-key="snapchatUrl"
          t-module="iu.profile"
          :value="user.snapchat_url"
        />
        <FormGroupDisabledInput
          t-key="twitterUrl"
          t-module="iu.profile"
          :value="user.twitter_url"
        />
        <FormGroupDisabledInput
          t-key="instagramUrl"
          t-module="iu.profile"
          :value="user.instagram_url"
        />
        <FormGroupDisabledInput
          t-key="youtubeUrl"
          t-module="iu.profile"
          :value="user.youtube_url"
        />
        <FormGroupDisabledInput
          t-key="pinterestUrl"
          t-module="iu.profile"
          :value="user.pinterest_url"
        />
      </div> -->

      <div class="col-3 px-4 pt-3 pb-5">
        <FormGroupDisabledInput
          t-key="lastActive"
          t-module="iu.profile"
          :value="user.last_active"
        />
      </div>
    </div>
  </div>
</template>

<script>
import FormGroupDisabledInput from "@/components/Misc/Forms/FormGroupDisabledInput.vue";
import { OCCUPATION_LIST } from "@/dataObject/profile/profileData";

export default {
  name: "UserInfo",
  components: { FormGroupDisabledInput },

  props: {
    user: {
      type: Object,
      default: null,
    },
  },
  computed: {
    userOccupation: function () {
      return OCCUPATION_LIST.find((occupation) => {
        return occupation.value === this.user.occupation;
      });
    },
  },
};
</script>
