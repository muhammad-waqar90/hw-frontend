<template>
  <div>
    <span
      v-for="item in userNotesList"
      :key="item.value"
      class="item rounded-pill me-2 px-5 py-1 cursor-pointer"
      :class="{
        active: item.id === selectedLesson,
        inactive: item.id !== selectedLesson,
      }"
      @click="activate(item)"
    >
      {{ item.name }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    selectedLesson: null,
    userNotesList: {
      type: Object,
    },
  },
  methods: {
    activate(item) {
      if (item.id == this.selectedLesson.id) return;

      this.$emit("update-selected", item.id);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.active {
  background: $blue;
  color: $static-white;
}
.inactive {
  background: $white;
  color: $darkgray;
  border: 1px solid $blue;
}
</style>
