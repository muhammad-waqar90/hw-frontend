<template>
  <div>
    <div class="form-group position-relative">
      <label>{{ title }}</label>
      <div
        v-if="selectedItems.length"
        class="itemList mt-2 py-3 border rounded bg-light"
      >
        <div v-for="item in selectedItems" :key="item.id" class="d-flex">
          <div class="py-2 px-4 text-dark d-flex justify-content-between w-100">
            <span>
              {{ item.name }}
              <span v-if="tab === 'users'">
                ({{ item.admin_profile.email }})
              </span>
              <Information
                v-if="tab === 'permissions'"
                :size="25"
                class="cursor-pointer text-primary"
                :title="getDescription(item)"
              />
            </span>
            <trash-can
              class="cursor-pointer"
              :size="25"
              @click="removeItem(item)"
            />
          </div>
        </div>
      </div>
      <div v-else class="itemList mt-2 py-3 border rounded bg-light">
        <div class="d-flex">
          <div class="py-2 px-4 text-secondary">
            <span>
              {{ emptyText }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TrashCan from "vue-material-design-icons/TrashCan";
import Information from "vue-material-design-icons/Information";

export default {
  name: "SelectedGroup",

  components: {
    TrashCan,
    Information,
  },

  props: {
    title: {
      type: String,
      required: true,
    },
    selectedItems: {
      type: [Object, Array],
      default: () => {},
    },
    emptyText: {
      type: String,
    },
    tab: "",
  },

  methods: {
    removeItem(item) {
      this.$emit("remove-item", item);
    },
    getDescription(item) {
      return `${item.description} \n\n${item.related_permissions}`;
    },
  },
};
</script>

<style scoped>
.itemList {
  height: 190px;
  overflow-y: auto;
}
</style>
