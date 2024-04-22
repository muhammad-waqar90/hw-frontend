<template>
  <div
    v-if="!isOnline"
    :class="{ shake: isShaking }"
    class="position-fixed alert alert-danger no-internet"
  >
    <WifiOff :size="20" class="me-2" />
    {{ $t("general.youAreOffline") }}
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import WifiOff from "vue-material-design-icons/WifiOff";
export default {
  components: {
    WifiOff,
  },

  data() {
    return {
      isShaking: false,
      shakeTimeout: null,
    };
  },

  computed: {
    ...mapGetters({
      isOnline: "ui/getIsOnline",
      onlineShake: "ui/getOnlineShake",
    }),
  },

  watch: {
    onlineShake() {
      if (this.shakeTimeout) clearTimeout(this.shakeTimeout);

      this.isShaking = true;
      this.shakeTimeout = setTimeout(() => {
        this.isShaking = false;
      }, 750);
    },
  },

  mounted() {
    window.addEventListener("online", () => this.updateOnlineStatus(true));
    window.addEventListener("offline", () => this.updateOnlineStatus(false));
  },

  methods: {
    updateOnlineStatus(value) {
      this.$store.dispatch("ui/setIsOnline", value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.no-internet {
  background-color: $darkgray;
  width: fit-content;
  color: $white;
  z-index: 1050;
  bottom: 0;
  left: 15px;

  @media (min-width: $bigDesktopWidth) {
    left: 50%;
    //658 because (1320 + 24 / 2) - 2px
    // -2px because of diff in spacing 16 and 12
    transform: translate(calc(-50% - 658px), 0);
  }
}

.shake {
  animation: shake 0.75s infinite;
}
.message {
  position: relative;
  text-align: center;
}
@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-10px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(10px);
  }
}

@media (min-width: $bigDesktopWidth) {
  @keyframes shake {
    0%,
    100% {
      transform: translate(calc(-50% - 658px), 0);
    }
    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translate(calc(-50% - 668px), 0);
    }
    20%,
    40%,
    60%,
    80% {
      transform: translate(calc(-50% - 648px), 0);
    }
  }
}
</style>
