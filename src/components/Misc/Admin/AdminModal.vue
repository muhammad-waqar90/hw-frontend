<template>
  <div>
    <div v-if="overlay" class="modal-overlay" @click="onClickOutside" />
    <div
      class="shadow-lg"
      :class="{
        'modal-right': modalRightFullScreen,
        'modal-inner': !modalRightFullScreen,
        'modal-right--active': modalRightFullScreen,
      }"
      :style="{ position: position }"
    >
      <div
        class="position-relative modal-content bg-light mb-0 px-5 py-5 overflow-hidden shadow-lg"
        :style="{ 'min-height': minHeight, 'min-width': minWidth }"
        data-cy="modal"
      >
        <div
          class="closeButtonContainer position-absolute"
          :class="{
            'close-button-left': modalRightFullScreen,
            'close-button-right': !modalRightFullScreen,
          }"
        >
          <span
            type="button"
            class="text-dark bg-light border-0"
            @click="close"
          >
            <close
              class="input-icon h-100 pt-3 px-2 text-dark d-flex align-items-center justify-content-center"
              :size="20"
            />
          </span>
        </div>

        <div
          class="d-flex align-items-center pb-2 border-bottom border-secondary text-dark"
        >
          <h4 class="text-lg mb-0 text-dark text-capitalize">
            {{ title }}
          </h4>
        </div>

        <div class="d-flex align-items-start">
          <div
            class="d-flex align-items-center justify-content-left w-100 text-start"
          >
            <div
              class="text-dark d-flex w-100 modal-body"
              :class="{ 'overflow-y-auto': overflow }"
            >
              <slot />
            </div>
          </div>
        </div>

        <div
          v-if="hasSlot('footer')"
          class="mt-6 mb-2 w-100 d-flex footer text-dark"
        >
          <slot name="footer" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SlotHelpers from "@/mixins/Misc/SlotHelpers";
import Close from "vue-material-design-icons/CloseThick";

export default {
  name: "Modal",

  components: { Close },

  mixins: [SlotHelpers],

  props: {
    minHeight: {
      type: String,
      default: "inherit",
    },
    minWidth: {
      type: String,
      default: "50vw",
    },
    title: {
      type: String,
      default: "",
    },
    overflow: {
      type: Boolean,
      default: true,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    modalRightFullScreen: {
      type: Boolean,
      default: false,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    position: {
      type: String,
      default: "absolute",
    },
  },

  data() {
    return {
      loaded: false,
    };
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      setTimeout(() => {
        this.loaded = true;
      }, 0);
    },
    close() {
      this.loaded = false;
      this.$emit("close-modal");
    },
    onClickOutside() {
      if (this.closeOnClickOutside) this.close();
    },
  },
};
</script>

<style lang="scss" scoped>
.modal-overlay {
  z-index: 9999;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
}

.modal-inner {
  z-index: 9999;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  .modal-content {
    width: 100%;
    max-width: 42rem;
    min-width: 50vw;

    border-radius: 10px;
  }

  .modal-body {
    max-height: calc(100vh - 250px);
  }

  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .closeButtonContainer {
    top: 5px;
  }
  .close-button-right {
    right: 15px;
  }
}

.modal-right {
  z-index: 9999;
  position: fixed;
  top: 0;
  bottom: 0;
  right: 0;
  width: 50%;
  height: 100%;
  transform: translateX(100%);
  transition: transform 0.5s;
  &.modal-right--active {
    transform: translateX(0);
  }
  .modal-content {
    width: 100%;
    height: 100%;
    max-width: 42rem;
    min-width: 50vw;
  }
  .modal-body {
    max-height: calc(100vh - 250px);
  }
  .footer {
    position: absolute;
    bottom: 0;
    left: 0;
  }
  .closeButtonContainer {
    top: 2px;
  }
  .close-button-left {
    left: 35px;
  }
}

@media (max-width: 768px) {
  .modal-inner {
    width: 100%;
    padding: 10px;
  }
}
</style>
