<template>
  <article v-if="srcValid" class="row position-relative">
    <div class="position-relative col-sm-12">
      <div class="position-relative overflow-hidden" :class="getRoundedClass">
        <Player
          ref="player"
          class="cursor-pointer overflow-hidden"
          :current-time="currentTime"
          :aspect-ratio="aspectRatio"
          :controls="!firstPlay && !isHls"
          :poster="thumbnail"
          @vmLoadStart="onLoadStart"
          @vmPlaybackReady="onPlaybackReady"
          @vmCurrentTimeChange="onTimeUpdate"
          @vmPlaybackStarted="onPlaybackStarted"
          @vmPlaybackEnded="onPlaybackEnded"
          @vmPausedChange="onPauseChanged"
          @vmPlaybackQualityChange="onQualityChange"
          :autoplay="false"
          @click="!isHls && firstPlayVideo()"
        >
          <template v-if="isHls">
            <Hls
              ref="hlsPlayer"
              :config="hlsConfig"
              version="1.4.14"
              cross-origin="use-credentials"
              @click="firstPlayVideo()"
            >
              <source
                cross-origin="use-credentials"
                :data-src="currentSrc"
                type="application/x-mpegURL"
              />
            </Hls>
            <DefaultUi
              :no-spinner="!playerReady"
              :no-loading-screen="!playerReady"
            >
              <ClickToPlay />
            </DefaultUi>
          </template>
          <template v-else>
            <Video controls-list="nodownload">
              <source :data-src="currentSrc" type="video/mp4" />
            </Video>
          </template>
        </Player>
        <play-circle-outline-icon
          v-if="playerReady && firstPlay && !isHlsMediaLoading"
          :size="100"
          class="play-button cursor-pointer"
          @click="firstPlayVideo()"
        />
      </div>
    </div>
    <div
      v-if="isMediaLoading || isHlsMediaLoading"
      class="position-absolute logo-loader"
    >
      <lottie-logo-loader
        v-if="!$isPhone"
        class="logo-loader-opacity"
        path="anims/hw-loader.json"
        :width="180"
        :height="180"
      />
    </div>
  </article>
  <!-- video src not valid -->
  <div v-else class="row position-relative logo-loader">
    <div class="col-4 text-end">
      <img
        class="not-available-img"
        :src="getDefaultImage()"
        :alt="$t('iu.lesson.errors.previewNotAvailable')"
        @error="handleImageError"
      />
    </div>
    <div class="col-8">
      <b>Oops! <br />Someting went wrong, please reload in a while</b>
    </div>
  </div>
</template>

<script>
import { Player, Video, Hls, DefaultUi, ClickToPlay } from "@vime/vue";
import PlayCircleOutlineIcon from "vue-material-design-icons/PlayCircleOutline";
import LottieLogoLoader from "lottie-vuejs/src/LottieAnimation.vue";

import * as videoRoundedTypes from "@/dataObject/video/videoRoundedData";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import {
  handleImageError,
  getDefaultImage,
  checkLink,
} from "@/utils/imageUtils";

export default {
  name: "LessonVideoPlayer",
  components: {
    Player,
    Video,
    Hls,
    DefaultUi,
    ClickToPlay,
    PlayCircleOutlineIcon,
    LottieLogoLoader,
  },
  mixins: [devicesMixin],
  props: {
    intervalTime: {
      type: Number,
      default: 30,
    },
    initialTimestamp: {
      type: Number,
      default: 0,
    },
    aspectRatio: {
      type: String,
      default: "16:9",
    },
    rounded: {
      type: String,
      default: null,
    },
    src: null,
    thumbnail: null,
    pauseVideoToggle: false,
    videoLoader: true,
  },
  data() {
    return {
      currentTime: 0,
      interval: null,
      firstPlay: true,
      playerReady: false,
      videoRoundedTypes,
      srcValid: false,
      currentSrc: null,
      isMediaLoading: false,
      isHlsMediaLoading: false,
      isHls: false,
      hlsConfig: {
        startLevel: 0,
        enableWorker: true,
        // debug: false, // Enable or disable debug logging
        // maxBufferLength: 5, // Maximum buffer length in seconds
        xhrSetup: function (xhr) {
          xhr.withCredentials = true; // Enable sending cookies
        },
      },
    };
  },
  computed: {
    player() {
      return this.$refs.player;
    },
    getRoundedClass() {
      if (this.rounded === this.videoRoundedTypes.FULL_ROUNDED)
        return "rounded-card";
      if (this.rounded === this.videoRoundedTypes.TOP_ROUNDED)
        return "rounded-card-top";

      return "";
    },
  },
  watch: {
    pauseVideoToggle() {
      if (!this.player) return;
      this.player.pause();
    },
    src() {
      this.checkSrc();
    },
    videoLoader(val) {
      if (!this.playerReady && val) {
        this.isMediaLoading = true;
      } else this.isMediaLoading = false;
    },
  },
  destroyed() {
    clearInterval(this.interval);
  },
  mounted() {
    this.checkSrc();
  },

  methods: {
    onPlaybackStarted() {
      if (!this.firstPlay) return;

      this.currentTime = this.initialTimestamp;
      this.firstPlay = false;
    },
    onLoadStart() {
      this.isMediaLoading = true;
    },
    onQualityChange() {
      if (this.isHls) {
        if (this.firstPlay) return;
        else {
          this.player.pause();
          this.isHlsMediaLoading = true;
          setTimeout(() => {
            if (this.playerReady) this.player.play();
            this.isHlsMediaLoading = false;
          }, 1000);
        }
      }
    },
    onPlaybackReady() {
      this.playerReady = true;
      this.isMediaLoading = false;
    },
    onTimeUpdate(time) {
      this.currentTime = time;
    },
    saveTimestamp() {
      this.$emit("video-playing", parseInt(this.currentTime, 10));
    },
    onStartInterval() {
      this.interval = setInterval(this.saveTimestamp, this.intervalTime * 1000);
    },
    onPlaybackEnded() {
      clearInterval(this.interval);
      this.$emit("video-paused", 0);
    },
    onPauseChanged(val) {
      if (val) {
        clearInterval(this.interval);
        this.$emit("video-paused", parseInt(this.currentTime, 10));
      } else {
        this.onStartInterval();
      }
      this.firstPlay = !this.firstPlay;
    },
    firstPlayVideo() {
      if (this.playerReady && this.firstPlay) this.player.play();
    },
    async checkSrc() {
      this.srcValid = await checkLink(this.src);
      this.currentSrc = this.src;
      if (this.currentSrc?.toLowerCase().endsWith(".m3u8")) this.isHls = true;
      else this.isHls = false;
    },
    handleImageError,
    getDefaultImage,
  },
};
</script>

<style lang="scss" scoped>
@import "~@vime/core/themes/default.css";
@import "@/assets/sass/_variables.scss";

.play-button {
  color: $static-white;
  z-index: 100;
  top: calc(50% - 50px);
  left: calc(50% - 50px);
  position: absolute;
}
.logo-loader-opacity {
  opacity: 0.7;
}
.logo-loader {
  aspect-ratio: 16/9;
  align-items: center;
  display: flex;
}
.not-available-img {
  width: 25%;
  opacity: 0.2;
}
</style>
