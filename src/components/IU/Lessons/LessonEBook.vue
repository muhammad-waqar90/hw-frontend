<template>
  <div class="row mt-3 content-height overflow-y-auto scrollbar-blue">
    <div class="col-12">
      <div class="d-flex flex-column bg-white rounded-card text-gray">
        <div v-if="loadedEbook">
          <div
            ref="ebookContent"
            class="select-disabled text-dark-gray px-2"
            v-html="ebook.content"
          />
        </div>
        <LoadingEBook v-else />
      </div>
    </div>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { FULL_HEIGHT as NOTEPAD_FULL_HEIGHT } from "@/dataObject/notepad/notepadModesData";
import LoadingEBook from "@/components/IU/EBook/LoadingEBook.vue";

import { getLessonEbookService } from "@/services/iuService";

export default {
  name: "LessonEBook",

  components: {
    LoadingEBook,
  },

  mixins: [toastMixin, devicesMixin],

  data() {
    return {
      ebook: {},
      loadedNotes: false,
      notesSaving: false,
      courseId: null,
      lessonId: null,
      NOTEPAD_FULL_HEIGHT,
      loadedEbook: false,
    };
  },

  mounted() {
    this.init();
  },

  methods: {
    async init() {
      this.courseId = this.$route.params.courseId;
      this.lessonId = this.$route.params.lessonId;

      await this.getEbook();
    },

    async getEbook() {
      const response = await getLessonEbookService(
        this.courseId,
        this.lessonId
      );

      if (response.error) return this.handleResponseError(response);

      this.ebook = response.ebook;
      this.loadedEbook = true;
    },

    handleResponseError(response) {
      if (response.status === 404 || response.status == 403)
        return this.$router.replace({ name: "pageNotFound" });
      this.$displayServerResponse(response);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.select-disabled {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -o-user-select: none;
  user-select: none;
}
p {
  font-family: "Montserrat", sans-serif;
}
.content-height {
  height: 206px;
}
</style>
