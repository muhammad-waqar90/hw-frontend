<template>
  <div class="position-relative">
    <div v-if="list.length == 0">
      <CartEmpty />
    </div>
    <template v-else>
      <div v-for="item in list" :key="item.type + item.id" class="mt-3">
        <CartItem
          :item="item"
          @remove-item="removeItem"
          @remove-child="removeChild"
          @remove-e-notes="removeEnotes"
        />
      </div>
    </template>
  </div>
</template>

<script>
import CartItem from "@/components/IU/Cart/CartItem";
import CartEmpty from "@/components/IU/Cart/CartEmpty";

export default {
  components: {
    CartItem,
    CartEmpty,
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
  },
  methods: {
    removeItem(item) {
      this.$emit("remove-item", item);
    },
    removeChild(item) {
      this.$emit("remove-child", item);
    },
    removeEnotes(item) {
      this.$emit("remove-e-notes", item);
    },
  },
};
</script>
