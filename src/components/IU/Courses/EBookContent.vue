<template>
  <article class="rounded-card-bottom bg-light-gray pb-4 text-black">
    <div class="mx-3 course-list scrollbar-blue">
      <section class="col-12 p-4 pt-5 mb-3">
        <p v-html="$t(`iu.course.ebookInstructions`)"></p>
      </section>
      <div class="text-center">
        <button
          v-if="courseOwned"
          class="col-4 btn blue-btn btn-font rounded-pill text-uppercase font-weight-600 mt-5 mb-2"
          :class="{ 'col-8': $isPhone }"
          @click="openEbookPrompt"
        >
          {{ $t("iu.course.ebookPurchase") }}
        </button>
      </div>
    </div>
    <portal to="out-of-app-content">
      <Modal
        v-if="showEbookPrompt"
        :hide-footer="true"
        :hide-header="true"
        :close-on-click-outside="false"
        @close-modal="closeEbookPrompt"
      >
        <template slot="body">
          <AddEbooksToCart
            :level-value="courseLevel.value"
            :course-id="courseId"
            :select-all="true"
            @on-added="handleAddToCart"
            @on-cancel="closeEbookPrompt"
          />
        </template>
      </Modal>
    </portal>
  </article>
</template>

<script>
import Modal from "@/components/Misc/Modal";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart";
import { CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "EBookContent",

  components: {
    Modal,
    AddEbooksToCart,
  },
  mixins: [devicesMixin],
  props: {
    eBookDesc: {
      type: String,
    },
    courseOwned: {
      type: Boolean,
      default: false,
    },
    courseId: {
      type: Number,
    },
    courseLevel: {
      type: Object,
    },
  },
  data() {
    return {
      showEbookPrompt: false,
    };
  },

  methods: {
    openEbookPrompt() {
      this.showEbookPrompt = true;
    },
    closeEbookPrompt() {
      this.showEbookPrompt = false;
    },
    async handleAddToCart(data) {
      for (const item of data) {
        const parsed = { ...item, type: CART_EBOOK };
        this.$store.dispatch("cart/addItem", parsed);
      }
      this.showEbookPrompt = false;
    },
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
