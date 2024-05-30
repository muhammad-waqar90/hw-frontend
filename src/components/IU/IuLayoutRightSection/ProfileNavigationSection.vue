<template>
  <div class="h-100" :class="{ 'px-3': $isTablet }">
    <div
      class="bg-white rounded-card py-2"
      :class="{ 'row p-0 m-0': $isTablet }"
    >
      <router-link
        :to="{ name: 'iu-certificates-dashboard' }"
        :class="{
          selected: currentRoute == 'iu-certificates-dashboard',
          'col-6': $isTablet,
        }"
        class="d-block invisible-border text-decoration-none cursor-pointer py-1 my-1"
      >
        <span class="text-blue">
          <svg-achievement class="very-small-icon mx-3" />
          <span class="nav-font font-weight-600">{{
            $t("iu.profile.menu.certificates")
          }}</span>
        </span>
      </router-link>

      <router-link
        :to="{ name: 'iu-card-payment' }"
        :class="{
          selected: currentRoute == 'iu-card-payment',
          'col-6': $isTablet,
        }"
        class="d-block invisible-border text-decoration-none cursor-pointer py-1 my-1"
      >
        <span class="text-blue">
          <svg-credit-card class="very-small-icon mx-3" />
          <span class="nav-font font-weight-600">{{
            $t("iu.profile.menu.cards")
          }}</span>
        </span>
      </router-link>

      <router-link
        :to="{ name: 'iu-card-history' }"
        :class="{
          selected: currentRoute == 'iu-card-history',
          'col-6': $isTablet,
        }"
        class="d-block invisible-border text-decoration-none cursor-pointer py-1 my-1"
      >
        <span class="text-blue">
          <svg-payments-fill class="very-small-icon mx-3" />
          <span class="nav-font font-weight-600">{{
            $t("iu.profile.menu.purchases")
          }}</span>
        </span>
      </router-link>

      <router-link
        :to="{ name: 'iu-verification' }"
        :class="{
          selected: currentRoute == 'iu-verification',
          'col-6': $isTablet,
        }"
        class="d-block invisible-border text-decoration-none cursor-pointer py-1 my-1"
      >
        <span class="text-blue">
          <svg-document-scanner class="very-small-icon mx-3" />
          <span class="nav-font font-weight-600">{{
            $t("iu.profile.menu.verification")
          }}</span>
        </span>
      </router-link>

      <router-link
        :to="{ name: 'iu-salary-scale-dashboard' }"
        :class="{
          selected: currentRoute == 'iu-salary-scale-dashboard',
          'col-6': $isTablet,
        }"
        class="d-block invisible-border text-decoration-none cursor-pointer py-1 my-1"
      >
        <span class="text-blue">
          <svg-scale class="very-small-icon mx-3" />
          <span class="nav-font font-weight-600">{{
            $t("iu.profile.labels.salaryScale.title")
          }}</span>
        </span>
      </router-link>

      <router-link
        :to="{ name: 'iu-change-password' }"
        :class="{
          selected: currentRoute == 'iu-change-password',
          'col-6': $isTablet,
        }"
        class="d-block invisible-border text-decoration-none cursor-pointer py-1 my-1"
      >
        <span class="text-blue">
          <svg-setting class="very-small-icon mx-3" />
          <span class="nav-font font-weight-600">{{
            $t("iu.profile.labels.password.changePassword")
          }}</span>
        </span>
      </router-link>

      <router-link
        :to="{ name: 'iu-delete-account' }"
        :class="{
          selected: currentRoute == 'iu-delete-account',
          'col-6': $isTablet,
        }"
        class="d-block invisible-border text-decoration-none cursor-pointer py-1 my-1"
      >
        <span class="text-blue">
          <svg-delete class="very-small-icon mx-3" />
          <span class="nav-font font-weight-600">{{
            $t("iu.profile.menu.delete")
          }}</span>
        </span>
      </router-link>
    </div>
  </div>
</template>

<script>
import SvgAchievement from "@/assets/svg/achievement.svg";
import SvgCreditCard from "@/assets/svg/credit-card.svg";
import SvgPaymentsFill from "@/assets/svg/payments-fill.svg";
import SvgDocumentScanner from "@/assets/svg/document-scanner.svg";
import SvgDelete from "@/assets/svg/delete.svg";
import SvgSetting from "@/assets/svg/setting.svg";
import SvgScale from "@/assets/svg/scale.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "ProfileNavigationSection",
  mixins: [devicesMixin],
  components: {
    SvgAchievement,
    SvgCreditCard,
    SvgPaymentsFill,
    SvgDocumentScanner,
    SvgDelete,
    SvgSetting,
    SvgScale,
  },
  computed: {
    currentRoute() {
      return this.$route.name;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.nav-font {
  font-size: 14px;
}
.very-small-icon {
  height: 18px;
  width: 18px;
  fill: $blue;
}
.invisible-border {
  border-left: 5px solid transparent;
}
.invisible-border:hover {
  opacity: 0.8;
}
.selected {
  border-left: 5px solid $blue;
  background: rgb(221, 231, 255);
  background: linear-gradient(
    90deg,
    rgba(221, 231, 255, 1) 0%,
    rgba(221, 231, 255, 1) 50%,
    rgba(221, 231, 255, 0) 100%
  );
}
</style>
