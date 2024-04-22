<template>
  <div>
    <div class="row">
      <div class="col-12 col-md-6" :class="{ 'px-0': $isPhone }">
        <div :class="$isPhone ? 'px-0' : 'px-3'">
          <div :class="{ 'px-3 py-1 text-center': $isPhone }">
            <img
              :src="course.img ? course.img : getDefaultImage()"
              class="rounded-card img"
              :class="$isPhone ? 'w-75' : 'w-100'"
              @error="handleImageError"
            />
          </div>
          <div class="mt-md-3" :class="$isPhone ? 'px-0' : 'px-2'">
            <h5 class="mb-0" :class="$isPhone ? 'text-start' : 'text-center'">
              {{ course.name }} - {{ course.level_name }}
            </h5>
            <div
              :class="
                $isPhone ? 'text-start my-2' : 'mt-4 text-center text-md-start'
              "
            >
              <EbookSquareCheckbox
                :label="$t('iu.cart.selectAllModules')"
                :bold="true"
                :prop-checked="allSelected"
                @on-change="onSelectAll"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="col-12 col-md-6 py-3 py-md-0 ebook-list-outer rounded-card">
        <div class="ebook-list-inner scrollbar-blue position-relative">
          <div v-for="item in courseModules" :key="item.id">
            <EbookSquareCheckbox
              :label="`${item.name} ${
                item.disabled
                  ? '(' + $t('iu.cart.purchased') + ')'
                  : '(£' + getDecimalAmount(item.price) + ')'
              }`"
              :prop-checked="item.selected"
              :disabled="item.disabled"
              @on-change="(e) => onItemClick(item.id, e)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3">
      <div class="total-price text-center text-uppercase">
        {{ $t("iu.checkout.total") }}: £{{ totalPrice }}
      </div>
      <div class="text-center mt-3">
        <button
          class="btn green-btn text-white rounded-card text-uppercase mx-auto col-9 col-md-6"
          :disabled="!anySelected"
          @click="addToCart"
        >
          {{ $t("iu.course.addToCart") }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import EbookSquareCheckbox from "@/components/IU/Cart/Ebooks/EbookSquareCheckbox";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { getDecimalAmount } from "@/utils/generalUtils";

export default {
  components: {
    EbookSquareCheckbox,
  },
  mixins: [devicesMixin],
  props: {
    course: Object,
    courseModules: Array,
  },
  computed: {
    allSelected() {
      const selected = this.courseModules.filter((item) => item.selected);
      return selected.length == this.courseModules.length;
    },
    anySelected() {
      return !!this.courseModules.filter(
        (item) => item.selected && !item.disabled
      ).length;
    },
    totalPrice() {
      return this.courseModules
        .reduce((t, { price, selected, disabled }) => {
          if (!selected || disabled) return t + 0;

          return t + price;
        }, 0)
        .toFixed(2);
    },
  },
  methods: {
    onItemClick(id, value) {
      this.$emit("on-item-click", { id, value });
    },
    onSelectAll(value) {
      this.$emit("on-select-all", value);
    },
    addToCart() {
      this.$emit("on-add-to-cart");
    },
    getDecimalAmount(amount) {
      return getDecimalAmount(amount, 2);
    },
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.img {
  object-fit: cover;
  aspect-ratio: 1/1;
}
.total-price {
  font-size: 18px;
  color: $green;
}
.ebook-list-inner {
  max-height: 450px;
  overflow-y: auto;
}

@media (max-width: $tabletWidth) {
  .ebook-list-outer {
    background: $lightgray;
  }
  .ebook-list-inner {
    max-height: calc(100vh - 400px);
  }
}
</style>
