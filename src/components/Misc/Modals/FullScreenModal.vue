<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div v-click-outside="onClickOutside" class="modal-container">
          <div class="position-relative">
            <close
              v-if="!hideCloseButton"
              class="close-button red-cross-btn"
              @click="onClose"
            />
          </div>
          <div v-if="!hideBody" class="modal-body">
            <slot name="body" />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import Close from "vue-material-design-icons/CloseThick";
export default {
  name: "FullScreenModal",
  components: {
    Close,
  },
  props: {
    closeOnClickOutside: {
      type: Boolean,
      default: false,
    },
    hideBody: {
      type: Boolean,
      default: false,
    },
    hideCloseButton: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    onClickOutside() {
      if (this.closeOnClickOutside) this.onClose();
    },
    onClose() {
      this.$emit("close-modal");
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: transparent !important;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.3s ease;
}

.modal-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: center;
  align-items: center;
}

.modal-container {
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  width: 100% !important;
  height: 100% !important;
  // border-radius: 20px !important;
}

.close-button {
  z-index: 99999;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}

.modal-body {
  overscroll-behavior: contain;
  padding: 50px;
  height: 100% !important;
  width: 100% !important;
}
</style>
