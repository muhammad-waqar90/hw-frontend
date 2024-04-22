<template>
  <div class="h-100">
    <div :style="{ 'padding-top': stickyHelper + 'px' }" />
    <div ref="sticky" class="position-sticky" :style="stickyStyle">
      <Observer
        :on-observed="onObserved"
        :custom-css="'bottom:unset;height:1px;top:-55px'"
      />
      <div>
        <ProfileNavigation />
      </div>
      <div>
        <BookAdvert class="mt-3" />
      </div>
      <div>
        <Advert :ads="topAds" />
        <Advert :ads="bottomAds" />
      </div>
      <Observer
        :on-observed="onObserved"
        :custom-css="'bottom: -25px;height:1px;'"
      />
    </div>
  </div>
</template>

<script>
import ProfileNavigation from "@/components/IU/IuLayoutRightSection/ProfileNavigationSection";
import Advert from "@/components/IU/IuLayoutRightSection/Advert";
import BookAdvert from "@/components/IU/IuLayoutRightSection/BookAdvert";
import Observer from "@/components/Misc/Observer";

import { getAdvertList } from "@/services/IU/iuAdvertService";
import toastMixin from "@/mixins/toastMixin";
import { mapGetters } from "vuex";

export default {
  name: "IuLayoutRightSection",

  components: {
    ProfileNavigation,
    Advert,
    BookAdvert,
    Observer,
  },

  mixins: [toastMixin],

  data() {
    return {
      stickyHelper: 0,
      stickyStyle: "",
      shouldUpdateHelper: true,
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
      topAds: [],
      bottomAds: [],
    };
  },
  computed: {
    ...mapGetters({
      windowScroll: "ui/getWindowScroll",
      scrollDirection: "ui/getScrollDirection",
    }),
  },
  watch: {
    scrollDirection(newVal, oldVal) {
      if (oldVal == newVal) return;
      this.updateStickyHelper();
      this.updateStickyStyle();
    },
  },
  mounted() {
    this.getAds();

    setTimeout(() => {
      this.updateStickyStyle();
    }, 100);
  },
  methods: {
    updateStickyStyle() {
      if (!this.$refs.sticky) return;

      const value = window.innerHeight - this.$refs.sticky.offsetHeight;
      if (value > 65) this.stickyStyle = "top: 55px";
      else if (this.scrollDirection == "up")
        this.stickyStyle = `bottom: ` + (value - 55) + "px";
      else if (this.scrollDirection == "down")
        this.stickyStyle = "top: " + (value - 25) + "px";
    },
    updateStickyHelper() {
      if (!this.shouldUpdateHelper) return;
      let value;
      if (window.innerHeight - this.$refs.sticky.offsetHeight > 65) value = 0;
      else if (this.scrollDirection == "down")
        value = this.windowScroll - 20 > 0 ? this.windowScroll - 20 : 0;
      else if (this.scrollDirection == "up") {
        value =
          this.windowScroll -
            95 +
            (window.innerHeight - this.$refs.sticky.offsetHeight) >
          0
            ? this.windowScroll -
              95 +
              (window.innerHeight - this.$refs.sticky.offsetHeight)
            : 0;
      }
      if (
        value + 130 <
        document.body.scrollHeight - this.$refs.sticky.offsetHeight
      )
        this.stickyHelper = value;
      else
        this.stickyHelper =
          document.body.scrollHeight - this.$refs.sticky.offsetHeight - 130;
      this.shouldUpdateHelper = false;
    },
    onObserved() {
      this.shouldUpdateHelper = true;
    },

    //adverts
    async getAds() {
      const response = await getAdvertList();

      if (response.error) return this.$displayError(response);

      this.topAds = response.filter((ad, index) => index % 2 == 0);
      this.bottomAds = response.filter((ad, index) => index % 2 != 0);
    },
  },
};
</script>
