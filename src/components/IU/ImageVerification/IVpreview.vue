<template>
  <div class="cursor-pointer position-relative">
    <img :src="img ? img : getDefaultImage()" @error="handleImageError" />
    <ProgressBar
      v-if="uploadPercentage"
      class="position-absolute w-75 top-half"
      :progress="uploadPercentage"
    />
  </div>
</template>

<script>
import ProgressBar from "@/components/Misc/ProgressBar";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
export default {
  components: {
    ProgressBar,
  },

  props: {
    img: {
      type: String,
    },
    uploadPercentage: {
      type: Number,
      default: null,
    },
  },
  methods: {
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style lang="scss" scoped>
img {
  width: 100%;
}
.top-half {
  bottom: calc(50% - (22px / 2));
  left: calc(25% / 2);
}
</style>
