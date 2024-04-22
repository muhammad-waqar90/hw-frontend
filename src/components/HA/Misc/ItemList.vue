<template>
  <div>
    <div class="form-group">
      <label>{{ title }}</label>
      <div class="position-relative">
        <SearchWithoutButtons :placeholder="title" @on-search="getItems" />
      </div>
    </div>
    <div v-if="items.length" class="itemList mt-5 py-3 border rounded bg-light">
      <div v-for="item in items" :key="item.id" class="d-flex">
        <div class="py-2 px-4 text-dark d-flex justify-content-between w-100">
          <span>
            {{ item.name }}
            <span v-if="tab === 'users'">
              ({{ item.admin_profile?.email }})
            </span>
            <Information
              v-if="tab === 'permissions'"
              :size="25"
              class="cursor-pointer text-primary"
              :title="getDescription(item)"
            />
          </span>
          <plus class="cursor-pointer" :size="25" @click="addItem(item)" />
        </div>
        <div />
      </div>
    </div>
    <div v-else class="itemList mt-5 py-3 border rounded bg-light">
      <span
        class="py-2 px-4 text-secondary d-flex justify-content-between w-100"
      >
        List is empty...
      </span>
    </div>
  </div>
</template>

<script>
import SearchWithoutButtons from "@/components/Misc/Admin/SearchWithoutButtons.vue";
import Plus from "vue-material-design-icons/Plus";
import Information from "vue-material-design-icons/Information";
export default {
  name: "ListGroup",

  components: {
    Plus,
    SearchWithoutButtons,
    Information,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    items: {
      type: [Object, Array],
      default: () => {},
    },
    tab: "",
  },
  methods: {
    addItem(item) {
      this.$emit("add-item", item);
    },
    getItems(text) {
      this.$emit("get-items", text);
    },
    getDescription(item) {
      return `${item.description} \n\n${item.related_permissions}`;
    },
  },
};
</script>

<style scoped>
.itemList {
  height: 500px;
  overflow-y: auto;
}
</style>
