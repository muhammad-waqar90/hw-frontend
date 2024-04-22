<template>
  <section
    class="row flex-md-row card-bg enrolled-course rounded-card cursor-pointer m-0 me-4 py-3"
    @click.self="$router.push({ name: 'iu-course', params: { id: course.id } })"
  >
    <div
      class="col-12 col-md-4 d-flex flex-column justify-content-between align-items-center img-container-height"
      :class="$isPhone ? 'height-65' : 'h-100'"
    >
      <img
        :src="course.img ? course.img : getDefaultImage()"
        class="card-img-top"
        alt="Image Preview"
        @error="handleImageError"
        @click="$router.push({ name: 'iu-course', params: { id: course.id } })"
      />
      <div :class="btnCursorWrapper" class="w-100">
        <ButtonWithLoading
          :class="[btnColor]"
          class="w-100 btn position-relative rounded-pill text-uppercase disabled-opacity small-font font-weight-600 py-1"
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
    </div>
    <div
      class="col-12 col-md-8 pt-2 text-dark-gray d-flex flex-column justify-content-between"
      @click="$router.push({ name: 'iu-course', params: { id: course.id } })"
    >
      <div class="text-center text-capitalize text-md-start">
        <h5 class="font-weight-600 course-name">
          {{ course.name }}
        </h5>
        <p class="small-font course-description">
          {{ shortenDesc(course.description) }}
        </p>
      </div>
      <div>
        <ProgressBar
          :progress="course.progress"
          :big-bar="true"
          custom-text="OVERALL PROGRESS"
          :small-text="true"
        />
      </div>
    </div>
  </section>
</template>

<script>
import { getOngoingLessons } from "@/services/iuService";
import apiMixin, { getApiState } from "@/mixins/apiMixin";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";

import OngoingLessons from "@/components/IU/Lessons/OngoingLessons";

import ProgressBar from "@/components/Misc/ProgressBar";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { mapGetters } from "vuex";
import { getTextFromHtml, shortenCharacters } from "@/utils/stringUtils";

export default {
  name: "EnrolledCourseCard",

  components: {
    OngoingLessons,
    ProgressBar,
    ButtonWithLoading,
  },

  mixins: [devicesMixin, toastMixin, apiMixin],

  props: {
    course: {
      type: Object,
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
    }),
  },

  methods: {
    shortenDesc(desc) {
      return this.shortenCharacters(this.getTextFromHtml(desc), 100);
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
    shortenCharacters,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.course-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  height: 46px;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.card-bg {
  background-color: $lightgray;
}
.disable-button {
  pointer-events: none;
}
.loading-gif {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 16px !important;
  height: 16px;
}

.small-font {
  font-size: 12px;
}

.very-small-font {
  font-size: 10px;
}

.text-green {
  color: $green;
}
.course-description {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
}
.card-img-top {
  object-fit: cover;
  border-radius: 20px;
  height: calc(100% - 45px);
}

.img-container-height {
  height: 100%;
}
.height-65 {
  height: 65% !important;
}

.enrolled-course {
  height: 190px;
}

.disabled-opacity {
  opacity: 1;
}

@media (max-width: $tabletWidth) {
  .enrolled-course {
    height: 450px;
  }
  .card {
    width: 12rem;
    img {
      height: 150px;
    }
  }
}
</style>
