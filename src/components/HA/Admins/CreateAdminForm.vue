<template>
  <div>
    <form class="w-100" @submit.prevent="onSubmit">
      <div class="form-group">
        <label>Name</label>
        <input
          v-model="firstName"
          type="text"
          class="form-control"
          placeholder="Enter name"
          required
          :class="{
            'is-invalid': !$v.firstName.$error,
          }"
        />
      </div>
      <div class="form-group">
        <label>Last Name</label>
        <input
          v-model="lastName"
          type="text"
          class="form-control"
          placeholder="Enter name"
          required
          :class="{
            'is-invalid': $v.lastName.$error,
          }"
        />
      </div>
      <div class="form-group">
        <label>Email address</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          placeholder="Enter email"
          required
          :class="{ 'is-invalid': !$v.email.required }"
        />
      </div>
      <!-- <div
        class="px-5 py-3 bg-light w-100 d-flex items-center justify-content-end rounded w-100 mt-5"
      >
        <button
          class="btn btn-light border me-4"
          type="button"
          @click="onCancel"
        >
          Cancel
        </button>
        <button class="btn blue-btn" type="submit">
          Create
        </button>
      </div> -->
      <ConfirmationButtons @on-cancel="onCancel" />
    </form>
  </div>
</template>

<script>
import ConfirmationButtons from "@/components/Misc/Admin/ConfirmationButtons.vue";
import { required, email } from "vuelidate/lib/validators";
export default {
  components: {
    ConfirmationButtons,
  },
  data() {
    return {
      firstName: "",
      lastName: "",
      email: "",
    };
  },
  validations: {
    firstName: {
      required,
      isSanitized: (value) => this.sanitizeInput(value),
    },
    lastName: {
      required,
      isSanitized: (value) => this.sanitizeInput(value),
    },
    email: {
      required,
      email,
    },
  },
  methods: {
    onCancel() {
      this.$emit("on-cancel");
    },
    onSubmit() {
      if (this.$v.$invalid) {
        // Form is not valid
        return;
      }
      const data = {
        first_name: this.firstName,
        last_name: this.lastName,
        email: this.email,
        permGroupIds: [],
      };
      this.$emit("on-submit", data);
    },
  },
};
</script>
<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.form-control {
  height: 38px;
  width: 100%;
  border-radius: 0;
  padding: 0.375rem 0.75rem;
}

.is-invalid {
  border-color: $red !important;
}
</style>
