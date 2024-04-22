<template>
  <transition v-if="rendered" name="modal">
    <div v-show="shouldShow" class="modal-mask">
      <div class="modal-wrapper">
        <div
          v-click-outside="onClickOutside"
          class="modal-container rounded-card"
          :class="{
            'mob-modal-container': $isPhone,
            'tab-modal-container': $isTablet,
          }"
        >
          <div
            v-if="!hideHeader"
            class="modal-header d-flex justify-content-center align-items-center py-3"
          >
            <svg-check-filled class="icon-success" />
          </div>

          <div
            v-if="!hideBody"
            class="modal-body text-center text-white font-weight-400 pb-4"
          >
            <slot name="body" />
          </div>

          <div v-if="!hideFooter" class="modal-footer">
            <slot name="footer" />
            <WarningModalButtons
              v-if="withConfirmationButtons"
              color="green"
              @on-confirm="onConfirm"
              @on-cancel="onCancel"
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import SvgCheckFilled from "@/assets/svg/check-filled.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  components: {
    WarningModalButtons: () =>
      import(
        /* webpackChunkName: "WarningModalButtonsComponent" */ "@/components/Misc/WarningModalButtons"
      ),
    SvgCheckFilled,
  },
  props: {
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    withConfirmationButtons: {
      type: Boolean,
      default: false,
    },
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideBody: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: false,
    },
    hideCloseButton: {
      type: Boolean,
      default: false,
    },
  },
  mixins: [devicesMixin],
  data() {
    return {
      rendered: false,
      shouldShow: false,
    };
  },
  mounted() {
    setTimeout(() => {
      this.rendered = true;
      setTimeout(() => {
        this.shouldShow = true;
      }, 0);
    }, 0);
  },
  methods: {
    onClickOutside() {
      if (this.closeOnClickOutside) this.onClose();
    },
    onClose() {
      this.shouldShow = false;
      setTimeout(() => {
        this.$emit("close-modal");
      }, 200);
    },
    onConfirm() {
      this.$emit("on-confirm");
    },
    onCancel() {
      this.onClose();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.modal-mask {
  position: fixed;
  z-index: 10000;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  min-height: -webkit-fill-available;
  background-color: rgba(
    $modalMaskValue,
    $modalMaskValue,
    $modalMaskValue,
    0.5
  );
  display: table;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 25%;
  max-width: 100%;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: $green;
  color: $darkgray;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 0.3s ease;
  max-height: 98vh;
  overflow: auto;
}

.modal-header {
  border: none;
  position: relative;
  h3 {
    margin-top: 0;
    color: #42b983;
  }
  b {
    font-size: 26px;
    width: calc(100% - 25px);
  }
}

.modal-body {
  font-size: 20px;
}

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}

.close-button {
  margin-top: 2px;
  cursor: pointer;
  right: -15px;
  top: -13px;
  position: absolute;
  svg {
    fill: #ccc;
    width: 24px;
    height: 24px;
  }
}

.fill-green {
  fill: $green;
}

.icon-success {
  width: 80px;
  height: 80px;
}

.mob-modal-container {
  width: 80% !important;
}

.tab-modal-container {
  width: 45% !important;
}
</style>
