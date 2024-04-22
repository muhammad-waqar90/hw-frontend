<template>
  <div>
    <template v-if="$isMobile">
      <MobileBackButton @on-back="onBack">
        <template #buttons>
          <slot name="buttons" />
        </template>
      </MobileBackButton>
    </template>
    <template v-else>
      <portal v-if="!$userIsGU" to="top-nav-left">
        <BackButton @on-back="onBack" />
      </portal>
      <BackButton v-else class="mb-3" @on-back="onBack" />
    </template>
  </div>
</template>

<script>
import BackButton from "@/components/Misc/BackButtons/BackButton";
import MobileBackButton from "@/components/Misc/BackButtons/MobileBackButton";

import devicesMixin from "@/mixins/Misc/devicesMixin";
import userRoleMixin from "@/mixins/User/userRoleMixin";
export default {
  components: {
    BackButton,
    MobileBackButton,
  },
  mixins: [devicesMixin, userRoleMixin],
  methods: {
    onBack() {
      this.$emit("on-back");
    },
  },
};
</script>
