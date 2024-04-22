<template>
  <transition v-if="rendered" name="modal">
    <div v-show="shouldShow" class="modal-mask">
      <div class="modal-wrapper">
        <div
          v-click-outside="onClickOutside"
          class="modal-container"
          :class="[{ wide: isWide }]"
        >
          <div class="position-relative">
            <close
              v-if="!hideCloseButton"
              class="close-button red-cross-btn"
              @click="onClose"
            />
          </div>
          <div v-if="!hideHeader" class="modal-header">
            <slot name="header" />
          </div>

          <div v-if="!hideBody" class="modal-body rounded-card">
            <slot name="body" />
          </div>

          <div v-if="!hideFooter" class="modal-footer">
            <slot name="footer" />
            <ConfirmationButtons
              v-if="withConfirmationButtons"
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
import Close from "vue-material-design-icons/Close";
export default {
  components: {
    Close,
    ConfirmationButtons: () =>
      import(
        /* webpackChunkName: "ConfirmationButtonsComponent" */ "@/components/Misc/ConfirmationButtons"
      ),
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
    isWide: {
      type: Boolean,
      default: false,
    },
  },
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
  margin: 0px auto;
  padding-top: 60px;
  padding-bottom: 60px;
  background-color: rgba(255, 255, 255, 0);
  box-shadow: none;
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
    font-weight: 800;
    width: calc(100% - 25px);
  }
}

.modal-body {
  background-color: $white;
  padding: 0;
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
  right: 0px;
  top: -60px;
  position: absolute;
  z-index: 90;
}

@media only screen and (max-width: $bigPhoneWidth) {
  .modal-container {
    width: 90%;
  }
}

@media only screen and (min-width: $laptopWidth) {
  .modal-container {
    width: 650px;
  }
}

.wide {
  width: 70%;
}
</style>
