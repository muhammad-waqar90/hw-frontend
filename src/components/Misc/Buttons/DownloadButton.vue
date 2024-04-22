<template>
  <button
    class="btn text-uppercase rounded-pill shadow-sm position-relative px-3 py-3"
    :class="[isNightMode ? 'black-btn' : 'white-btn']"
    @click="$emit('on-click')"
  >
    <span class="me-3">
      <DownloadIcon />
    </span>
    <span class="me-3"> {{ $t("general.download") }} </span>
  </button>
</template>

<script>
import DownloadIcon from "vue-material-design-icons/Download";
import { mapGetters } from "vuex";

export default {
  components: {
    DownloadIcon,
  },
  props: {
    fullWidth: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      isNightMode: "theme/isNightMode",
    }),
  },
};
</script>
