<template>
  <div>
    <p
      v-if="!$isMobile"
      class="course-desc pe-3 position-absolute text-dark-gray text-break h-100 scrollbar-blue overflow-auto font-weight-600"
      v-html="course.description"
    />
    <div v-else>
      <p
        v-if="course.description.length < 255"
        class="text-secondary text-break mb-0 mt-2"
        v-html="course.description"
      />
      <ReadMore
        v-else
        class-list="text-secondary mb-0 mt-2"
        :limit="255"
        :text="course.description"
        more-text="Read More"
        less-text="Read Less"
      />
    </div>
  </div>
</template>

<script>
import ReadMore from "@/components/Misc/ReadMore";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "DisplayCourseDescription",

  components: { ReadMore },

  mixins: [devicesMixin],

  props: {
    course: {
      type: Object,
      default: () => {},
    },
  },
};
</script>

<style scoped>
.course-desc {
  font-size: 14px;
}
</style>
