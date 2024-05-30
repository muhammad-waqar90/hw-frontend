<template>
  <div class="col-12 p-0 overflow-hidden" :class="getRoundedClass">
    <video ref="videoPlayer" class="video-js col-12"></video>
    <button
      v-show="showPlayButton && customControls"
      class="video-control-button"
      @click="playVideo"
    >
      <PlayCircleOutlineIcon :size="buttonSize" />
    </button>
    <button
      v-show="showPauseButton && customControls"
      class="video-control-button"
      @click="pauseVideo"
    >
      <PauseCircleOutlineIcon :size="buttonSize" />
    </button>
  </div>
</template>

<script>
import videojs from "video.js";
import * as videoRoundedTypes from "@/dataObject/video/videoRoundedData";
import PlayCircleOutlineIcon from "vue-material-design-icons/PlayCircleOutline";
import PauseCircleOutlineIcon from "vue-material-design-icons/PauseCircleOutline";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "VideoPlayer",
  components: {
    PlayCircleOutlineIcon,
    PauseCircleOutlineIcon,
  },
  mixins: [devicesMixin],
  props: {
    options: {
      type: Object,
      default() {
        return {};
      },
    },
    rounded: {
      type: String,
      default: null,
    },
    customControls: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      player: null,
      videoRoundedTypes,
      videoOptions: this.options,
      showPlayButton: true,
      showPauseButton: false,
    };
  },

  computed: {
    getRoundedClass() {
      if (this.rounded === this.videoRoundedTypes.FULL_ROUNDED)
        return "rounded-card";
      if (this.rounded === this.videoRoundedTypes.TOP_ROUNDED)
        return "rounded-card-top";
      return "";
    },
    buttonSize() {
      return this.$isPhone ? 70 : 100;
    },
  },

  mounted() {
    this.playerConfiguration();
  },

  methods: {
    playerConfiguration() {
      this.player = videojs(this.$refs.videoPlayer, this.videoOptions, () => {
        // this.player.log("onPlayerReady", this);

        this.player.on("play", () => {
          this.playVideo(false);
        });

        this.player.on("pause", () => {
          this.pauseVideo();
        });

        this.player.on("error", () => {
          this.videoError();
        });
      });
    },
    playVideo(playButton = true) {
      if (playButton) this.player.play();
      this.showPlayButton = false;
      // Play and Pause button functionality
      // this.showPlayButton = true;
      // this.showPauseButton = false;
      // setTimeout(() => {
      //   this.showPlayButton = false;
      //   this.showPauseButton = false;
      // }, 500);
    },
    pauseVideo() {
      this.showPlayButton = true;
      // Play and Pause button functionality
      // this.showPlayButton = false;
      // this.showPauseButton = true;
      // setTimeout(() => {
      //   this.showPlayButton = false;
      //   this.showPauseButton = false;
      // }, 500);
    },
    videoError() {
      this.showPlayButton = false;
    },
  },
  beforeDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  },
};
</script>

<style lang="scss" scoped>
@import "~video.js/dist/video-js.min.css";

.video-control-button {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: transparent;
  border: none;
  color: white;
  font-size: 36px;
  transition: opacity 0.3s ease;
  z-index: 2;
  cursor: pointer;
}

.video-control-button:hover {
  opacity: 0.8;
}
</style>
