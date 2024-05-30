<template>
  <div
    class="col-12 ticket-status-filter-outer px-0 d-flex justify-content-between"
  >
    <span
      v-for="item in statuses"
      :key="item.value"
      class="item rounded-pill truncate text-uppercase text-center font-weight-500"
      :class="{
        active: item.value === active,
        inactive: item.value !== active && theme == 'day-mode',
        inactiveDark: item.value !== active && theme == 'night-mode',
        'small-item': $isPhone,
      }"
      @click="activate(item)"
    >
      {{ $t(`iu.ticket.${item.name}`) }}
    </span>
  </div>
</template>

<script>
import * as availableStatuses from "@/dataObject/tickets/ticketStatusData";
import { mapGetters } from "vuex";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  mixins: [devicesMixin],
  props: {
    selectedStatus: null,
  },
  data() {
    return {
      statuses: [
        {
          value: null,
          name: "all",
        },
        {
          value: availableStatuses.RESOLVED,
          name: "resolved",
        },
        {
          value: availableStatuses.IN_PROGRESS,
          name: "in_progress",
        },
        {
          value: availableStatuses.UNCLAIMED,
          name: "unclaimed",
        },
      ],
      active: null,
    };
  },
  computed: {
    ...mapGetters({
      theme: "theme/getThemeMode",
    }),
  },
  watch: {
    selectedStatus() {
      this.active = this.selectedStatus;
    },
  },
  mounted() {
    this.active = this.selectedStatus;
  },
  methods: {
    activate(item) {
      if (this.active === item.value) return;
      this.$emit("status-change", item.value);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.ticket-status-filter-outer {
  font-size: 12px;
}
.item {
  cursor: pointer;
  color: $static-white;
  padding: 5px 12px;
  min-width: 60px;
  display: inline-block;
}
.small-item {
  min-width: 45px;
  padding: 5px 8px;
}
.active {
  background: $blue;
}
.inactive {
  background: #d0d4df;
  color: $gray;
}
.inactiveDark {
  background: $lightgray;
  color: $gray;
}

@media (max-width: $laptopWidth) {
  .ticket-status-filter-outer {
    overflow-x: auto;
    overflow-y: hidden;
    white-space: nowrap;
    -webkit-overflow-scrolling: touch;
    justify-content: start !important;
    .item {
      margin-right: 4px;
    }
  }
}
</style>
