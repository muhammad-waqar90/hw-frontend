<template>
  <div class="row">
    <div
      class="d-flex flex-wrap input-container overflow-hidden"
      @click="focusInput"
    >
      <input
        ref="inputWithFiles"
        :placeholder="$t('iu.ticket.writeMessage')"
        :value="modelValue"
        type="text"
        class="flex-input col-12 mb-2"
        :size="modelValue.length + 1"
        @input="$emit('update:modelValue', $event.target.value)"
      />
      <template v-if="fileNames.length">
        <div
          v-for="(name, index) in fileNames"
          :key="index"
          class="file-bubble col-auto"
        >
          <span class="cursor-pointer" @click.stop="openImage(index)">{{
            shortenText(name, 12)
          }}</span>
          <Close
            :size="16"
            class="cursor-pointer"
            @click.stop="deleteImage(index)"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/Close";
import { shortenText } from "@/utils/stringUtils";

export default {
  name: "InputWithFilesList",
  components: { Close },
  props: ["modelValue", "fileNames"],
  emits: ["update:modelValue", "setDeleteIndex", "setOpenIndex"],
  data() {
    return {};
  },
  watch: {
    fileNames() {
      this.$refs.inputWithFiles.focus();
    },
  },
  mounted() {
    this.$refs.inputWithFiles.focus();
  },
  methods: {
    deleteImage(index) {
      this.$emit("set-delete-index", index);
    },
    openImage(index) {
      this.$emit("set-open-index", index);
    },
    focusInput() {
      this.$refs.inputWithFiles.focus();
    },
    shortenText,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.input-container {
  min-height: 60px;
  overflow-y: scroll;
  max-width: 100%;
}
.file-bubble {
  border-radius: 5px;
  background-color: $offwhite;
  padding: 2px 8px;
  margin: 2px;
  height: 28px;
}
.flex-input {
  border: none !important;
  display: block;
  min-width: 0;
  max-width: 350px;
  height: 28px;
}
.flex-input:focus {
  box-shadow: none !important;
  outline: none !important;
}
</style>
