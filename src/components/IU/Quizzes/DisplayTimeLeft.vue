<template>
  <div
    class="time-font font-montserrat font-weight-600 btn timeProgress rounded-pill w-100 text-white d-flex justify-content-center align-items-center"
    :class="{ 'mob-time-font': $isPhone }"
    :style="timerStyle"
  >
    <clock class="me-2 clockIcon" :size="34" />
    <span>TIME REMAINING</span>
    <span class="ms-5">
      {{ displayTimeLeft }}
    </span>
  </div>
</template>

<script>
import Clock from "vue-material-design-icons/ClockTimeThreeOutline";

import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "DisplayTimeLeft",
  components: { Clock },
  mixins: [devicesMixin],
  props: {
    displayTimeLeft: {
      type: String,
    },
    timerStyle: {
      type: String,
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/_variables.scss";

.timeProgress {
  background: $blue;
  transition: all 0.3s ease;
}

.clockIcon {
  margin-top: -5px;
}

.time-font {
  font-size: 24px;
}
.mob-time-font {
  font-size: 15px;
}
</style>
