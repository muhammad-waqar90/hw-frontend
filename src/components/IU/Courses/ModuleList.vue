<template>
  <article class="rounded-card-bottom bg-light-gray pe-2 pb-3">
    <LoadingModuleList v-if="loadingLevel" />

    <div
      v-if="!loadingLevel"
      class="module-list-height overflow-y-auto scrollbar-blue px-4 pb-3"
    >
      <section
        v-for="module in altModules"
        :key="module.id"
        class="col-12 bg-white p-4 rounded-card mb-3"
      >
        <div class="row align-items-center">
          <div class="col">
            <h4 class="font-weight-700 color-gray mb-0">
              <span class="me-2 text-capitalize">{{ module.name }}</span>
              <!-- <span class="text-blue"> M{{ module.order_id }}</span> -->
            </h4>
          </div>
          <div class="col-auto d-flex justify-content-end">
            <div
              v-if="module.hasNotes && !$isPhone && !isPreview"
              class="d-flex me-2 align-items-center notes-icon-blue cursor-pointer"
              @click="onOpenModuleNotes(module.id)"
            >
              <component
                :is="module.notesOpened ? 'NoteTextOutline' : 'NoteText'"
              />
            </div>

            <!-- <AttemptQuizButtons
              v-if="module.has_quiz && !$isPhone && module.progress != 100"
              :progress="module.progress"
              :entity-id="module.id"
              :start-exam-text="module.failed_quiz == true ? $t('iu.lesson.retakeTest') : $t('iu.lesson.takeTest')"
              :color="'green'"
              class="btn-text px-3 ms-1"
              @on-start-quiz="attemptQuiz"
            /> -->

            <div v-if="module.expanded" @click="onModuleExpand(module.id)">
              <ChevronUpCircleOutline
                class="svg-arrow-icons-blue cursor-pointer"
              />
            </div>

            <div v-else @click="onModuleExpand(module.id)">
              <ChevronDownCircle class="svg-arrow-icons-blue cursor-pointer" />
            </div>

            <!-- <button
              :class="[module.expanded ? 'gray-btn' : 'blue-btn']"
              class="btn btn-text rounded-pill cursor-pointer font-weight-600 ps-2 pe-2 ps-md-3 ps-lg-3 pe-lg-1 ps-xl-4 pe-xl-3 py-0 ms-2"
              @click="onModuleExpand(module.id)"
            >
              <span v-if="!$isPhone" class="text-uppercase">{{ $t("iu.course.lessons") }}</span>
              <ChevronUpIcon v-if="module.expanded" />
              <ChevronDownIcon v-else />
            </button> -->
          </div>
        </div>
        <!-- <div v-if="$isPhone" class="d-flex justify-content-center my-3">
          <AttemptQuizButtons
            v-if="module.has_quiz && !isPreview && module.progress != 100"
            :progress="module.progress"
            :entity-id="module.id"
            :start-exam-text="module.failed_quiz == true ? $t('iu.lesson.retakeTest') : $t('iu.lesson.takeTest')"
            :color="'green'"
            @on-start-quiz="attemptQuiz"
          />
        </div> -->

        <div>
          <div v-if="!isPreview" class="row align-items-end g-0">
            <div class="col">
              <ProgressBar
                class="mt-3"
                :progress="module.progress"
                :big-bar="true"
                :custom-text="$t('iu.course.progressBarText')"
              />
            </div>

            <div class="col-auto ps-2">
              <AttemptQuizButtons
                v-if="module.has_quiz && module.progress != 100"
                :progress="module.progress"
                :entity-id="module.id"
                :start-exam-text="$t('iu.lesson.moduleExam')"
                :color="
                  module.failed_quiz == true
                    ? 'red'
                    : module.progress < 80
                    ? 'light-gray'
                    : module.progress == 100
                    ? 'green'
                    : 'blue'
                "
                class="btn-text px-3 ms-1"
                @on-start-quiz="attemptQuiz"
              />
            </div>
            <button
              v-if="module.progress == 100 && module.has_quiz"
              class="col-auto btn text-center text-uppercase truncate font-weight-600 rounded-pill green-btn btn-text px-3 ms-1 opacity-100"
              disabled
            >
              {{ $t("iu.lesson.passed") }}
            </button>
          </div>
          <!-- <div class="row d-flex flex-column flex-md-row p-4">
            <div class="col-12 col-md-4 p-0 my-2 my-md-0">
              <img
                class="rounded-card object-fit-cover w-100"
                :src="module.img ? module.img : getDefaultImage()"
                @error="handleImageError"
              >
            </div>

            <div :class="[isPreview === true ? 'col-md-8' : 'col-md-4 col-lg-5']" class="module-desc overflow-auto scrollbar-blue col-12 my-2 my-md-0">
              <DisplayModuleDescription :desc="module.description" />
            </div>
            <div v-if="!isPreview" class="col-12 col-md-4 col-lg-3 d-flex flex-column justify-content-between my-2 px-0 my-md-0 text-dark-gray">
              <RadialProgressBar
                class="mx-auto"
                :diameter="$isMobile ? 160 : 170"
                :completed-steps="module.progress"
                :total-steps="100"
                :inner-stroke-color="colors.lightGray"
                :start-color="getProgressColor(module.progress)"
                :stop-color="getProgressColor(module.progress)"
                :is-clockwise="false"
                :stroke-width="$isMobile ? 16 : 20"
                :inner-stroke-width="$isMobile ? 16 : 20"
              >
                <span class="m-0 h3 font-weight-600">
                  {{ module.progress }}<span :class="module.progress == 100 ? 'text-green' : 'text-blue'">%</span>
                </span>
                <small class="font-weight-700 small-font text-uppercase">
                  {{ $t("iu.course.completed") }}
                </small>
              </RadialProgressBar>
              <button
                v-if="module.lastLesson.length > 0"
                class="btn rounded-pill text-uppercase font-weight-600 mx-auto px-4 py-1"
                :class="module.progress == 100 ? 'green-btn' : 'orange-btn'"
                @click="resumeLesson(module.lastLesson[0].id)"
              >
                {{ getModuleButtonText(module.progress) }}
              </button>
            </div>
          </div> -->

          <div
            v-if="!$isPhone && module.notesOpened && module.hasNotes"
            class="col-12 mt-4"
          >
            <ModuleNotes
              v-if="module.notesOpened && module.hasNotes"
              :course-module="module"
              :user-notes-list="module.userNotesList"
            />
          </div>
          <div v-if="module.expanded">
            <hr class="mb-4" />
            <LessonList
              v-if="module.lessons.length && !isPreview"
              :lessons="module.lessons"
              :module-id="module.id"
              :is-preview="isPreview"
            />
            <p v-if="isPreview" class="text-dark-gray">
              {{ module.description }}
            </p>
          </div>
        </div>
      </section>
    </div>
  </article>
</template>

<script>
import ModuleNotes from "./ModuleNotes";
import LessonList from "@/components/IU/Lessons/LessonList";
import AttemptQuizButtons from "@/components/IU/Quizzes/AttemptQuizButtons";
//import DisplayModuleDescription from '@/components/IU/Courses/DisplayModuleDescription'
import LoadingModuleList from "@/components/IU/Courses/LoadingModuleList";
import ProgressBar from "@/components/Misc/ProgressBar";
//import RadialProgressBar from "vue-radial-progress"

import devicesMixin from "@/mixins/Misc/devicesMixin";
import toastMixin from "@/mixins/toastMixin";
import { handleImageError, getDefaultImage } from "@/utils/imageUtils";
import { mapGetters } from "vuex";
import ChevronUpCircleOutline from "vue-material-design-icons/ChevronUpCircleOutline";
import ChevronDownCircle from "vue-material-design-icons/ChevronDownCircle";
import NoteText from "vue-material-design-icons/NoteText";
import NoteTextOutline from "vue-material-design-icons/NoteTextOutline";

export default {
  name: "ModuleList",

  components: {
    ModuleNotes,
    LessonList,
    AttemptQuizButtons,
    //DisplayModuleDescription,
    LoadingModuleList,
    ProgressBar,
    //RadialProgressBar,
    ChevronUpCircleOutline,
    ChevronDownCircle,
    NoteTextOutline,
    NoteText,
  },

  mixins: [toastMixin, devicesMixin],

  props: {
    isPreview: {
      type: Boolean,
      default: true,
    },
    showCatBar: {
      type: Boolean,
      default: true,
    },
    modules: {
      type: Array,
      default: () => [],
    },
    courseId: {
      type: Number,
    },
    loadingLevel: {
      type: Boolean,
    },
  },
  data() {
    return {
      altModules: null,
    };
  },

  computed: {
    ...mapGetters({
      colors: "theme/getColors",
    }),
  },

  watch: {
    modules: function () {
      this.init();
    },
  },

  mounted() {
    this.init();
  },

  methods: {
    init() {
      this.altModules = this.modules.map((item) => {
        const altModule = this.findInAltModules(item);
        item.expanded = altModule ? altModule.expanded : false;
        item.notesOpened = altModule ? altModule.notesOpened : false;
        item.userNotesList = this.mapModuleNotes(item);
        item.hasNotes = Object.keys(item.userNotesList).length !== 0;
        item.lastLesson = item.lessons
          .filter((element) => {
            return element.available == true;
          })
          .sort((a, b) => b.order_id - a.order_id);
        return item;
      });

      if (this.altModules.length) this.openUnfinishedModule();
    },

    openUnfinishedModule() {
      const hasAlreadyOpened = this.altModules.find((item) => item.expanded);
      if (hasAlreadyOpened) return;

      const unfinishedModule = this.altModules.find(
        (item) => item.progress > 0 && item.progress < 100
      );
      if (unfinishedModule)
        return this.altModules.map((item) => {
          if (item.id === unfinishedModule.id) item.expanded = true;
        });
      this.altModules[0].expanded = true;
    },

    mapModuleNotes(courseModule) {
      const userNotesList = {};
      for (const lesson of courseModule.lessons) {
        if (!lesson.user_note) continue;

        userNotesList[lesson.id] = this.createUserNoteObject(lesson);
      }
      return userNotesList;
    },

    createUserNoteObject(lesson) {
      return {
        id: lesson.id,
        note: lesson.user_note,
        name: "L - " + lesson.order_id,
      };
    },

    onModuleExpand(id) {
      this.altModules = this.altModules.map((module) => {
        if (module.id === id) {
          module.expanded = !module.expanded;
        }
        return module;
      });
    },

    attemptQuiz(data) {
      this.$router.push({
        name: "iu-module-quiz-attempt",
        params: { courseId: this.courseId, courseModuleId: data },
      });
    },

    onOpenModuleNotes(id) {
      this.altModules = this.altModules.map((module) => {
        if (module.id === id) {
          module.notesOpened = !module.notesOpened;
        }
        return module;
      });
    },

    findInAltModules(module) {
      if (!this.altModules) return null;
      return this.altModules.find((item) => module.id === item.id);
    },

    resumeLesson(lessonId) {
      this.$router.push({
        name: "iu-lesson",
        params: {
          courseId: this.$route.params.id,
          lessonId: lessonId,
        },
      });
    },

    getProgressColor(progress) {
      return progress == 100 ? "#53AF52" : "#1982EF";
    },

    getModuleButtonText(progress) {
      if (progress == 0) return this.$t("iu.course.play");
      if (progress == 100) return this.$t("iu.course.complete");
      else return this.$t("iu.course.resume");
    },
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.bg-light-gray {
  background-color: $lightgray;
}

.text-green {
  color: $green;
}

.btn-text {
  font-size: 11px;
}

.module-desc {
  max-height: 200px;
}

.object-fit-cover {
  object-fit: contain;
}

.small-font {
  font-size: 0.7rem;
}

.max-icon-width {
  max-width: 62px;
}

.module-list-height {
  min-height: 300px;
  height: calc(100vh - 420px);
}

.notes-icon-blue {
  svg {
    fill: $blue;
  }
}
</style>
