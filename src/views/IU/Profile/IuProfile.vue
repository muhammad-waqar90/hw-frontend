<template>
  <div
    class="container font-montserrat px-3"
    :class="$isPhone || $isTablet ? 'mt-1' : 'mt-3'"
  >
    <div class="row">
      <div
        v-if="$isPhone || $isTablet"
        :class="{ 'col p-4': $isPhone || $isTablet }"
      >
        <ProfileNavigation />
      </div>

      <div class="col-12 col-xl-9" :class="{ 'px-4': $isPhone || $isTablet }">
        <router-view />
      </div>

      <div :class="$isPhone || $isTablet ? 'col p-4' : 'w-20'">
        <IuLayoutRightSectionProfile />
      </div>
    </div>
  </div>
</template>

<script>
import IuLayoutRightSectionProfile from "@/layouts/IuLayout/IuLayoutRightSectionProfile";
import ProfileNavigation from "@/components/IU/IuLayoutRightSection/ProfileNavigationSection";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  mixins: [devicesMixin],
  components: {
    IuLayoutRightSectionProfile,
    ProfileNavigation,
  },
};
</script>

<style>
.w-20 {
  width: 20%;
}
</style>
