<template>
  <section id="course-preview">
    <CourseHead
      :course="course"
      :is-preview="true"
      :mode="mode"
      @change-mode="changeMode"
    />

    <CourseLevels
      v-if="mode == 'content'"
      :course="course"
      :level-data="levelData"
      :course-levels="courseLevels"
      :is-preview="true"
      @level-change="onLevelChange"
    />

    <section>
      <ModuleList
        v-if="mode == 'content'"
        :is-preview="true"
        :modules="modules"
        :course-id="course.id"
        :loading-level="loadingLevel"
      />
      <AboutContent v-if="mode == 'about'" :course-desc="course.description" />
      <EBookContent v-if="mode == 'ebook'" />
      <!--       <div v-if="!$isPhone" class="col-sm-6 col-lg-4">
        <div class="rounded-card bg-white position-sticky top-90 p-3">
          <div
            v-if="course.video_preview"
            class="mb-2"
          >
            <LessonVideoPlayer
              class="rounded-card mb-3"
              :thumbnail="course.img"
              :src="course.video_preview"
              :rounded="fullRounded"
            />
          </div>
          <hr class="mt-0 mb-2">
          <div class="col-10 mx-auto">
            <button
              class="btn blue-btn rounded-pill w-100 text-uppercase font-weight-600 my-2"
              @click="onAddToCart"
            >
              {{ $t("iu.course.addToCart") }}
            </button>

            <button
              class="btn orange-btn rounded-pill w-100 text-uppercase font-weight-600 my-2"
            >
              {{ $t("iu.course.physicalBook") }}
            </button>
          </div>

          <div
            class="text-center text-uppercase font-weight-600 text-dark-gray pb-4 mt-4"
          >
            {{ $t("iu.course.ebookAvailableEnrolled") }}
          </div>
        </div>
      </div> -->
    </section>
    <portal to="out-of-app-content">
      <Modal
        v-if="showAddToCartModal"
        :hide-footer="true"
        :hide-header="true"
        :close-on-click-outside="false"
        @close-modal="handleAddToCart(course)"
      >
        <template slot="body">
          <AddEbooksToCart
            :level-value="1"
            :course-id="course.id"
            :select-all="true"
            @on-added="(e) => handleAddToCart(course, e)"
            @on-cancel="handleAddToCart(course)"
          />
        </template>
      </Modal>
    </portal>
  </section>
</template>

<script>
import CourseHead from "@/components/IU/Courses/CourseHead";
import CourseLevels from "@/components/IU/Courses/CourseLevels";
import ModuleList from "@/components/IU/Courses/ModuleList";
import AboutContent from "@/components/IU/Courses/AboutContent";
import EBookContent from "@/components/IU/Courses/EBookContent";

//import LessonVideoPlayer from "@/components/IU/Lessons/LessonVideoPlayer.vue";
import Modal from "@/components/Misc/Modal";
import AddEbooksToCart from "@/components/IU/Cart/Ebooks/AddEbooksToCart";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";

import { CART_COURSE, CART_EBOOK } from "@/dataObject/cart/cartItemTypeData";
import { FULL_ROUNDED as fullRounded } from "@/dataObject/video/videoRoundedData";

export default {
  name: "CoursePreview",
  components: {
    CourseHead,
    CourseLevels,
    ModuleList,
    AboutContent,
    EBookContent,
    //LessonVideoPlayer,
    Modal,
    AddEbooksToCart,
  },

  mixins: [devicesMixin, toastMixin],

  props: {
    course: {
      type: Object,
    },
    modules: {
      type: Array,
    },
    category: {
      type: Object,
    },
    parentCategoryTree: {
      type: Array,
    },
    levelData: {
      type: Object,
    },
    courseLevels: {
      type: Array,
    },
    loadingLevel: {
      type: Boolean,
    },
  },
  data() {
    return {
      fullRounded,
      showAddToCartModal: false,
      mode: "about",
    };
  },
  methods: {
    onLevelChange(value) {
      this.$emit("level-change", value);
    },
    onAddToCart() {
      if (!this.course.has_level_1_ebook)
        return this.handleAddToCart(this.course);

      this.showAddToCartModal = true;
    },
    handleAddToCart(course, ebooks = null) {
      this.showAddToCartModal = false;

      const data = { ...course, type: CART_COURSE };
      if (ebooks)
        data.items = ebooks.map((item) => {
          item.type = CART_EBOOK;
          return item;
        });

      this.$store.dispatch("cart/addItem", data);

      this.addToCartCourse = {};
    },
    changeMode(mode) {
      this.mode = mode;
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/sass/_variables.scss";

#course-preview {
  font-family: "Montserrat", sans-serif;

  .play-circle-outline-icon {
    position: absolute;
    z-index: 100;
    color: $static-white;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
  .top-90 {
    top: 90px;
  }
}
</style>
