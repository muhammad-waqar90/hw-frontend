<template>
  <div class="rounded-card bg-white text-dark-gray flex-grow-0 px-4 py-4">
    <h5 class="font-weight-600 ms-1 header-font">EVENTS</h5>
    <hr class="mb-4" />
    <div class="d-flex justify-content-between align-items-center mb-3">
      <span class="font-weight-600 side-font">NATIONAL EVENT</span>
      <div
        class="national-checkbox cursor-pointer p-1"
        @click="changeFilter(NATIONAL.value)"
      >
        <svg-check v-if="nationalEventCheckbox" class="icon" />
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <span class="font-weight-600 side-font">GLOBAL EVENT</span>
      <div
        class="global-checkbox cursor-pointer p-1"
        @click="changeFilter(GLOBAL.value)"
      >
        <svg-check v-if="globalEventCheckbox" class="icon" />
      </div>
    </div>
  </div>
</template>

<script>
import { GLOBAL, NATIONAL } from "@/dataObject/event/eventData";
import SvgCheck from "@/assets/svg/check.svg";

export default {
  name: "EventFilter",

  components: {
    SvgCheck,
  },
  props: {
    nationalEventCheckbox: {
      type: Boolean,
    },
    globalEventCheckbox: {
      type: Boolean,
    },
  },
  data() {
    return {
      GLOBAL: GLOBAL,
      NATIONAL: NATIONAL,
    };
  },
  methods: {
    changeFilter(type) {
      this.$emit("onChangeFilter", type);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.header-font {
  font-size: 14px;
}
.side-font {
  font-size: 12px;
}
.national-checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $orange;
  color: $static-white;
  width: 20px;
  height: 20px;
  border-radius: 5px;
}
.global-checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $green;
  color: $static-white;
  width: 20px;
  height: 20px;
  border-radius: 5px;
}

.icon {
  fill: $static-white;
  height: 10px;
  width: 10px;
}
</style>
