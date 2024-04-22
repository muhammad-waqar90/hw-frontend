<template>
  <div class="d-flex flex-column px-4 px-lg-0 py-2">
    <div class="mb-1 text-center text-md-start mt-3">
      <span class="h5 fw-bold">{{ lesson.name }}</span>
    </div>
    <div
      class="text-secondary d-flex justify-content-center justify-content-md-start"
    >
      <bread-crumbs :crumbs="hierarchyTree" />
    </div>
    <div
      v-if="$isMobile"
      class="overflow-hidden mt-3 lesson-description text-center text-md-start"
    >
      <div class="h5">
        {{ $t("iu.lesson.description") }}
      </div>
      <div class="scrollbar-blue overflow-auto text-start">
        {{ lesson.description }}
      </div>
    </div>
  </div>
</template>

<script>
import BreadCrumbs from "@/components/Misc/BreadCrumbs";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "LessonOverview",

  components: {
    BreadCrumbs,
  },

  mixins: [devicesMixin],

  props: {
    lesson: {
      type: Object,
      default: () => {},
    },

    hierarchyTree: {
      type: Array,
      default: () => {},
    },
  },
};
</script>
