<template>
  <div
    class="flex-shrink-1 rounded-card button text-center text-uppercase py-1 px-4"
    :class="$isPhone ? 'col-0' : 'col-4'"
  >
    <span>
      {{ $t("iu.faqs.seeFullAnswer") }}
    </span>
  </div>
</template>

<script>
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  mixins: [devicesMixin],
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";

.button {
  background: $blue;
  color: $static-white;
  font-size: 12px;
  font-weight: 700;
}
</style>
