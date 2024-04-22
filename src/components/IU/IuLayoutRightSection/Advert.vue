<template>
  <div>
    <Carousel
      v-if="ads.length"
      :items="1"
      :loop="true"
      :autoplay="ads.length > 1"
      :nav="false"
      :mouse-drag="false"
      :autoplay-timeout="autoplayTimeout"
    >
      <a v-for="ad in ads" :key="ad.id" :href="ad.url" target="_blank">
        <img
          class="advert-img rounded-card mt-3"
          :src="ad.img ? ad.img : getDefaultImage()"
          @error="handleImageError"
        />
      </a>
    </Carousel>
  </div>
</template>

<script>
import Carousel from "vue-owl-carousel";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
export default {
  name: "Advert",

  components: {
    Carousel,
  },

  props: {
    ads: {
      type: Array,
      default: () => [],
    },
    autoplayTimeout: {
      type: Number,
      default: 3000,
    },
  },
  methods: {
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style lang="scss" scoped>
.advert-img {
  object-fit: cover;
  height: 200px;
}
</style>
