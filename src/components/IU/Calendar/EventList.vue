<template>
  <div v-if="currentEvents">
    <div
      v-for="(event, index) in currentEvents"
      v-show="
        (event.type == GLOBAL.value && showGlobal) ||
        (event.type == NATIONAL.value && showNational)
      "
      :key="index"
      :class="[
        { 'green-background': event.type == GLOBAL.value },
        { 'orange-background': event.type == NATIONAL.value },
        { active: event.id == selectedEvent?.id && isSelectedDay },
      ]"
      class="non-active rounded-card text-white text-center font-weight-600 cursor-pointer event-font mb-2 py-1 px-2"
      @click="$emit('select-event', event.id)"
    >
      {{ event.type == GLOBAL.value ? "Global Event" : "National Event" }}
    </div>
  </div>
</template>

<script>
import { GLOBAL, NATIONAL } from "@/dataObject/event/eventData";
import { isSameDay, isBefore, isAfter } from "date-fns";

export default {
  props: {
    day: {
      type: Number,
      default: null,
    },
    date: {
      type: Date,
      default: null,
    },
    events: {
      type: Array,
      default: null,
    },
    showNational: {
      type: Boolean,
    },
    showGlobal: {
      type: Boolean,
    },
    selectedEvent: {
      type: Object,
    },
    isSelectedDay: {
      type: Boolean,
    },
  },
  data() {
    return {
      currentEvents: [],
      GLOBAL: GLOBAL,
      NATIONAL: NATIONAL,
    };
  },
  watch: {
    day() {
      this.init();
    },
    events() {
      this.init();
    },
  },
  methods: {
    init() {
      if (this.day == null || this.events == null) return;
      this.currentEvents = [];
      const currentDate = new Date(this.date).setDate(this.day);
      this.events.forEach((event) => {
        let from = new Date(event.start_date);
        let to = new Date(event.end_date);

        if (
          (isSameDay(currentDate, from) || isAfter(currentDate, from)) &&
          (isSameDay(currentDate, to) || isBefore(currentDate, to))
        )
          this.currentEvents.push(event);
      });
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.orange-background {
  background-color: $orange;
}
.green-background {
  background-color: $green;
}
.event-font {
  font-size: 11px;
}
.non-active {
  border: 2px solid;
  white-space: nowrap;
}
.active {
  border: 2px solid $blue !important;
  white-space: nowrap;
}
</style>
