export default {
  methods: {
    hasSlot(name) {
      return !!this.$slots[name] || !!this.$scopedSlots[name];
    },
  },
};
