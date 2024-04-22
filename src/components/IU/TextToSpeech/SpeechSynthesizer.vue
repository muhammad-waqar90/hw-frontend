<template>
  <div>
    <span class="mx-3" v-if="speechButton == `play`">
      <svg-play class="tts-icon" @click="speak(text)" />
    </span>
    <span class="mx-3" v-if="speechButton == `playing`">
      <svg-pause class="tts-icon" @click="pauseSpeechEvent()" />
    </span>
    <span class="mx-3" v-if="speechButton == `pause`">
      <svg-play class="tts-icon" @click="resumeSpeechEvent()" />
    </span>
    <span>
      <svg-replay
        class="tts-icon"
        :class="{ 'disable-replay': disableReplay }"
        @click.stop="replaySpeechEvent()"
    /></span>
  </div>
</template>

<script>
import SvgPlay from "@/assets/svg/TextToSpeech/play-icon.svg";
import SvgPause from "@/assets/svg/TextToSpeech/pause-icon.svg";
import SvgReplay from "@/assets/svg/TextToSpeech/replay-icon.svg";

export default {
  components: {
    SvgPlay,
    SvgPause,
    SvgReplay,
  },
  props: {
    speechText: { type: String },
    onSpeech: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      speechIcon: "play",
      voiceNamesToCheck: [
        "Microsoft Hazel",
        "Microsoft Zira",
        "Samantha",
        "English",
        "Bulgarian Bulgaria (bg_BG) — DEFAULT",
        "Fred",
        "Kathy",
        "Default",
      ],
      utterance: new SpeechSynthesisUtterance(),
      currentVoice: null,
      disableReplay: false,
    };
  },
  computed: {
    text() {
      return this.speechText;
    },
    speechButton() {
      return this.speechIcon;
    },
  },
  created() {
    this.checkAvailability();
  },
  mounted() {
    if (this.onSpeech) {
      this.speak(this.text);
    }
  },
  methods: {
    speak(text) {
      this.$emit("onPlay", true);
      this.speechIcon = "playing";
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        this.utterance = null;
      }
      window.utterances = [];
      if (!speechSynthesis.speaking) {
        window.utterances.push(this.utterance);
        this.utterance.text = text;
        if (this.currentVoice) {
          this.utterance.voice = this.currentVoice;
        }
        this.utterance.pitch = 1;
        this.utterance.rate = 0.8;
        this.utterance.addEventListener("end", () => {
          this.endSpeech();
        });
        setTimeout(() => {
          if (!speechSynthesis.speaking) speechSynthesis.speak(this.utterance);
        }, 100);
      } else {
        speechSynthesis.speak(text);
      }
    },
    endSpeech() {
      this.cancelSpeechEvent();
      this.$emit("onPlay", false);
    },
    selectVoice() {
      const voices = speechSynthesis.getVoices();
      for (const nameToCheck of this.voiceNamesToCheck) {
        this.currentVoice = voices.find((voice) =>
          voice.name.includes(nameToCheck)
        );
        if (this.currentVoice) {
          break;
        }
      }
      if (!this.currentVoice && voices.length > 0) {
        const randomIndex = Math.floor(Math.random() * voices.length);
        this.currentVoice = voices[randomIndex];
      }
      if (this.currentVoice) {
        this.currentVoice;
      }
    },
    async replaySpeechEvent() {
      await this.cancelSpeechEvent();
      this.speechIcon = "playing";
      this.disableReplay = true;
      this.$emit("onPlay", true);
      setTimeout(() => {
        this.speak(this.text);
      }, 100);
      setTimeout(() => {
        this.disableReplay = false;
      }, 1500);
    },
    pauseSpeechEvent() {
      speechSynthesis.pause();
      this.speechIcon = "pause";
    },
    cancelSpeechEvent() {
      this.speechIcon = "play";
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
        this.utterance = null;
      }
      this.utterance = new SpeechSynthesisUtterance();
    },
    resumeSpeechEvent() {
      this.speechIcon = "playing";
      if (speechSynthesis.paused) {
        speechSynthesis.resume();
      } else {
        this.replaySpeechEvent();
      }
    },
    checkAvailability() {
      // we can use this check later for handeling in mobile
      // const isAndroid = /Android/i.test(navigator.userAgent);
      if ("speechSynthesis" in window) {
        this.$emit("onHide", false);
        this.selectVoice();
      } else this.$emit("onHide", true);
    },
  },
  beforeDestroy() {
    this.cancelSpeechEvent();
    this.$emit("onHide", true);
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.tts-icon {
  cursor: pointer;
  svg {
    width: 18px;
    height: 18px;
  }
}
.disable-replay {
  pointer-events: none;
  opacity: 0.5;
}
</style>
