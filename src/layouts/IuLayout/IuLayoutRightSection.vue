<template>
  <div
    class="h-100 font-montserrat"
    :style="'width: 238px'"
    :class="{ 'w-100 mt-1': $isPhone || $isTablet }"
  >
    <div
      v-if="!$isPhone && !$isTablet"
      :style="{ 'padding-top': stickyHelper + 'px' }"
    />
    <div ref="sticky" class="position-sticky" :style="stickyStyle">
      <Observer
        :on-observed="onObserved"
        :custom-css="'bottom:unset;height:1px;top:-55px'"
      />
      <div :class="{ 'd-flex': $isTablet }">
        <div
          class="calendar-card"
          :class="{ 'calendar-card-tablet pe-3 col-6': $isTablet }"
        >
          <div
            class="top-calendar-title text-center pt-2 pb-1 font-weight-600 rounded-card-top align-content-center"
          >
            CALENDAR EVENTS
          </div>
          <Calendar
            :attributes="attrs"
            is-expanded
            class="pb-2 h-100 border-0"
          />
          <div
            class="bottom-calendar bg-white text-center rounded-card-bottom py-3 align-content-center"
          >
            <router-link
              :to="{ name: 'iu-events' }"
              class="btn blue-btn btn-font font-weight-600 rounded-pill px-4 py-1"
            >
              SEE FULL CALENDAR
            </router-link>
          </div>
        </div>
        <div :class="{ 'col-6 h-100 ps-3': $isTablet }">
          <BookAdvert
            :class="{
              'advert-container-tablet': $isTablet,
              'mt-3': !$isTablet,
            }"
          />
        </div>
      </div>
      <div :class="{ 'd-flex pt-3': $isTablet }">
        <Advert :ads="topAds" :class="{ 'col-6 pe-3': $isTablet }" />
        <Advert :ads="bottomAds" :class="{ 'col-6 ps-3': $isTablet }" />
      </div>
      <Observer
        :on-observed="onObserved"
        :custom-css="'bottom: -25px;height:1px;'"
      />
    </div>
  </div>
</template>

<script>
import Advert from "@/components/IU/IuLayoutRightSection/Advert";
import BookAdvert from "@/components/IU/IuLayoutRightSection/BookAdvert";
import Calendar from "v-calendar/lib/components/calendar.umd";
import Observer from "@/components/Misc/Observer";

import { getAdvertList } from "@/services/IU/iuAdvertService";
import { getEvents } from "@/services/iuService";

import apiMixin, { getApiState } from "@/mixins/apiMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import { mapGetters } from "vuex";

import { getStringDateISO } from "@/utils/dateTimeUtils";
import { GLOBAL, NATIONAL } from "@/dataObject/event/eventData";

export default {
  name: "IuLayoutRightSection",

  components: {
    Advert,
    BookAdvert,
    Calendar,
    Observer,
  },

  mixins: [apiMixin, devicesMixin, toastMixin],

  data() {
    return {
      eventsApi: getApiState(),
      stickyHelper: 0,
      stickyStyle: "",
      shouldUpdateHelper: true,
      attrs: [
        {
          highlight: {
            style: {
              borderRadius: "6px",
              // border: '1px solid #1982EF',
              backgroundColor: "#ccd6e0b3",
            },
            contentStyle: {
              fontWeight: "700",
            },
          },
          dates: new Date(),
        },
        {
          dot: {
            style: {
              backgroundColor: "#53af52",
              marginBottom: "3px",
            },
          },
          dates: [],
        },
        {
          dot: {
            style: {
              backgroundColor: "#f2a000",
              marginBottom: "3px",
            },
          },
          dates: [],
        },
      ],
      topAds: [],
      bottomAds: [],
      nationalEvents: [],
      globalEvents: [],
      GLOBAL: GLOBAL,
      NATIONAL: NATIONAL,
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
    this.getEvents();
    this.getAds();
    setTimeout(() => {
      this.updateStickyStyle();
    }, 100);
  },
  methods: {
    async getEvents() {
      this.date = new Date();
      this.year = this.date.getFullYear();
      this.month = this.date.getMonth();
      this.day = this.date.getDate();
      this.totalDays = new Date(this.year, this.month + 1, 0).getDate();

      this.eventsApi.data = null;
      const from = this.getStringDateISO(new Date(this.year, this.month, 1));
      const to = this.getStringDateISO(
        new Date(this.year, this.month, this.totalDays)
      );

      await this.$fetchApiData(this.eventsApi, () => getEvents(from, to));

      this.calculateEvents();
    },
    calculateEvents() {
      var natEvents = [];
      var gloEvents = [];
      this.eventsApi?.data?.forEach((event) => {
        if (event.type == GLOBAL.value) {
          let startDateFull = new Date(event.start_date);
          let endDateFull = new Date(event.end_date);
          let startDate = new Date(
            startDateFull.getFullYear(),
            startDateFull.getMonth(),
            startDateFull.getDate()
          );
          let endDate = new Date(
            endDateFull.getFullYear(),
            endDateFull.getMonth(),
            endDateFull.getDate()
          );

          for (
            startDate;
            startDate.getTime() <= endDate.getTime();
            new Date(startDate.setDate(startDate.getDate() + 1))
          ) {
            gloEvents.push(new Date(startDate));
          }
        }

        if (event.type == NATIONAL.value) {
          let startDateFull = new Date(event.start_date);
          let endDateFull = new Date(event.end_date);
          let startDate = new Date(
            startDateFull.getFullYear(),
            startDateFull.getMonth(),
            startDateFull.getDate()
          );
          let endDate = new Date(
            endDateFull.getFullYear(),
            endDateFull.getMonth(),
            endDateFull.getDate()
          );

          for (
            startDate;
            startDate.getTime() <= endDate.getTime();
            new Date(startDate.setDate(startDate.getDate() + 1))
          ) {
            natEvents.push(new Date(startDate));
          }
        }

        this.globalEvents = gloEvents;
        this.nationalEvents = natEvents;
      });
      this.attrs[1].dates = gloEvents;
      this.attrs[2].dates = natEvents;
    },
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

    getStringDateISO,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.top-calendar-title {
  background-color: $red;
  color: $static-white;
  letter-spacing: 2px;
  font-size: 13px;
}
.bottom-calendar {
  border-top: 1px solid #dedede;
}
.btn-font {
  font-size: 12px;
}
.advert-container-tablet {
  padding: 4px 75px 4px 75px !important;
}
.calendar-card-tablet {
  display: grid;
}
</style>
