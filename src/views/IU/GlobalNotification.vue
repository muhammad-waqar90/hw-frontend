<template>
  <div>
    <div v-if="display404">
      <SomethingWrong />
    </div>
    <div v-else>
      <div
        v-if="item.id"
        class="rounded-card pt-3 pb-5 bg-white text-dark-gray px-4"
      >
        <h4>
          {{ capitalizeFirstLetter(item.title) }}
        </h4>
        <hr />
        <div class="mt-3" v-html="item.body" />
      </div>
      <div v-else>
        <LoadingSpecificGlobalNotification />
      </div>
    </div>
  </div>
</template>

<script>
import SomethingWrong from "@/views/SomethingWrong";
import LoadingSpecificGlobalNotification from "@/components/IU/GlobalNotification/LoadingSpecificGlobalNotification.vue";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { getSpecificGlobalNotification } from "@/services/IU/iuGlobalNotificationService";
import { capitalizeFirstLetter } from "@/utils/stringUtils";

export default {
  name: "GlobalNotification",
  components: {
    SomethingWrong,
    LoadingSpecificGlobalNotification,
  },
  mixins: [devicesMixin],
  data() {
    return {
      item: {},
      display404: false,
    };
  },
  watch: {
    $route() {
      this.init();
    },
  },
  mounted() {
    this.init();
  },
  methods: {
    async init() {
      const response = await getSpecificGlobalNotification(
        this.$route.params.id
      );
      if (response.status === 404) return (this.display404 = true);

      this.item = response;
    },
    capitalizeFirstLetter,
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.title {
  color: $blue;
  font-size: 16px;
  font-weight: 600;
}
</style>
