<template>
  <div>
    <div class="row item color-gray" :class="selected && 'selected'">
      <div class="col-1 py-3 ps-4">
        <span class="py-3 pe-3 separator">
          <input
            type="checkbox"
            :class="cursor"
            :checked="selected"
            :disabled="disabled"
            :value="item.id"
            @change="onChangeModuleSelection(item)"
          />
        </span>
        <span class="cursor-pointer" @click="toggleExpanded">
          <template v-if="!expanded">
            <ChevronRightIcon :size="25" />
          </template>
          <template v-else>
            <ChevronDownIcon :size="25" />
          </template>
        </span>
      </div>
      <div class="col-11 py-3 pr-4 cursor-pointer" @click="onEditModule">
        <div class="row">
          <div class="col-1">
            {{ item.id }}
          </div>
          <div class="col-4">
            {{ item.name }}
          </div>
          <div class="col-2">
            {{ item.lessons.length }}
          </div>
          <div class="col-2">
            {{ dateFormat(item.created_at) }}
          </div>
          <div class="col-2">
            {{ dateFormat(item.updated_at) }}
          </div>
          <div class="col-1">
            <Pen :size="20" />
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col-12 sub-item">
        <div v-show="expanded">
          <hr style="margin-top: 0" />
          <div class="px-3">
            <CourseLesson
              :lessons="item.lessons"
              :module-id="item.id"
              :level-id="item.course_level_id"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import courseDetailsMixin from "@/mixins/AF/courseDetailsMixin";
import CourseLesson from "@/components/AF/Courses/CourseContent/CourseLesson/CourseLesson.vue";
import ChevronRightIcon from "vue-material-design-icons/ChevronRight";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";
import Pen from "vue-material-design-icons/Pen";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";

export default {
  name: "ModuleListItem",
  components: {
    ChevronRightIcon,
    ChevronDownIcon,
    Pen,
    CourseLesson,
  },
  mixins: [courseDetailsMixin],
  props: {
    item: { type: Object },
    selected: { type: Boolean },
    disabled: { type: Boolean },
  },
  data() {
    return {
      expanded: false,
    };
  },
  computed: {
    ...mapGetters({
      selectedEntityData: "course/getSelectedEntityData",
      hasEntityChanged: "course/getHasEntityChanged",
      currentEntity: "course/getEntityData",
    }),
    cursor() {
      return this.disabled ? "cursor-not-allowed" : "cursor-pointer";
    },
  },
  methods: {
    toggleExpanded() {
      this.expanded = !this.expanded;
    },
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
    onEditModule() {
      if (this.currentEntity.id === this.item.id) return;

      if (
        this.hasEntityChanged &&
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      )
        return;

      this.$store.dispatch("course/setHasEntityChanged", false);
      this.$store.dispatch("course/setMode", "edit");
      this.$store.dispatch("course/setEntity", "module");
      this.$store.dispatch("course/setEntityData", this.item);
    },
    onChangeModuleSelection(item) {
      let payload = this.onChangeEntitySelection(
        this.selectedEntityData,
        this.selected,
        item,
        "module"
      );
      this.$store.dispatch("course/setSelectedEntityData", payload);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item {
  background-color: $lightgray;
  color: $darkgray;
}
.item:hover {
  color: white;
  background-color: #479bf2;
  box-shadow: -4px 4px 4px -3px #94969d;
}
.sub-item {
  background-color: $lightgray;
  color: $darkgray;
}
.btn-border {
  border: 1px solid #1882ee;
}
.separator {
  border-right: 1px dotted #808080;
}
.selected {
  color: white;
  background-color: #479bf2;
}
</style>
