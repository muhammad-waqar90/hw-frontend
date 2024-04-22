import { mapGetters } from "vuex";

export default {
  computed: {
    ...mapGetters({
      $windowWidth: "devices/getWindowWidth",
      $isBigDesktop: "devices/getIsDesktopBig",
      $isDesktop: "devices/getIsDesktop",
      $isLaptop: "devices/getIsLaptop",
      $isTablet: "devices/getIsTablet",
      $isBigPhone: "devices/getIsBigPhone",
      $isSmallPhone: "devices/getIsSmallPhone",
      $isPhone: "devices/getIsPhone",
      $smallPhoneWidth: "devices/getSmallPhoneWidth",
      $isMobile: "devices/getIsMobile",
    }),
  },
};
