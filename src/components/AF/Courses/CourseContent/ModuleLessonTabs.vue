<template>
  <div
    class="d-flex justify-content-between border-bottom border-secondary mb-3"
  >
    <div class="d-flex">
      <!-- TODO: generic tab component ModuleLessonTab  -->
      <div>
        <span
          class="tab p-2 px-3 cursor-pointer"
          :class="[
            tab === 'overview' ? 'active-tab' : 'inactive-tab text-dark',
          ]"
          @click.prevent="!(tab === 'overview') && setTab('overview')"
          >OVERVIEW</span
        >
      </div>
      <div>
        <span
          v-if="entity === 'lecture'"
          class="tab p-2 px-3 cursor-pointer"
          :class="[tab === 'faqs' ? 'active-tab' : 'inactive-tab text-dark']"
          @click.prevent="!(tab === 'faqs') && setTab('faqs')"
          >FAQs</span
        >
      </div>
      <div>
        <span
          v-if="entity === 'lecture'"
          class="tab p-2 px-3 cursor-pointer"
          :class="[tab === 'ebooks' ? 'active-tab' : 'inactive-tab text-dark']"
          @click.prevent="!(tab === 'ebooks') && setTab('ebooks')"
          >E-NOTES</span
        >
      </div>
      <div>
        <span
          v-if="entity === 'lecture'"
          class="tab p-2 px-3 cursor-pointer"
          :class="[tab === 'quiz' ? 'active-tab' : 'inactive-tab text-dark']"
          @click.prevent="!(tab === 'quiz') && setTab('quiz')"
          >QUIZ</span
        >
      </div>
      <div>
        <span
          v-if="entity === 'module'"
          class="tab p-2 px-3 cursor-pointer"
          :class="[tab === 'exam' ? 'active-tab' : 'inactive-tab text-dark']"
          @click.prevent="!(tab === 'exam') && setTab('exam')"
          >EXAM</span
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModuleLessonTabs",
  props: {
    tab: {
      type: String,
      default: "overview",
    },
    entity: {
      type: String,
      default: "",
    },
  },
  methods: {
    setTab(item) {
      this.$emit("set-tab", item);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.tab {
  border-right: 1px solid #d4d4d4;
  min-width: 120px;
  display: block;
  text-align: center;
  font-size: 14px;
}
.active-tab {
  border-bottom: 3px solid #ffb011;
}
.inactive-tab {
  background-color: $lightgray;
}
.disabled-tab {
  color: #d4d4d4 !important;
  cursor: not-allowed !important;
  pointer-events: none;
}
.border-bottom {
  border-color: #d4d4d4 !important;
}
</style>
