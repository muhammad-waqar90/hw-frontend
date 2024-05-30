<template>
  <div
    class="d-flex flex-column flex-grow-1 card-bg rounded-card p-3 pb-4"
    :class="isComingSoon ? 'cursor-arrow' : 'cursor-pointer'"
    @click.self="
      !isComingSoon &&
        $router.push({ name: 'iu-course', params: { id: course.id } })
    "
  >
    <div
      class="col-12 d-flex flex-column justify-content-between align-items-center"
      @click="
        !isComingSoon &&
          $router.push({ name: 'iu-course', params: { id: course.id } })
      "
    >
      <div class="img-wrapper">
        <img
          :src="course.img ? course.img : getDefaultImage()"
          class="card-img-top"
          alt="Image Preview"
          @error="handleImageError"
        />
        <div
          v-if="isComingSoon"
          class="mask d-flex justify-content-center flex-column text-center position-absolute overlay-img-top"
        >
          <h4>Coming Soon</h4>
        </div>
      </div>
    </div>

    <div
      class="col-12 text-dark-gray d-flex flex-grow-1 flex-column justify-content-between"
    >
      <div
        class="px-2 pt-3 text-start"
        @click="
          !isComingSoon &&
            $router.push({ name: 'iu-course', params: { id: course.id } })
        "
      >
        <h5
          class="font-weight-600 header-font text-capitalize text-md-start course-name"
        >
          {{ course.name }}
        </h5>
        <p class="small-font course-description">
          {{ shortenDesc(course.description) }}
        </p>
      </div>
      <div class="position-relative">
        <div v-if="type == 'default'" class="">
          <s
            class="text-muted px-2"
            v-if="
              course.is_discounted && discountPercentage && course.price !== 0
            "
            >£{{ course.price.toFixed(2) }}</s
          >
          <s class="text-muted px-2"></s>
          <div class="row mr-0">
            <span
              v-if="!course.is_discounted"
              class="col-6 font-weight-600 h5 text-primary pt-1 pe-1 word-break-normal"
              >£{{ course.price.toFixed(2) }}</span
            >
            <span v-else class="col-6 pe-1">
              <p
                class="font-weight-600 h5 text-primary pt-1 pe-1 word-break-normal"
              >
                £{{ calculateDiscount.toFixed(2) }}
              </p></span
            >
            <span
              class="col-6 w-50 small-height btn blue-btn position-relative rounded-pill text-uppercase small-font font-weight-600 px-1"
              @click.stop="addToCart"
              >{{ $t("iu.course.enrollNow") }}</span
            >
          </div>
        </div>
        <div
          v-else-if="isComingSoon"
          class="w-100 pe-none text-white btn coming-soon-btn position-relative rounded-pill text-uppercase small-font font-weight-600 mt-2 py-1"
        >
          {{ $t("iu.course.comingSoon") }}
        </div>
        <template v-else>
          <div :class="btnCursorWrapper" class="w-100">
            <ButtonWithLoading
              class="w-100 btn rounded-pill text-uppercase small-font font-weight-600 disabled-opacity mt-2 py-1"
              :class="btnColor"
              :loading="ongoingLessonsApi.loading"
              :disabled="progress == 100"
              :propagination="true"
              @action="handleOpenOngoingLessonsList"
            >
              <slot>
                {{ btnText }}
              </slot>
            </ButtonWithLoading>
          </div>
          <OngoingLessons
            v-if="showOngoingLessonsList"
            v-click-outside="handleCloseOngoingLessonsList"
            :ongoing-lessons="ongoingLessonsApi.data"
            :loading-ongoing-lessons="ongoingLessonsApi.loading"
            :course-id="course.id"
            @close-modal="handleCloseOngoingLessonsList"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import OngoingLessons from "@/components/IU/Lessons/OngoingLessons";

import { getOngoingLessons } from "@/services/iuService";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { calculateSalaryScaleDiscount } from "@/utils/courseUtils";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";

import { mapGetters } from "vuex";
import { getTextFromHtml, shortenText } from "@/utils/stringUtils";

export default {
  name: "CourseCard",

  components: {
    ButtonWithLoading,
    OngoingLessons,
  },

  mixins: [devicesMixin, toastMixin, apiMixin],

  props: {
    course: {
      type: Object,
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
    progress() {
      return this.course.progress == null ? 0 : this.course.progress;
    },
    calculateDiscount() {
      if (this.course.is_discounted) {
        return calculateSalaryScaleDiscount(
          this.course.price,
          this.discountPercentage
        );
      } else {
        return this.course.price;
      }
    },
    isComingSoon() {
      return this.type == "coming-soon" ? true : false;
    },
    progressColor() {
      return this.progress == 100 ? "#53AF52" : "#1982EF";
    },
    btnText() {
      if (this.progress == 0) return this.$t("iu.course.play");
      if (this.progress == 100) return this.$t("iu.course.complete");
      else return this.$t("iu.course.resume");
    },
    btnColor() {
      if (this.progress == 0) return "blue-btn";
      if (this.progress == 100) return "green-btn";
      else return "orange-btn";
    },
    btnCursorWrapper() {
      return this.progress == 100 ? "cursor-default" : "cursor-pointer";
    },
    ...mapGetters({
      colors: "theme/getColors",
      discountPercentage: "user/getDiscountPercentage",
    }),
  },

  methods: {
    shortenDesc(desc) {
      return this.shortenText(this.getTextFromHtml(desc), 100);
    },
    addToCart() {
      if (this.course.is_discounted) {
        const course = {
          ...this.course,
          salaryScaleDiscount: this.calculateDiscount,
        };
        this.$emit("add-to-cart", course);
      } else {
        this.$emit("add-to-cart", this.course);
      }
    },
    async handleOpenOngoingLessonsList() {
      await this.handleOngoingLessons();
      if (this.progress != 0 && this.progress != 100)
        this.showOngoingLessonsList = !this.showOngoingLessonsList;
    },
    handleCloseOngoingLessonsList() {
      this.showOngoingLessonsList = false;
    },
    async handleOngoingLessons() {
      await this.$fetchApiData(
        this.ongoingLessonsApi,
        () => getOngoingLessons(this.course.id, this.progress),
        []
      );

      if (this.progress == 0)
        return this.$router.push({
          name: "iu-course",
          params: { id: this.course.id },
        });
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
  width: 100%;
  height: 100%;
}

.course-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
}

.course-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  height: 45px;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}

.disabled-opacity {
  opacity: 1;
}
.coming-soon-btn {
  background-color: $static-bs-secondary;
}

.overlay-img-top {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: $static-black;
  opacity: 0.5;
  color: $static-white;
  border-radius: 20px;
}
.img-wrapper {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
}
.small-height {
  height: 32px;
}
.mr-0 {
  margin-right: 0;
}
</style>
