<template>
  <div
    class="position-absolute cursor-default z-index-popup popup-size bg-white rounded-card border-light position shadow p-3"
    :class="{ 'tab-popup-size': $isTablet }"
    @click.stop=""
  >
    <div class="d-flex justify-content-between">
      <h5 class="text-blue font-weight-700 mb-3">
        {{ $t("iu.course.ongoingLessons") }}
      </h5>
      <CloseCircleOutline
        :size="26"
        fill-color="#e8505b"
        class="cursor-pointer"
        @click.stop="$emit('close-modal')"
      />
    </div>

    <div
      v-if="!loadingOngoingLessons && ongoingLessons.length > 0"
      class="list-height scrollbar-blue overflow-auto pe-2"
    >
      <div
        v-for="lesson in ongoingLessons"
        :key="lesson.id"
        class="d-flex border rounded-card align-content-center mb-2 cursor-pointer"
        :class="$isPhone ? 'p-2' : 'p-3'"
      >
        <div class="v-line me-0 me-md-1" />
        <div
          class="d-flex flex-md-row justify-content-between w-95 ms-2"
          :class="$isPhone ? 'flex-row' : 'flex-column'"
        >
          <div :class="{ 'pe-1': $isPhone }">
            <h6 class="font-weight-700 mb-0 text-dark-gray">
              {{ lesson.lesson_name }}
            </h6>
            <p class="text-blue font-weight-600 font-12 mb-0">
              {{ lesson.module_name }} {{ lesson.level_name }}
            </p>
          </div>

          <button
            class="btn orange-btn rounded-half-card font-12"
            @click="
              $router.push({
                name: 'iu-lesson',
                params: { courseId: courseId, lessonId: lesson.id },
              })
            "
          >
            {{ $t("iu.course.resume") }}
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="!loadingOngoingLessons && ongoingLessons.length == 0"
      class="list-height scrollbar-blue overflow-auto pe-2"
    >
      <div class="d-flex rounded-card align-content-center">
        <div
          class="d-flex flex-column flex-md-row justify-content-between w-95 ms-1"
        >
          <h6 class="font-weight-700 mb-0 text-dark-gray">
            {{ $t("iu.course.noOngoingLessons") }}
          </h6>
        </div>
      </div>
    </div>

    <div
      v-if="loadingOngoingLessons"
      class="loading-height rounded-card animated-loading-background"
    />
  </div>
</template>

<script>
import CloseCircleOutline from "vue-material-design-icons/CloseCircleOutline";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "OngoingLessons",

  components: {
    CloseCircleOutline,
  },
  mixins: [devicesMixin],
  props: {
    courseId: { type: Number },
    ongoingLessons: { type: Array },
    loadingOngoingLessons: { type: Boolean },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.w-95 {
  width: 95%;
}
.popup-size {
  width: 400px;
}
.tab-popup-size {
  width: 350px;
}
.list-height {
  max-height: 100px !important;
}
.loading-height {
  height: 80px;
}
.position {
  bottom: 0px;
  left: 30px;
}
.v-line {
  flex: 1;
  width: 4px;
  background-color: $blue;
  border-radius: 20px;
}
.rounded-half-card {
  border-radius: 10px;
  white-space: nowrap;
  height: fit-content;
  align-self: center;
}
.font-12 {
  font-size: 12px;
}
.border-light {
  border: 1px solid $darkgray;
}
.z-index-popup {
  z-index: 9;
}

@media (max-width: $tabletWidth) {
  .popup-size {
    width: 95%;
    margin-left: 2.5%;
  }
  .list-height {
    max-height: 200px;
  }
  .position {
    top: unset;
    bottom: 0px;
    right: unset;
    left: 0px;
  }
}
</style>
