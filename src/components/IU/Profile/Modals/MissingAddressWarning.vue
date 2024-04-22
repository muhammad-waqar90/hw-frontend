<template>
  <portal to="out-of-app-content">
    <WarningModal
      :with-confirmation-buttons="true"
      :only-confirm="true"
      @on-confirm="$emit('on-click')"
    >
      <span slot="body">
        {{ modalTitle }}
      </span>
    </WarningModal>
  </portal>
</template>

<script>
import WarningModal from "@/components/Misc/WarningModal";

export default {
  props: {
    modalTitle: {
      type: String,
    },
  },
  components: {
    WarningModal,
  },
};
</script>
