<template>
  <div v-if="event != null && !eventLoading">
    <img
      v-if="event.img"
      :src="event.img ? event.img : getDefaultImage()"
      class="event-img mb-3"
      @error="handleImageError"
    />
    <div
      :class="[
        { 'green-border': event.type == GLOBAL.value },
        { 'orange-border': event.type == NATIONAL.value },
      ]"
      class="p-2 mb-3"
    >
      <div>
        <div class="d-flex items-align-center mb-2 px-1">
          <div
            :class="[
              { 'green-accent': event.type == GLOBAL.value },
              { 'orange-accent': event.type == NATIONAL.value },
            ]"
          />
          <span class="font-weight-600 event-font">{{ event.title }}</span>
        </div>
      </div>
      <p
        class="injected-html event-font mb-1 ps-1"
        v-html="event.description"
      />
    </div>
    <div class="d-flex align-items-center">
      <svg-start-end-date-icon class="long-icon py-1 me-1" />
      <div class="d-flex long-icon flex-column justify-content-between">
        <span class="event-font"
          ><span class="font-weight-600">Starts at</span> {{ eventStartDay
          }}{{ getDayWithSufix(eventStartDay) }} {{ eventStartMonth }} |
          {{ eventStartTime }}</span
        >
        <span class="event-font"
          ><span class="font-weight-600">Ends at</span> {{ eventEndDay
          }}{{ getDayWithSufix(eventEndDay) }} {{ eventEndMonth }} |
          {{ eventEndTime }}</span
        >
      </div>
    </div>
    <div class="d-flex justify-content-center mt-4">
      <a
        :href="event.url"
        target="_blank"
        class="btn blue-btn rounded-card text-white position-relative font-weight-600 button-font px-4"
      >
        Visit Website
      </a>
    </div>
  </div>
  <SelectedEventLoading v-else-if="event == null && eventLoading" />
  <div v-else-if="event == null">No Event Selected</div>
</template>

<script>
import SelectedEventLoading from "@/components/IU/Calendar/SelectedEventLoading";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { GLOBAL, NATIONAL } from "@/dataObject/event/eventData";
import SvgStartEndDateIcon from "@/assets/svg/startEndDateIcon.svg";

export default {
  components: {
    SelectedEventLoading,
    SvgStartEndDateIcon,
  },
  props: {
    event: {
      type: Object,
      default: () => {},
    },
    eventLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      GLOBAL: GLOBAL,
      NATIONAL: NATIONAL,
    };
  },
  computed: {
    eventStartDay() {
      return new Date(this.event.start_date).getDate();
    },
    eventStartMonth() {
      return new Date(this.event.start_date).toLocaleString("default", {
        month: "long",
      });
    },
    eventStartTime() {
      let date = new Date(this.event.start_date);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },
    eventEndDay() {
      return new Date(this.event.end_date).getDate();
    },
    eventEndMonth() {
      return new Date(this.event.end_date).toLocaleString("default", {
        month: "long",
      });
    },
    eventEndTime() {
      let date = new Date(this.event.end_date);
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var strTime = hours + ":" + minutes + " " + ampm;
      return strTime;
    },
  },
  methods: {
    getDayWithSufix(d) {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    },
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.green-border {
  border: 1.5px solid $green;
  border-radius: 15px;
}
.orange-border {
  border: 1.5px solid $orange;
  border-radius: 15px;
}
.green-accent {
  display: inline-block;
  background-color: $green;
  width: 6px;
  height: 18px;
  border-radius: 2px;
  margin-right: 4px;
}
.orange-accent {
  display: inline-block;
  background-color: $orange;
  width: 6px;
  height: 18px;
  border-radius: 2px;
  margin-right: 4px;
}
.event-font {
  font-size: 12px;
}
.button-font {
  font-size: 10px;
}
.long-icon {
  height: 55px;
}
.event-img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 25px;
}
.injected-html :deep(p) {
  margin: 0;
}
</style>
