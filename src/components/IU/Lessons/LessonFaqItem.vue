<template>
  <div class="bg-gray p-3 mb-3 rounded-card">
    <div class="d-flex justify-content-between align-items-center">
      <span class="formatted-question" v-html="item.question" />
      <ChevronDownCircle
        v-if="!expanded"
        class="expand-icon cursor-pointer"
        :size="32"
        @click="expanded = true"
      />
      <ChevronDownCircleOutline
        v-if="expanded"
        class="expanded-icon cursor-pointer"
        :size="32"
        @click="expanded = false"
      />
    </div>

    <span v-if="expanded" v-html="item.answer" />
  </div>
</template>

<script>
import ChevronDownCircle from "vue-material-design-icons/ChevronDownCircle";
import ChevronDownCircleOutline from "vue-material-design-icons/ChevronDownCircleOutline";

export default {
  components: {
    ChevronDownCircle,
    ChevronDownCircleOutline,
  },
  props: {
    item: {
      type: Object,
    },
  },

  data() {
    return {
      expanded: false,
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.bg-gray {
  background-color: $lightgray;
}
.expand-icon {
  color: $blue;
}
.expanded-icon {
  color: $blue;
}

.formatted-question :deep(p:first-child) {
  margin-bottom: 0px;
}
</style>
