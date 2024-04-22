<template>
  <div class="h-100 bg-white py-4 px-4 rounded-card">
    <div class="row px-2">
      <div class="col-12 text-end">
        <button
          v-if="isAllowAddDelete"
          type="button"
          class="mr-2 btn blue-btn rounded-card px-4 font-weight-600"
          @click="onCreateModule"
        >
          ADD MODULE
        </button>
        <ButtonWithTooltip
          v-else
          :disabled="true"
          label="ADD MODULE"
          :message="courseText.disableCreateDelete"
          btn-class="mr-2 btn blue-btn rounded-card px-4 font-weight-600"
        />
      </div>
    </div>
    <div class="py-4">
      <ModuleList v-if="modules.length" :list="modules" :level-id="levelId" />
      <NoRecordFound v-else message="No module found" />
    </div>
  </div>
</template>

<script>
import ModuleList from "@/components/AF/Courses/CourseContent/CourseModule/ModuleList.vue";
import NoRecordFound from "@/components/Misc/Admin/NoRecordFound.vue";
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";
import { mapGetters } from "vuex";
import { courseText } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  name: "CourseModule",

  components: {
    ModuleList,
    NoRecordFound,
    ButtonWithTooltip,
  },
  props: {
    levelId: { type: Number },
    modules: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      courseText,
    };
  },
  computed: {
    ...mapGetters({
      isAllowAddDelete: "course/getIsAllowAddDelete",
    }),
  },
  methods: {
    onCreateModule() {
      this.$store.dispatch("course/setMode", "create");
      this.$store.dispatch("course/setEntity", "module");
      this.$store.dispatch("course/setHooks", {
        order: this.modules.length + 1,
      });
    },
  },
};
</script>
