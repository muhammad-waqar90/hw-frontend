<template>
  <div
    class="d-flex justify-content-between justify-content-lg-start align-items-center text-uppercase overflow-auto scrollbar-blue"
  >
    <span v-for="level in levels" :key="level.id" class="mb-2 py-2 level">
      <span
        class="half-rounded-left cursor-pointer position-relative truncate font-weight-600 px-4 py-2"
        :class="[
          level.id === selectedLevel.id ? 'level-btn-orange' : 'level-btn-gray',
        ]"
        @click="activate(level)"
      >
        {{ level.name }}
      </span>
      <span
        class="half-rounded-right ps-1 pe-2 py-2 me-2"
        :class="[
          level.id === selectedLevel.id ? 'level-btn-orange' : 'level-btn-gray',
        ]"
      >
        <Pen
          :size="20"
          class="level-btn-icon cursor-pointer me-2 active-icon"
          @click="onEdit(level)"
        />
        <trash-can
          v-if="isAllowAddDelete"
          :size="20"
          class="level-btn-icon cursor-pointer active-icon"
          @click="onDelete(level)"
        />
        <trash-can
          v-else
          :title="courseText.disableCreateDelete"
          :size="20"
          class="level-btn-icon cursor-not-allowed disable-icon"
        />
      </span>
    </span>
    <span class="mb-2 py-2 font-weight-600 level">
      <span
        v-if="!isSubmitting && isAllowAddDelete"
        class="cursor-pointer half-rounded-right px-4 py-2 add-level-btn"
        @click="onCreate()"
      >
        ADD {{ courseText.level }}
      </span>
      <span
        v-if="isSubmitting && isAllowAddDelete"
        class="half-rounded-right px-4 py-2 add-level-btn disabled"
      >
        <span class="spinner-border spinner-border-sm" /> ADDING...
      </span>
      <span
        v-if="!isSubmitting && !isAllowAddDelete"
        :title="courseText.disableCreateDelete"
        class="cursor-not-allowed half-rounded-right px-4 py-2 add-level-btn disabled"
      >
        ADD {{ courseText.level }}
      </span>
    </span>
  </div>
</template>

<script>
import TrashCan from "vue-material-design-icons/TrashCan";
import Pen from "vue-material-design-icons/Pen";
import { mapGetters } from "vuex";
import { courseText } from "@/dataObject/AF/afStaticTextsData.js";

export default {
  name: "LevelList",
  components: {
    TrashCan,
    Pen,
  },
  props: {
    levels: null,
    isSubmitting: { type: Boolean, default: false },
    selectedLevel: { type: Object },
  },
  data() {
    return {
      mode: "",
      courseText,
    };
  },
  computed: {
    ...mapGetters({
      isAllowAddDelete: "course/getIsAllowAddDelete",
    }),
  },
  watch: {
    isSubmitting() {
      if (!this.isSubmitting && this.mode === "delete")
        this.$emit("set-level", (this.levels.length && this.levels?.[0]) || {});
    },
  },
  mounted() {
    this.$emit("set-level", (this.levels.length && this.levels?.[0]) || {});
  },
  methods: {
    activate(level) {
      if (this.selectedLevel.id === level.id) return;
      this.$emit("level-change", level);
    },
    onCreate() {
      this.mode = "create";
      this.$emit("on-create");
    },
    onDelete(level) {
      this.mode = "delete";
      this.$emit("on-delete", level);
    },
    onEdit(level) {
      this.$emit("on-edit", level);
    },
  },
};
</script>

<style lang="scss" scoped>
.half-rounded-left {
  border-top-left-radius: 15px;
  border-bottom-left-radius: 15px;
}
.half-rounded-right {
  border-top-right-radius: 15px;
  border-bottom-right-radius: 15px;
  border-left: 1px solid #e4e5e9 !important;
}
.level {
  min-width: 170px;
}
.level-btn-orange {
  color: #fff;
  background-color: #f2a000;
  border-color: #f2a000;
}
.level-btn-gray {
  color: #808080;
  background-color: #ccd0db;
  border-color: #ccd0db;
}
.level-btn-icon {
  &:hover {
    color: #fff;
    border-color: #dadde6;
  }
  &:focus {
    outline: 0;
    box-shadow: none;
  }
}
.add-level-btn {
  color: #fff;
  background-color: #1982ef;
  border-color: #1982ef;
  border-radius: 15px;
  &:hover {
    color: #fff;
    background-color: #2890ff;
    border-color: #2890ff;
  }
  &:focus {
    outline: 0;
    box-shadow: none;
  }
  &.disabled {
    opacity: 0.65;
  }
}
.active-icon {
  &:hover {
    svg {
      fill: inherit;
    }
  }
}
.disable-icon {
  svg {
    fill: #808080;
  }
}
</style>
