<template>
  <div class="h-100">
    <div
      v-if="mini"
      class="d-flex justfiy-content-center align-items-center h-100"
    >
      <label
        for="upload"
        class="icon-container cursor-pointer"
        :class="{ 'opacity-25': selectedFiles.length >= 3 }"
      >
        <ImageOutline class="image-icon" :size="36" />
      </label>
      <input
        :disabled="selectedFiles.length >= 3"
        ref="fileInput"
        id="upload"
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        multiple
        @change="selectFile"
      />
    </div>
    <div v-else class="d-flex mt-2">
      <div
        v-for="(file, index) in selectedFiles"
        :key="index"
        class="position-relative mx-2 my-2"
      >
        <CloseCircle
          class="close-button cursor-pointer"
          @click="removeImage(index)"
        />

        <img
          :src="file.url"
          :alt="file.name"
          class="shadow-sm rounded-img cursor-pointer"
          height="80px"
          width="80px"
          @click="openImage(file)"
        />
      </div>
      <label
        v-if="selectedFiles.length < 3"
        class="upload-label rounded-img cursor-pointer mx-2 my-2"
        for="upload"
      >
        <SvgUploadScreenshot class="upload-icon" />
        {{ $t("iu.uploadScreenshots.addScreenshot") }}
      </label>

      <input
        :disabled="selectedFiles.length >= 3"
        ref="fileInput"
        id="upload"
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        multiple
        @change="selectFile"
      />
    </div>

    <portal to="out-of-app-content">
      <ModalTransparent
        v-if="imagePopUp"
        :hide-footer="true"
        :hide-header="true"
        @close-modal="closeImagePopup"
      >
        <template slot="body">
          <div class="w-100 text-center">
            <img
              class="mt-3 view-image"
              :src="imagePopUpFile.url"
              :alt="imagePopUpFile.name"
            />
          </div>
        </template>
      </ModalTransparent>
    </portal>
  </div>
</template>

<script>
import ModalTransparent from "@/components/Misc/ModalTransparent";
import CloseCircle from "vue-material-design-icons/CloseCircle";
import ImageOutline from "vue-material-design-icons/ImageOutline";
import SvgUploadScreenshot from "@/assets/svg/upload-screenshot.svg";
import toastMixin from "@/mixins/toastMixin";

export default {
  name: "UploadScreenshots",

  components: {
    ModalTransparent,
    CloseCircle,
    ImageOutline,
    SvgUploadScreenshot,
  },

  mixins: [toastMixin],

  props: {
    mini: {
      type: Boolean,
      default: false,
    },
    deleteIndex: null,
    openIndex: null,
    reset: false,
  },

  data() {
    return {
      selectedFiles: [],
      imagePopUp: false,
      imagePopUpFile: null,
      duplicateFileFlag: false,
      fileSizeFlag: false,
      uploadLimitFlag: false,
    };
  },

  watch: {
    selectedFiles() {
      this.$emit("get-images", this.selectedFiles);
    },
    deleteIndex() {
      if (this.deleteIndex != null) {
        this.removeImage(this.deleteIndex);
      }
    },
    openIndex() {
      if (this.openIndex != null) {
        this.openImage(this.selectedFiles[this.openIndex]);
      }
    },
    reset() {
      this.selectedFiles = [];
      this.$refs.fileInput.value = null;
    },
  },

  methods: {
    selectFile() {
      //sort files in ascending order
      let files = Array.from(event.target.files);
      files.sort((a, b) => a.size - b.size);

      const newFileList = new DataTransfer();
      files.forEach((file) => newFileList.items.add(file));
      event.target.files = newFileList.files;

      if (this.selectedFiles.length < 3) {
        for (let i = 0; i < event.target.files.length; i++) {
          const file = event.target.files[i];
          const duplicate = this.selectedFiles.find(
            (file) => file.name === files[i].name && file.size === files[i].size
          );
          if (
            files[i].size <= 500000 &&
            this.selectedFiles.length < 3 &&
            !duplicate
          ) {
            file.url = URL.createObjectURL(file);
            this.selectedFiles.push(file);
          } else {
            // Check for duplicates
            if (duplicate && this.selectedFiles.length != 3) {
              this.duplicateFileFlag = true;
            }
            // Check for files greater than 500kb
            if (files[i].size > 500000 && this.selectedFiles.length != 3) {
              this.fileSizeFlag = true;
            }
            // Check for filelist greater than 3
            if (this.selectedFiles.length == 3) {
              this.uploadLimitFlag = true;
              break;
            }
          }
        }
      } else {
        this.uploadLimitFlag = true;
      }

      if (this.duplicateFileFlag) {
        this.$displayErrorToast(
          this.$t("iu.uploadScreenshots.errors.duplicateFile")
        );
        this.duplicateFileFlag = false;
      }
      if (this.fileSizeFlag) {
        this.$displayErrorToast(
          this.$t("iu.uploadScreenshots.errors.fileSize")
        );
        this.fileSizeFlag = false;
      }
      if (this.uploadLimitFlag) {
        this.$displayErrorToast(
          this.$t("iu.uploadScreenshots.errors.uploadLimit")
        );
        this.uploadLimitFlag = false;
      }
      this.$refs.fileInput.value = null;
    },
    openImage(image) {
      this.imagePopUpFile = image;
      this.imagePopUp = true;
    },
    closeImagePopup() {
      this.imagePopUp = false;
      if (this.openIndex != null) this.$emit("set-open-index", null);
    },
    removeImage(index) {
      this.selectedFiles = this.selectedFiles.filter((file, i) => i != index);
      if (this.deleteIndex != null) this.$emit("set-delete-index", null);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

#upload {
  display: none;
}
.rounded-img {
  border-radius: 15px;
}
.upload-label {
  width: 80px;
  height: 80px;
  border: 1px solid #ced2da;
  color: #a4a6a9;
  font-size: 9px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.upload-icon {
  margin-bottom: 8px;
}
.close-button {
  fill: $red;
  color: $red;
  position: absolute;
  top: -5px;
  right: -8px;
  background-color: $white;
  border-radius: 100%;
}
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  background-color: $lightgray;
}
.image-icon {
  color: $gray;
}
.view-image {
  max-height: calc(100vh - 3rem);
  max-width: calc(100vh - 5rem);
}
</style>
