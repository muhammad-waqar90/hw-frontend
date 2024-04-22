<template>
  <div class="row">
    <div :class="$isPhone ? 'col-12' : 'col'">
      <textarea
        v-if="!uploadedImages.length"
        v-model="message"
        class="text-dark-gray scrollbar-blue"
        :placeholder="$t('iu.ticket.writeMessage')"
      />
      <InputWithFilesList
        v-else
        :model-value="message"
        :file-names="uploadedImages.map((img) => img.name)"
        @update:modelValue="(newValue) => (message = newValue)"
        @set-delete-index="setDeleteIndex"
        @set-open-index="setOpenIndex"
      />
    </div>
    <div
      :class="$isPhone ? 'd-flex justify-content-start py-2 col-6' : 'col-auto'"
    >
      <UploadScreenshots
        :mini="true"
        :delete-index="deleteIndex"
        :open-index="openIndex"
        :reset="resetImages"
        @get-images="getImages"
        @set-delete-index="setDeleteIndex"
        @set-open-index="setOpenIndex"
      />
    </div>
    <div
      class="icon-container"
      :disabled="message.length < 1"
      :class="
        ([message.length < 1 ? 'opacity-disabled' : 'cursor-pointer'],
        $isPhone ? 'col-6' : 'col-auto')
      "
      @click="sendMessage"
    >
      <span class="send-icon icon-circle">
        <svg-send-message class="icon-small" />
      </span>
    </div>
  </div>
</template>

<script>
import UploadScreenshots from "@/components/Ticket/UploadScreenshots";
import InputWithFilesList from "@/components/Misc/Inputs/InputWithFilesList";
import toastMixin from "@/mixins/toastMixin";
import SvgSendMessage from "@/assets/svg/sendMessage.svg";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    SvgSendMessage,
    UploadScreenshots,
    InputWithFilesList,
  },
  mixins: [toastMixin, dompurifyMixin, devicesMixin],
  props: {
    resetMessage: false,
  },
  data() {
    return {
      message: "",
      uploadedImages: [],
      deleteIndex: null,
      openIndex: null,
      resetImages: false,
    };
  },
  watch: {
    resetMessage() {
      this.reset();
    },
    message() {
      this.$emit(
        "set-data-changed",
        this.message != "" || this.uploadedImages.length > 0
      );
    },
  },
  methods: {
    getImages(images) {
      this.uploadedImages = images;
    },
    sendMessage() {
      if (this.message.length < 1) return;
      if (this.message.length >= 4000)
        return this.$displayErrorToast(
          this.$t("iu.ticket.messageLengthRequirement")
        );
      if (!this.sanitizeWithBusinesslogic(this.message))
        return this.$displayErrorToast(this.$t("errors.invalidFieldAlert"));
      let formData = new FormData();
      formData.append("message", this.message);
      for (let i = 0; i < this.uploadedImages.length; i++) {
        formData.append("assets[]", this.uploadedImages[i]);
      }
      this.reset();
      this.$emit("send-message", formData);
    },
    setDeleteIndex(index) {
      this.deleteIndex = index;
    },
    setOpenIndex(index) {
      this.openIndex = index;
    },
    reset() {
      this.message = "";
      this.uploadedImages = [];
      this.resetImages = !this.resetImages;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

textarea {
  width: 100%;
  height: 60px;
  background-color: $white;
  resize: none;
  border: none;
  outline: none;
}
.icon-container {
  display: flex;
}
.send-icon {
  background-color: $blue;
  padding: 0.7em;
  border-radius: 100%;
  margin-left: auto;
  margin-right: 0.5em;
  margin-top: auto;
  margin-bottom: auto;
}
.opacity-disabled {
  opacity: 0.4;
}

@media (max-width: $laptopWidth) {
  textarea {
    height: 50px;
  }
}
</style>
