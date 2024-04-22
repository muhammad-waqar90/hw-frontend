<template>
  <div class="w-100 async-vue-select-outer">
    <v-select
      label="name"
      class="h-100"
      :class="selectCustomStyleClass"
      :placeholder="'Search by ' + label"
      :multiple="multiple"
      :filterable="filterable"
      :options="options"
      :value="selectedItem"
      :disabled="disabled"
      @search="onSearch"
      @input="onChange"
    >
      <template slot="no-options"> type {{ label }} name </template>

      <template slot="option" slot-scope="option">
        {{ option.name }}
      </template>

      <template slot="selected-option" slot-scope="option">
        {{ option.name }}
      </template>
    </v-select>
  </div>
</template>

<script>
import { debounce } from "lodash";
import VSelect from "vue-select";

export default {
  name: "AsyncVueSelect",
  components: {
    VSelect,
  },
  props: {
    label: {
      type: String,
      default: "",
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    filterable: {
      type: Boolean,
      default: false,
    },
    selectedItem: {
      type: Object,
      default: null,
    },
    service: {
      type: Function,
      default: () => {},
    },
    selectCustomStyleClass: {
      type: String,
      default: "bg-white",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      options: [],
    };
  },

  methods: {
    async onSearch(search, loading) {
      if (search.length) {
        loading(true);
        this.search(search, loading, this);
      }
    },

    search: debounce(async (search, loading, ctx) => {
      const response = await ctx.service(search);
      if (response.error) this.$displayServerResponse(response);
      ctx.options = response;

      loading(false);
    }, 350),

    onChange(option) {
      // option - selected / deselected
      this.$emit("on-change", option);
    },
  },
};
</script>

<style lang="scss">
@import "~vue-select/src/scss/vue-select.scss";
.async-vue-select-outer {
  height: 38px;
  .v-select {
    border-radius: 0.25rem;
  }
  .vs__dropdown-toggle {
    height: 100%;
  }
}
</style>
