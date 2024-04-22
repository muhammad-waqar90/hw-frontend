<template>
  <div class="row mt-3 content-height overflow-y-auto scrollbar-blue">
    <div class="col-12">
      <div class="d-flex flex-column bg-white rounded-card text-gray">
        <div>
          <div class="select-disabled text-dark-gray px-1">
            <template v-if="items.length > 0">
              <div v-for="item in items" :key="item.id">
                <LessonFaqItem :item="item" />
              </div>
            </template>
            <template v-else>
              <span>{{ noFaqs }}</span>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import LessonFaqItem from "@/components/IU/Lessons/LessonFaqItem";

export default {
  name: "LessonFaq",

  components: { LessonFaqItem },

  props: {
    items: {
      type: Array,
      default: null,
    },
  },

  computed: {
    noFaqs() {
      return "No FAQs available";
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.select-disabled {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
p {
  font-family: "Montserrat", sans-serif;
}
.content-height {
  height: 206px;
}
</style>
