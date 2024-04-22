<template>
  <article class="rounded-card-bottom bg-light-gray pb-4 text-black">
    <div class="mx-3 course-list scrollbar-blue">
      <section class="col-12 p-4 pt-5 mb-3">
        <p v-html="courseDesc"></p>
      </section>
    </div>
  </article>
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import { mapGetters } from "vuex";

export default {
  name: "AboutContent",

  mixins: [toastMixin, devicesMixin],

  props: {
    courseDesc: {
      type: String,
    },
  },
  data() {
    return {};
  },

  computed: {
    ...mapGetters({
      colors: "theme/getColors",
    }),
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.course-list {
  overflow-y: auto;
  height: calc(100vh - 310px);
  background-color: $lightgray;
}
.course-list::-webkit-scrollbar-track {
  margin: 25px 0px 25px 0px;
  background: $white;
}
.bg-light-gray {
  background-color: $lightgray;
}
</style>
