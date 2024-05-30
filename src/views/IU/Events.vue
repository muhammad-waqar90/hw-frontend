<template>
  <div class="container font-montserrat mt-3 px-0 px-sm-3">
    <div class="row">
      <div v-if="$isPhone" class="mb-3">
        <EventFilter
          :national-event-checkbox="nationalEventCheckbox"
          :global-event-checkbox="globalEventCheckbox"
          @onChangeFilter="changeFilter"
        />
      </div>
      <div
        class="main-container-width"
        :class="{ 'w-100': $isPhone, 'main-container-width-tablet': $isTablet }"
      >
        <div class="rounded-card bg-white py-4 px-lg-5 px-md-2">
          <div class="d-flex justify-content-center align-items-center">
            <div class="arrow-container cursor-pointer">
              <ChevronLeft
                class="color-white"
                :size="24"
                @click="setPreviousMonth()"
              />
            </div>
            <h3
              class="font-weight-600 text-dark-gray mb-0"
              :class="$isPhone ? 'mx-2 small-font' : 'mx-5 big-font'"
            >
              {{ getMonthName }} {{ year }}
            </h3>
            <div class="arrow-container cursor-pointer">
              <ChevronRight
                class="color-white"
                :size="24"
                @click="setNextMonth()"
              />
            </div>
          </div>
          <hr />
          <div
            class="calendar-container"
            :class="{ 'justify-content-center ': $isPhone }"
          >
            <div
              v-for="i in totalDays"
              v-show="eventsApi.loading"
              :key="'l' + i"
              class="calendar-item"
            >
              <CalendarItemLoading />
            </div>
            <div
              v-for="(calendarItem, index) in totalDays"
              v-show="!eventsApi.loading"
              :key="index"
              class="calendar-item text-dark-gray font-weight-600 py-2 px-2"
              :class="[
                {
                  'selected-day':
                    calendarItem == eventCardSelect ||
                    calendarItem == daySelected,
                },
              ]"
              @click.self="eventCardSelected(calendarItem)"
            >
              <div
                class="d-flex justify-content-between mb-3"
                @click.self="eventCardSelected(calendarItem)"
              >
                <div
                  class="text-dark-gray"
                  :class="{
                    'current-day':
                      calendarItem == new Date().getDate() &&
                      getMonthName ==
                        new Date().toLocaleString('default', {
                          month: 'long',
                        }) &&
                      year == new Date().getFullYear(),
                  }"
                >
                  <span>{{ calendarItem }}</span>
                </div>
                <span class="text-light-gray">{{
                  getWeekDay(calendarItem)
                }}</span>
              </div>
              <EventList
                :day="calendarItem"
                :date="date"
                :events="eventsApi.data"
                :show-national="nationalEventCheckbox"
                :show-global="globalEventCheckbox"
                :selected-event="selectedEventApi.data"
                :is-selected-day="calendarItem == daySelected"
                @select-event="selectEvent"
                @click.native="selectDay(calendarItem)"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="side-container-width d-flex flex-column"
        :class="{ 'w-100': $isPhone, 'side-container-width-tablet': $isTablet }"
      >
        <EventFilter
          v-if="!$isPhone"
          :national-event-checkbox="nationalEventCheckbox"
          :global-event-checkbox="globalEventCheckbox"
          @onChangeFilter="changeFilter"
        />

        <div
          class="rounded-card bg-white text-dark-gray flex-grow-1 px-4 py-4 mt-3"
        >
          <h5 class="font-weight-600 header-font ms-1">SELECTED EVENT</h5>
          <hr class="mb-3" />
          <SelectedEvent
            :event="selectedEventApi.data"
            :event-loading="selectedEventApi.loading"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EventList from "@/components/IU/Calendar/EventList";
import SelectedEvent from "@/components/IU/Calendar/SelectedEvent";
import EventFilter from "@/components/IU/Calendar/EventFilter";
import CalendarItemLoading from "@/components/IU/Calendar/CalendarItemLoading";
import { GLOBAL, NATIONAL } from "@/dataObject/event/eventData";

import { getEvents, getEvent } from "@/services/iuService";

import { getStringDateISO } from "@/utils/dateTimeUtils";

import ChevronLeft from "vue-material-design-icons/ChevronLeft";
import ChevronRight from "vue-material-design-icons/ChevronRight";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "Events",

  components: {
    EventList,
    SelectedEvent,
    CalendarItemLoading,
    ChevronLeft,
    ChevronRight,
    EventFilter,
  },

  mixins: [apiMixin, devicesMixin],

  data() {
    return {
      date: null,
      year: null,
      month: null,
      day: null,
      totalDays: null,

      eventsApi: getApiState(),
      selectedEventApi: getApiState(),

      nationalEventCheckbox: true,
      globalEventCheckbox: true,

      daySelected: null,
      eventCardSelect: null,

      GLOBAL: GLOBAL,
      NATIONAL: NATIONAL,
    };
  },
  computed: {
    getMonthName() {
      return this.date.toLocaleString("default", { month: "long" });
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init(date = new Date()) {
      this.date = date;
      this.year = this.date.getFullYear();
      this.month = this.date.getMonth();
      this.day = this.date.getDate();
      this.totalDays = new Date(this.year, this.month + 1, 0).getDate();
      this.getEvents();
    },
    async getEvents() {
      this.eventsApi.data = null;
      const from = this.getStringDateISO(new Date(this.year, this.month, 1));
      const to = this.getStringDateISO(
        new Date(this.year, this.month, this.totalDays)
      );

      await this.$fetchApiData(this.eventsApi, () => getEvents(from, to));
    },
    getWeekDay(day) {
      const dayName = new Date(this.year, this.month, day);
      return dayName.toLocaleDateString("default", { weekday: "short" });
    },
    async selectEvent(id) {
      if (id == this.selectedEventApi.data?.id) return;
      await this.$fetchApiData(this.selectedEventApi, () => getEvent(id));
    },
    changeFilter(type) {
      type == NATIONAL.value
        ? (this.nationalEventCheckbox = !this.nationalEventCheckbox)
        : (this.globalEventCheckbox = !this.globalEventCheckbox);

      if (
        type == NATIONAL.value &&
        this.selectedEventApi?.data?.type == NATIONAL.value
      )
        this.selectedEventApi.data = null;
      if (
        type == GLOBAL.value &&
        this.selectedEventApi?.data?.type == GLOBAL.value
      )
        this.selectedEventApi.data = null;
      if (this.selectedEventApi.data == null) this.daySelected = null;
    },
    setPreviousMonth() {
      this.daySelected = null;
      this.eventCardSelect = null;
      this.selectedEventApi.data = null;
      if (this.month == 0) return this.init(new Date(this.year - 1, 11, 1));
      return this.init(new Date(this.year, this.month - 1, 1));
    },
    setNextMonth() {
      this.daySelected = null;
      this.eventCardSelect = null;
      this.selectedEventApi.data = null;
      if (this.month == 11) return this.init(new Date(this.year + 1, 0, 1));
      return this.init(new Date(this.year, this.month + 1, 1));
    },
    selectDay(item) {
      this.daySelected = item;
      this.eventCardSelect = null;
    },
    eventCardSelected(item) {
      this.daySelected = null;
      this.selectedEventApi.data = null;
      this.eventCardSelect = item;
    },
    getStringDateISO,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.side-container-width {
  flex: 0 0 auto;
  width: 22%;
}
.main-container-width {
  flex: 0 0 auto;
  width: 78%;
}
.header-font {
  font-size: 14px;
}
.big-font {
  font-size: 24px;
}
.small-font {
  font-size: 18px;
}
.color-white {
  color: $static-white;
}
.arrow-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  background-color: $blue;
  border-radius: 100%;
}
.calendar-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, 120px);
  justify-content: space-between;
  grid-gap: 10px;
  font-size: 12px;
}
.calendar-item {
  min-height: 120px;
  width: 120px;
  border: 1.5px solid #ebedf2;
  border-radius: 10px;
}

.current-day {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $blue;
  color: $static-white;
  width: 18px;
  height: 18px;
  border-radius: 100%;
}
.selected-day {
  border-color: $blue;
  border-width: 2px;
}
.main-container-width-tablet {
  width: 60%;
}
.side-container-width-tablet {
  width: 40%;
}
</style>
