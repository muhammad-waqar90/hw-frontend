<template>
  <div class="toggle-buttons d-flex border-bottom px-4 px-lg-0 w-100">
    <span
      class="small font-weight-600 mb-0 pt-2 pb-1 text-uppercase cursor-pointer"
      :class="isActive('overview')"
      @click="setMode('overview')"
    >
      {{ $t("iu.lesson.overview") }}
    </span>
    <span
      class="small font-weight-600 mb-0 pt-2 pb-1 text-uppercase ms-lg-5 cursor-pointer"
      :class="isActive('faq')"
      @click="setMode('faq')"
    >
      {{ $t("iu.lesson.faq") }}
    </span>
    <span
      v-if="$isMobile"
      class="small font-weight-600 mb-0 pt-2 pb-1 text-uppercase cursor-pointer"
      :class="isActive('notes')"
      @click="setMode('notes')"
    >
      {{ $t("iu.lesson.notepad") }}
    </span>
    <span class="notes-loading">
      <img v-if="notesSaving" class="align-top" src="/img/small-loading.gif"
    /></span>
  </div>
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "LessonBottomToggleButtons",

  mixins: [devicesMixin],

  props: {
    mode: {
      type: String,
      default: "overview",
    },
    notesSaving: {
      type: Boolean,
      default: false,
    },
  },

  methods: {
    isActive(mode) {
      if (this.mode === mode) {
        return "border-bottom border-primary text-blue";
      }
    },

    setMode(mode) {
      this.$emit("set-mode", mode);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.notes-loading {
  position: absolute;
  right: 15px;
  top: 65px;
}

.toggle-buttons {
  font-family: "Montserrat";
}

@media (max-width: $laptopWidth) {
  .toggle-buttons {
    justify-content: space-between;
  }
}
</style>
