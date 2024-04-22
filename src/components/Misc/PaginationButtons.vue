<template>
  <div class="d-flex mt-4 justify-content-center align-items-center">
    <div
      v-if="loading && !links.length"
      class="d-flex col-12 justify-content-center"
    >
      <div class="animated-loading-background loading-button mx-1" />
      <div class="animated-loading-background loading-button mx-1" />
      <div class="animated-loading-background loading-button mx-1" />
    </div>
    <div v-for="(link, index) in links" :key="index">
      <router-link
        v-slot="{ navigate }"
        :to="link.url || ''"
        :disabled="link.active || !link.url"
        custom
        class="btn btn-gray mx-1 text-white"
        :class="[
          link.active
            ? 'bg-primary text-light'
            : !link.url
            ? 'disabled-btn'
            : 'btn-light',
          index == 0 || index == links.length - 1 ? 'edge-btn' : '',
        ]"
      >
        <button role="link" @click="navigate" @keypress.enter="navigate">
          <span v-if="!isNaN(link.label)">
            {{ link.label }}
          </span>
          <span v-else>
            <ChevronLeft v-if="link.label == '&laquo; Previous'" />
            <ChevronRight v-if="link.label == 'Next &raquo;'" />
          </span>
        </button>
      </router-link>
    </div>
  </div>
</template>

<script>
import ChevronLeft from "vue-material-design-icons/ChevronLeft";
import ChevronRight from "vue-material-design-icons/ChevronRight";

export default {
  components: {
    ChevronLeft,
    ChevronRight,
  },
  props: {
    links: {
      type: Array,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.text-blue {
  color: $blue;
}
.bg-primary:hover {
  background-color: #007bff !important;
}
.edge-btn {
  padding: 0;
}
.btn-gray {
  background: #dcdcdc;
  border: none;
}
.btn-gray:hover {
  background: #cecece;
}
.disabled-btn {
  background: #cecece !important;
}
.link-icon {
  padding: 6px 8px;
}
.loading-button {
  height: 36px;
  width: 32px;
}
</style>
