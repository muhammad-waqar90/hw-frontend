<template>
  <div class="row">
    <div class="col-md-12 col-sm-12">
      <div v-if="mode === 'create'" class="text-end mt-3 px-2">
        <ButtonWithLoading
          class="btn blue-btn"
          :loading="isSubmitting"
          :is-submit="true"
        >
          <slot>
            {{ isSubmitting ? "Creating..." : "Create" }}
          </slot>
        </ButtonWithLoading>
      </div>
      <div v-if="mode === 'edit'" class="row mt-5 px-2">
        <div class="col-6">
          <button
            v-if="!disableDelete"
            class="btn btn-danger"
            type="button"
            @click="startDeleting"
          >
            Delete
          </button>
          <ButtonWithTooltip
            v-else
            :disabled="true"
            label="Delete"
            :message="disableDeleteMessage"
            btn-class="btn btn-danger"
          />
        </div>
        <div class="col-6 text-end">
          <ButtonWithLoading
            class="btn blue-btn"
            :loading="isSubmitting"
            :is-submit="true"
          >
            <slot>
              {{ isSubmitting ? "Updating..." : "Update" }}
            </slot>
          </ButtonWithLoading>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonWithTooltip from "@/components/Misc/Admin/ButtonWithTooltip.vue";
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";

export default {
  name: "FormActionButtons",
  components: {
    ButtonWithTooltip,
    ButtonWithLoading,
  },
  props: {
    mode: {
      type: String,
      default: "create",
    },
    isSubmitting: {
      type: Boolean,
      default: false,
    },
    disableDelete: {
      type: Boolean,
      default: false,
    },
    disableDeleteMessage: {
      type: String,
      default: "Not Allowed",
    },
  },
  methods: {
    startDeleting() {
      this.$emit("start-deleting");
    },
  },
};
</script>
