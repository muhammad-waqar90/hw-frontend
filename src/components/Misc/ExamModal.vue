<template>
  <transition v-if="rendered" name="modal">
    <div v-show="shouldShow" class="modal-mask">
      <div class="modal-wrapper">
        <div v-click-outside="onClickOutside" class="modal-container">
          <div class="position-relative">
            <close
              v-if="!hideCloseButton"
              class="close-button"
              @click="onClose"
            />
          </div>
          <div v-if="!hideHeader" class="modal-header">
            <slot name="header" />
          </div>

          <div v-if="!hideBody" class="modal-body">
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
import Close from "vue-material-design-icons/CloseThick";
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
      default: false,
    },
    withConfirmationButtons: {
      type: Boolean,
      default: false,
    },
    hideHeader: {
      type: Boolean,
      default: true,
    },
    hideBody: {
      type: Boolean,
      default: false,
    },
    hideFooter: {
      type: Boolean,
      default: true,
    },
    hideCloseButton: {
      type: Boolean,
      default: true,
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
      //Handle closing in parent
      //Note: No transition
      //this.shouldShow = false;
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
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: $white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: flex;
  // justify-content: center;
  // align-items: center;
  width: 100%;
  height: 100%;
}

.modal-container {
  background-color: $offwhite;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  padding: 4%;
  width: 100% !important;
  max-width: 100%;
  height: 100%;
  max-height: 100%;
  overflow-y: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.modal-header {
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.modal-body {
  padding-bottom: 10px;
  margin-bottom: 10px;
}

.modal-footer {
  border-top: 1px solid #ccc;
  padding-top: 10px;
  margin-top: 10px;
}

::v-deep .quiz-body {
  max-height: 340px !important;
  height: 340px !important;
}

@media (min-width: 768px) {
  .modal-container {
    width: 50%;
  }
}
</style>
