<template>
  <div class="col-12 pt-2 px-1 m-0">
    <p v-if="!$isMobile" class="text-dark-gray mb-0" v-html="desc" />
    <div v-else>
      <p v-if="desc.length < 255" class="text-dark-gray mb-0" v-html="desc" />
      <ReadMore
        v-else
        class-list="text-dark-gray mb-0"
        :limit="255"
        :text="desc"
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
  name: "DisplayModuleDescription",

  components: { ReadMore },

  mixins: [devicesMixin],

  props: {
    desc: {
      type: String,
      default: "",
    },
  },
};
</script>
