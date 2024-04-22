<template>
  <section class="container-fluid">
    <article class="w-100">
      <div class="d-flex justify-content-between py-4">
        <h3 class="w-100">Permission Groups - Create</h3>
      </div>
      <div class="d-flex mt-3">
        <div>
          <span
            :class="[isTab('permissions') ? 'bg-light rounded fw-bold' : '']"
            class="p-3 text-dark cursor-pointer border"
            @click.prevent="setTab('permissions')"
            >Permissions</span
          >
        </div>
        <div>
          <span
            :class="[isTab('users') ? 'bg-light rounded fw-bold' : '']"
            class="p-3 text-dark cursor-pointer border"
            @click.prevent="setTab('users')"
            >Users</span
          >
        </div>
      </div>
      <div class="py-3">
        <CreateEditPermissionGroup
          mode="create"
          :tab="tab"
          @on-save="createPermissionGroup"
          @on-change="hasChanged = true"
        />
      </div>
    </article>
  </section>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import { createPermGroup } from "@/services/haService";
import CreateEditPermissionGroup from "@/components/HA/PermissionGroups/CreateEditPermissionGroup";

export default {
  name: "PermissionGroupsCreate",

  components: { CreateEditPermissionGroup },

  mixins: [toastMixin],

  beforeRouteLeave(to, from, next) {
    if (this.hasChanged)
      if (
        !window.confirm(
          "All editing will be discarded. Are you sure you want to leave?"
        )
      ) {
        return;
      }
    next();
  },
  data() {
    return {
      tab: "permissions",
      hasChanged: false,
    };
  },
  methods: {
    async createPermissionGroup(data) {
      let response = await createPermGroup(data);

      if (response.error) return this.$displayServerResponse(response);

      this.$displayServerResponse(response);

      this.hasChanged = false;
      this.$router.push({ name: "ha-permission-groups" });
    },

    isTab(menuItem) {
      return this.tab === menuItem;
    },

    setTab(menuItem) {
      this.tab = menuItem;
    },
  },
};
</script>
