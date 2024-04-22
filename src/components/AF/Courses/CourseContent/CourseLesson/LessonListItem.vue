<template>
  <div
    class="row rounded-card shadow-sm item bg-white color-gray"
    :class="selected && 'selected'"
  >
    <div class="col-1 py-3 ps-4">
      <span class="py-3 pe-4 separator">
        <input
          type="checkbox"
          :class="cursor"
          :checked="selected"
          :disabled="disabled"
          :value="item.id"
          @change="onChangeLessonSelection(item)"
        />
      </span>
    </div>
    <div class="col-11 py-3 cursor-pointer" @click="onEditLesson">
      <div class="row">
        <div class="col-1">
          {{ item.id }}
        </div>
        <div class="col-2">
          {{ item.name }}
        </div>
        <div class="col-2">
          {{ item.video }}
        </div>
        <div class="col-2">
          <span class="badge" :class="statusColor">
            {{ status }}
          </span>
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
</template>

<script>
import Pen from "vue-material-design-icons/Pen";
import { mapGetters } from "vuex";
import courseDetailsMixin from "@/mixins/AF/courseDetailsMixin";
import {
  UTCtoLocalDateFormatted,
  UTCtoLocalDateOnlyFormatted,
} from "@/utils/dateTimeUtils";

export default {
  name: "LessonListItem",
  components: {
    Pen,
  },
  mixins: [courseDetailsMixin],
  props: {
    item: { type: Object },
    selected: { type: Boolean },
    disabled: { type: Boolean },
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
    statusColor() {
      return this.item.published ? "bg-success" : "bg-warning";
    },
    status() {
      return this.item.published
        ? "PUBLISHED"
        : "PUBLISH AT: " + this.dateOnlyFormatted(this.item.publish_at);
    },
  },
  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
    dateOnlyFormatted(date) {
      return UTCtoLocalDateOnlyFormatted(new Date(date));
    },
    onEditLesson() {
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
      this.$store.dispatch("course/setEntity", "lecture");
      this.$store.dispatch("course/setEntityData", this.item);
    },
    onChangeLessonSelection(item) {
      let payload = this.onChangeEntitySelection(
        this.selectedEntityData,
        this.selected,
        item,
        "lecture"
      );
      this.$store.dispatch("course/setSelectedEntityData", payload);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.item {
  min-height: 60px;
  color: $darkgray;
}
.item:hover {
  color: white !important;
  background-color: #479bf2 !important;
  box-shadow: -4px 4px 4px -3px #94969d;
}
.separator {
  border-right: 1px dotted #808080;
}
.selected {
  color: white;
  background-color: #479bf2 !important;
}
</style>
