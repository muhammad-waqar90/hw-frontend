<template>
  <div>
    <h5>
      {{ isSubCategory ? "Faqs" : "Subcategories" }} belonging to this category:
    </h5>
    <ul v-if="list.length" class="py-3 bg-secondary text-white">
      <li v-for="item in list" :key="item.id" class="mt-2">
        {{ item.name ? item.name : item.question }}
      </li>
    </ul>
    <h5 v-else class="text-center py-3 bg-secondary text-white">
      No items found!
    </h5>
  </div>
</template>

<script>
export default {
  props: {
    list: {
      type: Array,
    },
    isSubCategory: {
      type: Boolean,
    },
  },
};
</script>
