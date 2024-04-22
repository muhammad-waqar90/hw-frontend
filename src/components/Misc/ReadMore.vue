<template>
  <div>
    <p class="readmore" :class="classList">
      <span v-html="toggled ? text : truncatedText" />
      <span
        class="truncate font-weight-600 text-blue cursor-pointer"
        @click="toggle"
      >
        {{ toggled ? lessText : moreText }}
      </span>
    </p>
  </div>
</template>

<script>
export default {
  name: "ReadMore",
  props: {
    text: { type: String, required: true },
    limit: { type: Number, default: 255 },
    moreText: { type: String, default: "Show more" },
    lessText: { type: String, default: "Show less" },
    classList: { type: String, default: "" },
  },
  data() {
    return { toggled: false };
  },
  computed: {
    truncatedText() {
      if (this.text.length < this.limit) {
        return this.text;
      } else {
        for (let i = this.limit; i > 0; i--) {
          const currChar = this.text.charAt(i);
          const prevChar = this.text.charAt(i - 1);
          const prevCharNotPunc = [",", ";", "."].some((c) => c !== prevChar);
          if (currChar === " " && prevCharNotPunc) {
            return `${this.text.substring(0, i)}...`;
          }
        }
      }
      return "";
    },
  },
  methods: {
    toggle() {
      this.toggled = !this.toggled;
    },
  },
};
</script>
