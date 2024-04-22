<template>
  <div
    :class="[viewNotes ? 'bg-white' : 'h-100']"
    class="rounded-card px-4 pt-4 pb-2"
  >
    <template v-if="viewNotes">
      <textarea
        v-model="notesText"
        class="textarea text-dark-gray small-text scrollbar-blue-white-bg pe-2"
        rows="8"
        maxlength="65535"
        :placeholder="$t('iu.lesson.notesPlaceholder')"
        @input="debounceUpdate"
      />
      <hr />
      <div class="row bottom-min-height">
        <template v-if="!!notesText">
          <div class="col">
            <p class="small-text font-weight-600 text-dark-gray">
              {{ formattedNotesDate }}
            </p>
          </div>

          <div class="col-auto">
            <Download
              class="icon-orange cursor-pointer"
              :size="24"
              @click="downloadNotes"
            />
          </div>
        </template>
      </div>
    </template>
    <template v-else>
      <div
        class="d-flex justify-content-center align-items-center flex-column flex-grow-1 cursor-pointer h-100"
        @click="handleViewNotes"
      >
        <svg-note class="icon-very-large mb-3" />
        <span class="font-weight-600 text-dark-gray">
          {{ $t("iu.lesson.notesPlaceholder") }}
        </span>
      </div>
    </template>
  </div>
</template>

<script>
import Download from "vue-material-design-icons/Download";
import { debounce } from "@/utils/generalUtils";
import SvgNote from "@/assets/svg/note.svg";
import toastMixin from "@/mixins/toastMixin";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  components: { Download, SvgNote },
  mixins: [toastMixin, dompurifyMixin],
  props: {
    initText: {
      type: String,
      default: null,
    },
    notesUpdatedAt: String,
    lessonName: String,
  },
  data() {
    return {
      notesText: this.initText,
      viewNotes: false,
    };
  },
  computed: {
    formattedNotesDate() {
      if (!this.notesUpdatedAt) return;

      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      };
      return new Date(this.notesUpdatedAt).toLocaleDateString("en-GB", options);
    },
  },
  mounted() {
    if (this.initText != "" && this.initText != null) this.viewNotes = true;
  },
  methods: {
    debounceUpdate: debounce(function () {
      if (!this.sanitizeWithBusinesslogic(this.notesText))
        return this.$displayErrorToast(this.$t("errors.invalidFieldAlert"));
      this.$emit("update-notes", this.notesText);
    }, 500),
    async downloadNotes() {
      const url = window.URL.createObjectURL(
        new Blob([this.notesText], { type: "application/text" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        this.lessonName + "-notes-" + Date.now().toString() + ".txt"
      );
      document.body.appendChild(link);
      link.click();

      // clear body, URL
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 200);
    },
    handleViewNotes() {
      this.viewNotes = true;
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.bg-lightgray {
  background-color: $lightgray;
}

.icon-very-large {
  width: 80px;
  height: 80px;
}

.icon-blue {
  fill: $blue;
}

.icon-orange {
  svg {
    fill: $orange;
  }
}

.textarea {
  resize: none;
  background: none;
  border: none;
  overflow: visible;
  height: fit-content;
  width: 100%;

  &:focus {
    outline: none;
  }
}

.small-text {
  font-size: 12px;
}

.text-min-height {
  height: 150px;
}

.bottom-min-height {
  min-height: 34px;
}
</style>
