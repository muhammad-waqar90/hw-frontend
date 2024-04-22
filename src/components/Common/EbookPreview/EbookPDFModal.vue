<template>
  <div>
    <EbookModalTransparent
      v-if="pdfData?.src?.path?.length > 0"
      class="pdf-container"
      :close-on-click-outside="false"
      @close-modal="$emit('close-modal')"
    >
      <template slot="body">
        <div>
          <!-- v-on:scroll="handleScroll" //for infinite scroll pagination-->
          <div
            ref="pdfViewer"
            class="ebook overflow-auto scrollbar-blue"
            :class="{
              'loading-overflow': !showPdfConrols,
              'bg-white py-5': pdfPageLoading,
            }"
          >
            <a class="back-button">
              <ChevronLeftCircle
                v-if="currentPageNumber > 1"
                class="svg-arrow-icons-blue cursor-pointer"
                :size="20"
                @click="decrementCurrentPageNumber"
              />
            </a>
            <a class="forward-button">
              <ChevronRightCircle
                v-if="currentPageNumber < totalPdfPages"
                class="svg-arrow-icons-blue cursor-pointer"
                :size="20"
                @click="increaseCurrentPageNumber"
              />
            </a>
            <div v-if="showPdfConrols" class="row pdf-bottom-button-container">
              <div class="pdf-bottom-button">
                <div id="buttons" class="pdf-buttons">
                  <span class="ui active item">
                    <input
                      class="pdf-page-controller"
                      v-model.trim.lazy="currentPageInput"
                      @change="changePdfActivePage"
                      type="text"
                    />
                    /
                    {{ totalPdfPages ? totalPdfPages : "∞" }}
                    <span class="m-2">|</span>
                    <a
                      v-if="zoomLevel > minZoomLevel"
                      class="zoom-out"
                      @click="zoomOut"
                    >
                      <MinusCircle
                        class="svg-arrow-icons-white cursor-pointer"
                      />
                    </a>
                    <span class="pdf-zoom-controller">{{ zoomLevel }} %</span>
                    <a
                      v-if="zoomLevel < maxZoomLevel"
                      class="zoom-in"
                      @click="zoomIn"
                    >
                      <PlusCircle
                        class="svg-arrow-icons-white cursor-pointer"
                      />
                    </a>
                  </span>
                </div>
              </div>
            </div>
            <pdfvuer
              v-show="!pdfPageLoading"
              :src="pdfData?.src?.path[0]"
              :page="currentPageNumber"
              :scale="pdfScale"
              :resize="false"
              @loading="pdfLoading"
              @numpages="getPdfPagesCount"
              @pagerendered="pdfRendered"
              @update:scale="scaleHandler($event)"
              @contextmenu.native="handler($event)"
              @error="errorHandler()"
            >
              <template slot="loading">
                <div
                  class="logo-loadder-pdf d-flex justify-content-center align-items-center h-100"
                >
                  <div class="logo-loader">
                    <lottie-logo-loader
                      class="logo-loader-opacity py-4"
                      path="anims/hw-loader.json"
                      :width="180"
                      :height="180"
                    />
                  </div>
                </div>
              </template>
            </pdfvuer>
            <div v-show="pdfPageLoading" ref="pdfPageLoading">
              <div
                class="d-flex justify-content-center align-items-center h-100"
              >
                <div class="logo-loader">
                  <lottie-logo-loader
                    class="logo-loader-opacity py-4"
                    path="anims/hw-loader.json"
                    :width="180"
                    :height="180"
                  />
                </div>
              </div>
            </div>
          </div>
          <!-- Ref: pdf paginaion button for all pages -->
          <!-- <PaginationButtonsCallback
                v-if="totalPdfPages"
                :current-page="currentPageNumber"
                :max-pages="totalPdfPages"
                @set-current-page="setCurrentPageNumber"
              /> -->
        </div>
      </template>
    </EbookModalTransparent>
  </div>
</template>

<script>
// import PaginationButtonsCallback from "@/components/Misc/PaginationButtonsCallback";
import EbookModalTransparent from "@/components/Misc/EbookModalTransparent";
import LottieLogoLoader from "lottie-vuejs/src/LottieAnimation.vue";
import ChevronRightCircle from "vue-material-design-icons/ChevronRightCircle";
import ChevronLeftCircle from "vue-material-design-icons/ChevronLeftCircle";
import PlusCircle from "vue-material-design-icons/PlusCircle";
import MinusCircle from "vue-material-design-icons/MinusCircle";

export default {
  name: "EbookPDFModal",
  components: {
    // PaginationButtonsCallback,
    pdfvuer: () => import(/* webpackChunkName: "pdfvuer" */ "pdfvuer"),
    EbookModalTransparent,
    LottieLogoLoader,
    ChevronRightCircle,
    ChevronLeftCircle,
    PlusCircle,
    MinusCircle,
  },
  props: {
    pdfData: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      currentPageNumber: 1,
      totalPdfPages: null,
      pdfScale: 1.0,
      showPdfConrols: false,
      currentPageInput: "1",
      zoomLevel: 100,
      maxZoomLevel: 125,
      minZoomLevel: 60,
      zoomValueHeight: 0,
      zoomValueWidth: 0,
      pdfPageLoading: false,
      pdfPreviousStyle: null,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      // Listen keyboard events
      window.addEventListener("keydown", this.handleKeyPress);
    },
    pdfLoading() {
      this.showPdfConrols = false;
    },
    pdfRendered() {
      this.showPdfConrols = true;
      this.scrollHandeler();
      this.updateNewPageStyle();
    },
    getPdfPagesCount(totalPages) {
      this.totalPdfPages = totalPages;
    },
    handleKeyPress(event) {
      if (event.key == "ArrowRight") {
        this.increaseCurrentPageNumber();
      } else if (event.key == "ArrowLeft") {
        this.decrementCurrentPageNumber();
      }
    },
    decrementCurrentPageNumber() {
      if (this.currentPageNumber > 1) {
        this.setCurrentPageNumber(--this.currentPageNumber);
      }
    },
    increaseCurrentPageNumber() {
      if (this.currentPageNumber < this.totalPdfPages) {
        this.setCurrentPageNumber(++this.currentPageNumber);
      }
    },
    changePdfActivePage(event) {
      if (!isNaN(event.target.value)) {
        this.setCurrentPageNumber(parseInt(event.target.value));
      }
    },
    setCurrentPageNumber(index) {
      if (index > 0 && index <= this.totalPdfPages) {
        this.pdfPageLoading = true;
        if (this.$refs.pdfPageLoading && this.pdfPreviousStyle) {
          Object.assign(this.$refs.pdfPageLoading.style, this.pdfPreviousStyle);
        }
        this.currentPageNumber = index;
        this.currentPageInput = index.toString();
        // this.setDefaultZoom();
        this.updatePdfStyle();
      }
    },
    setDefaultZoom() {
      this.zoomLevel = 100;
      this.zoomValueHeight = 0;
      this.zoomValueWidth = 0;
    },
    zoomIn() {
      this.zoomLevel += 1;
      this.zoomValueHeight = 1;
      this.zoomValueWidth = 1;
      this.updatePdfStyle();
    },
    zoomOut() {
      this.zoomLevel -= 1;
      this.zoomValueHeight = -1;
      this.zoomValueWidth = -1;
      this.updatePdfStyle();
    },
    updatePdfStyle() {
      this.zoomHandeler(".page", this.zoomValueHeight, this.zoomValueWidth);
      this.zoomHandeler(
        ".canvasWrapper",
        this.zoomValueHeight,
        this.zoomValueWidth
      );
      this.zoomHandeler("canvas", this.zoomValueHeight, this.zoomValueWidth);
      this.zoomHandeler(
        ".textLayer",
        this.zoomValueHeight,
        this.zoomValueWidth,
        true
      );
      this.scrollHandeler();
    },
    updateNewPageStyle() {
      var pageZoom = this.zoomLevel - 100;
      pageZoom = pageZoom * 10;
      this.zoomValueHeight = pageZoom;
      this.zoomValueWidth = pageZoom;
      this.updatePdfStyle();
      this.pdfPageLoading = false;
    },
    zoomHandeler(
      className,
      zoomPixelsHeight,
      zoomPixelsWidth,
      persistStyle = false
    ) {
      // Todo: zoomPixelsWidth, zoomPixelsHeight are not required yet will remove this when the code is finalized
      const element = document.querySelectorAll(className);
      element.forEach((element) => {
        const originalWidth = parseInt(element.style.width);
        const originalHeight = parseInt(element.style.height);
        if (!isNaN(originalWidth) && !isNaN(originalHeight)) {
          element.style.width = `${this.zoomLevel - 12}vw`;
          element.style.height = `${
            this.zoomLevel < 101 ? this.zoomLevel : 100
          }%`;
          if (persistStyle && !this.pdfPageLoading)
            this.pdfPreviousStyle = {
              width: `${this.zoomLevel - 12}vw`,
              height: `${this.zoomLevel < 101 ? this.zoomLevel : 100}%`,
            };
        }
      });
    },
    scrollHandeler() {
      const pdfViewer = this.$refs.pdfViewer;
      if (pdfViewer && pdfViewer.scrollTop) pdfViewer.scrollTop = 1;
    },
    errorHandler() {
      this.$emit("pdf-error");
    },
    handler(e) {
      e.preventDefault();
    },
    scaleHandler(e) {
      this.pdfScale = e;
    },
    // Ref: pdf paginaion with infinite scroll
    // handleScroll(event) {
    //   const pdfViewer = event.target;
    //   const scrollHeight = pdfViewer.scrollHeight;
    //   const scrollTop = pdfViewer.scrollTop;
    //   const clientHeight = pdfViewer.clientHeight;
    //   if (scrollTop === 0) {
    //     // Scrolled to the top, go to the previous page if available
    //     if (this.currentPageNumber > 1) {
    //       this.setCurrentPageNumber(--this.currentPageNumber);
    //     }
    //   } else if (scrollTop + clientHeight >= scrollHeight - 1) {
    //     // Scrolled to the bottom, go to the next page if available
    //     if (this.currentPageNumber < this.totalPdfPages) {
    //       this.setCurrentPageNumber(++this.currentPageNumber);
    //     }
    //   }
    // },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.ebook {
  max-height: calc(101vh - 3rem);
  padding-bottom: 0px;
  width: 100%;
  max-width: calc(100vw - 8rem);
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  overscroll-behavior: none;
}
.logo-loader {
  aspect-ratio: 16 / 7.75;
  align-items: center;
  display: flex;
}
.logo-loader-opacity {
  opacity: 0.7;
}
.pdf-bottom-button-container {
  justify-content: center;
}
.pdf-bottom-button {
  position: absolute;
  z-index: 1;
  bottom: 20px;
  margin: auto;
  background: rgba(50, 142, 236, 0.8);
  border-radius: 16px;
  width: 270px;
  padding: 10px;
}
.pdf-buttons {
  opacity: 1;
  color: $static-white;
}
.pdf-middle-button-container {
  justify-content: center;
}
.pdf-middle-button {
  position: absolute;
  z-index: 1;
  bottom: 50%;
  margin: auto;
  border-radius: 25px;
  width: 98%;
  padding: 20px;
}
.back-button {
  float: left;
  position: absolute;
  z-index: 1;
  bottom: 50%;
  margin: auto;
  left: 0;
  padding-left: 1vh;
}
.forward-button {
  float: right;
  position: absolute;
  z-index: 1;
  bottom: 50%;
  margin: auto;
  right: 0;
  padding-right: 1vh;
}
.pdf-page-controller {
  padding: 0px 6px;
  border: none;
  border-radius: 8px;
  display: inline-block;
  min-width: 4ch;
  width: 10%;
  max-width: 10ch;
  box-sizing: border-box;
  transition: border-color 0.3s, box-shadow 0.3s;
  color: $blue;
}
.pdf-page-controller:focus {
  outline: none;
}
.pdf-zoom-controller {
  padding: 0px 6px;
  border-radius: 8px;
  display: inline-block;
  color: $blue;
  background: $static-white;
  margin: 0px 3px;
}
.logo-loadder-pdf {
  margin: 250px;
}
.loading-overflow {
  overflow: hidden !important;
}
</style>
