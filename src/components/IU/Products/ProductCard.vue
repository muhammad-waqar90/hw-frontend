<template>
  <div
    class="d-flex flex-column flex-grow-1 card-bg rounded-card cursor-pointer card-height p-3 pb-4"
    @click.self="$router.push({ name: 'iu-book', params: { id: book.id } })"
  >
    <div
      class="col-12 d-flex flex-column justify-content-between align-items-center img-container-height"
      @click="$router.push({ name: 'iu-book', params: { id: book.id } })"
    >
      <img
        :src="book.img ? book.img : getDefaultImage()"
        class="card-img-top"
        alt="Image Preview"
        @error="handleImageError"
      />
    </div>
    <div
      v-if="book"
      class="col-12 text-dark-gray d-flex flex-grow-1 flex-column justify-content-between"
    >
      <div
        class="px-2 pt-3"
        @click="$router.push({ name: 'iu-book', params: { id: book.id } })"
      >
        <h5
          class="font-weight-600 text-center header-font text-capitalize text-md-start book-name"
        >
          {{ book.name }}
        </h5>
        <p class="price">£{{ book.price?.toFixed(2) }}</p>
        <div class="">
          <template>
            <div
              v-if="type == 'default'"
              class="w-100 btn blue-btn rounded-pill text-uppercase small-font font-weight-600"
              @click.stop="addToCart"
            >
              Shop Now
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";

import { mapGetters } from "vuex";
import { getTextFromHtml, shortenText } from "@/utils/stringUtils";

export default {
  name: "ProductCard",

  mixins: [devicesMixin, toastMixin, apiMixin],

  props: {
    book: {
      required: true,
    },
    type: {
      type: String,
      default: "default",
    },
  },
  data() {
    return {
      showOngoingLessonsList: false,
      ongoingLessonsApi: getApiState(),
    };
  },

  computed: {
    ...mapGetters({
      colors: "theme/getColors",
    }),
  },
  methods: {
    shortenDesc(desc) {
      return this.shortenText(this.getTextFromHtml(desc), 100);
    },
    addToCart() {
      this.$emit("add-to-cart", this.book);
    },
    handleImageError,
    getDefaultImage,
    getTextFromHtml,
    shortenText,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.price {
  color: $blue;
  font-size: 24px;
  font-weight: bold;
}

.card-bg {
  background-color: $lightgray;
}

.small-font {
  font-size: 12px;
}

.header-font {
  font-size: 19px;
}

.very-small-font {
  font-size: 10px;
}

.card-img-top {
  object-fit: cover;
  border-radius: 20px;
  height: 100%;
}

.img-container-height {
  height: 55%;
}

.card-height {
  height: 350px;
}

.book-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.book-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  height: 46px;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.disabled-opacity {
  opacity: 1;
}
</style>
