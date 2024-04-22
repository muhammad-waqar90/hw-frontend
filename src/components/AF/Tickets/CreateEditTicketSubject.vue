<template>
  <div class="my-2 d-flex justify-content-between">
    <div class="w-100">
      <div class="row my-2">
        <div class="col-md-6 col-sm-12">
          <form @submit.prevent="onSubmit">
            <div class="mb-3">
              <label>Category:</label>
              <div class="position-relative">
                <select
                  v-model.trim.lazy="$v.category.$model"
                  class="form-select"
                  :class="{ 'is-invalid': $v.category.$error }"
                >
                  <option :value="null" disabled selected hidden>
                    Select category...
                  </option>
                  <option
                    v-for="ticketCategory in ticketCategories"
                    :key="ticketCategory.id"
                    :value="ticketCategory.id"
                  >
                    {{ ticketCategory.name }}
                  </option>
                </select>
              </div>
            </div>
            <div class="mb-3">
              <label>Name (min:4, max:100):</label>
              <div class="position-relative">
                <input
                  v-model.trim.lazy="$v.name.$model"
                  type="text"
                  required
                  class="form-control w-100"
                  placeholder="Name"
                  :class="{ 'is-invalid': $v.name.$error }"
                />
              </div>
            </div>
            <div class="mb-3">
              <label>Description:</label>
              <div>
                <GeneralCkEditor
                  v-if="hasInitialized"
                  :initial-text="description"
                  @note-input="noteInput"
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="cursor-pointer"
                >Only Logged In Users:
                <input
                  v-model.trim.lazy="$v.onlyLoggedIn.$model"
                  type="checkbox"
                  class="form-check-input ms-4"
                  :class="{
                    'is-invalid': $v.onlyLoggedIn.$error,
                  }"
                />
              </label>
            </div>

            <div v-if="mode === 'create'" class="text-center mt-5 px-2">
              <button class="btn blue-btn" type="submit" :disabled="!isDirty">
                Create
              </button>
            </div>
            <div v-if="mode === 'edit'" class="row mt-5 px-2">
              <div class="col-6">
                <button
                  class="btn btn-danger"
                  type="button"
                  @click="startDeletingTicket"
                >
                  Delete
                </button>
              </div>
              <div class="col-6 text-end">
                <button class="btn blue-btn" type="submit" :disabled="!isDirty">
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getTicketCategories } from "@/services/AF/afTicketService";
import { validationMixin } from "vuelidate";
import toastMixin from "@/mixins/toastMixin";
import GeneralCkEditor from "@/components/Misc/GeneralCkEditor";
import {
  required,
  minLength,
  maxLength,
  integer,
} from "vuelidate/lib/validators";
import dompurifyMixin from "@/mixins/dompurifyMixin";

export default {
  name: "CreateEditTicketSubjects",

  components: { GeneralCkEditor },

  mixins: [toastMixin, validationMixin, dompurifyMixin],

  props: {
    ticket: {
      type: Object,
      default: () => {},
    },

    mode: {
      type: String,
      default: "create",
    },
  },

  validations: {
    name: {
      required,
      minLength: minLength(4),
      maxLength: maxLength(100),
      isSanitizeInput: function (value) {
        return this.sanitizeInput(value);
      },
    },
    category: {
      required,
      integer,
    },
    onlyLoggedIn: {
      required,
    },
  },

  data() {
    return {
      ticketSubject: {},
      hasInitialized: false,
      ticketCategories: [],
      name: "",
      description: "",
      category: null,
      onlyLoggedIn: false,
      isDescriptionChanged: false,
    };
  },

  computed: {
    ticketSubjectData() {
      return this.ticket;
    },
    isDirty() {
      return this.$v.$anyDirty || this.isDescriptionChanged;
    },
  },

  watch: {
    name() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    description() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    category() {
      if (this.hasInitialized) this.$emit("on-change");
    },
    onlyLoggedIn() {
      if (this.hasInitialized) this.$emit("on-change");
    },
  },

  mounted() {
    if (this.mode == "edit") this.mapData();
    this.init();
  },

  methods: {
    async init() {
      await this.getTicketCategories();
      this.hasInitialized = true;
    },

    noteInput(text) {
      this.description = text;
      this.isDescriptionChanged = true;
    },

    onSubmit() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      const data = {
        name: this.name,
        desc: this.description,
        categoryId: this.category,
        only_logged_in: this.onlyLoggedIn ? 1 : 0,
      };

      this.$emit("on-save", data);
    },

    startDeletingTicket() {
      this.$emit("on-delete", this.ticketSubjectData);
    },

    mapData() {
      this.name = this.ticketSubjectData.name;
      this.description = this.ticketSubjectData.desc;
      this.category = this.ticketSubjectData.ticket_category_id;
      this.onlyLoggedIn = this.ticketSubjectData.only_logged_in_users;
    },

    async getTicketCategories() {
      const response = await getTicketCategories();

      if (response.error) return this.$displayServerResponse(response);

      this.ticketCategories = response;
    },
  },
};
</script>

<style lang="scss" scoped>
input[type="checkbox"] {
  transform: scale(1.5);
}

div.is-invalid {
  border: 1px solid #dc3545;
}
</style>
