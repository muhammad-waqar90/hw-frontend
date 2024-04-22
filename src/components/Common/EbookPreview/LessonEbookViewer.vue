<template>
  <div>
    <portal v-if="ebookData?.src?.path?.length > 0" to="out-of-app-content">
      <FullScreenModal
        v-if="ebookData?.src?.type == EBOOK_TYPES.image"
        :hide-close-button="false"
        @close-modal="closeEbookPreview"
      >
        <template slot="body">
          <FlipBook :flipbook-data="ebookData" />
        </template>
      </FullScreenModal>
      <EbookPDFModal
        v-else
        :pdf-data="ebookData"
        @pdf-error="handleEbookError"
        @close-modal="closeEbookPreview"
      />
    </portal>
  </div>
</template>

<script>
import EbookPDFModal from "@/components/Common/EbookPreview/EbookPDFModal.vue";
import FlipBook from "@/components/Common/EbookPreview/FlipBook.vue";
import FullScreenModal from "@/components/Misc/Modals/FullScreenModal.vue";
import { EBOOK_TYPES } from "@/dataObject/ebook/ebookData.js";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "LessonEbookViewer",
  components: {
    EbookPDFModal,
    FlipBook,
    FullScreenModal,
  },
  mixins: [toastMixin],
  props: {
    ebookData: {
      type: Object,
      default: () => {},
    },
  },
  mounted() {
    if (!this.ebookData?.src?.path?.length) this.handleEbookError();
  },
  data() {
    return {
      EBOOK_TYPES,
    };
  },
  methods: {
    handleEbookError() {
      this.$displayErrorToast(
        this.$t("errors.failedToLoad", {
          file: "Lecture Notes",
        })
      );
      this.$emit("ebook-error");
    },
    closeEbookPreview() {
      this.$emit("close-modal");
    },
  },
};
</script>
