<template>
  <div>
    <div v-if="overlay" class="modal-overlay" @click="onClickOutside" />
    <div class="shadow-lg modal-inner">
      <div
        class="position-relative modal-content bg-light overflow-hidden shadow-lg border-0"
        :style="{ 'min-width': minWidth }"
        data-cy="modal"
      >
        <div
          class="row mx-0"
          :class="{ 'overflow-y-auto': overflow }"
          :style="{ 'min-height': minHeight, 'line-height': minHeight }"
        >
          <div class="col-1 px-1 count">
            {{ count }}
          </div>
          <div class="col-10">
            <slot />
          </div>
          <div class="col-1 cross">
            <span class="cursor-pointer" @click="close">
              <close :size="20" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SlotHelpers from "@/mixins/Misc/SlotHelpers";
import Close from "vue-material-design-icons/CloseThick";

export default {
  name: "ActionModal",
  components: { Close },
  mixins: [SlotHelpers],
  props: {
    minWidth: {
      type: String,
      default: "40vw",
    },
    minHeight: {
      type: String,
      default: "4.5vw",
    },
    overflow: {
      type: Boolean,
      default: true,
    },
    closeOnClickOutside: {
      type: Boolean,
      default: true,
    },
    overlay: {
      type: Boolean,
      default: true,
    },
    count: {
      type: Number,
      default: 0,
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
      }, 5);
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
  position: fixed;
  left: 55%;
  top: 90%;
  transform: translate(-50%, -50%);
  transition: transform 30s;
  .modal-content {
    width: 100%;
    max-width: 42rem;
    min-width: 50vw;
    border-radius: 5px;
  }
}
.count {
  color: #fff;
  font-size: 27px;
  text-align: center;
  background-color: #1982ef;
}
.cross {
  color: #21252996;
  text-align: center;
  border-left: 1px solid #21252996;
}
.cross:hover {
  color: black;
}
</style>
