<template>
  <div class="h-100 w-100 position-relative text-dark-gray">
    <div class="col-12">
      <h4 class="mb-0 text-lg-start text-capitalize text-center color-gray">
        {{ $t("gu.openNewSupportTicket") }}
      </h4>
    </div>
    <hr />
    <div class="form-group">
      <label class="font-weight-600 mb-1 text-dark-gray">
        {{ $t("gu.ticketSubject") }}
      </label>
      <div>
        <div class="d-flex position-relative">
          <select
            v-model="selectedSubject"
            class="col form-field select-field cursor-pointer"
            type="text"
          >
            <option disabled hidden :value="null" :class="'text-dark-gray'">
              {{ $t("gu.ticketSubject") }}
            </option>
            <option
              v-for="(option, index) in ticketSubjects"
              :key="index"
              :value="option"
              :class="'text-dark-gray'"
            >
              {{ option.name }}
            </option>
          </select>
          <div
            class="d-flex position-absolute justify-content-center align-items-center select-arrows-icon"
          >
            <ChevronDownIcon :size="22" />
          </div>
        </div>
      </div>
    </div>
    <div v-if="selectedSubject">
      <div class="instructions my-2">
        <span v-html="instructions" />
      </div>
      <div v-if="mode === 'guest'" class="form-group mt-2 mt-lg-4">
        <label class="font-weight-600 mb-1 text-dark-gray">
          {{ $t("gu.email") }}
        </label>
        <input
          v-model="email"
          type="email"
          required
          class="form-control"
          :class="[{ 'border border-danger': $v.email.$error }]"
          :placeholder="$t('gu.emailPlaceholder')"
          :disabled="loadingTicket"
        />
        <template v-if="$v.email.$dirty">
          <div v-if="!$v.email.required" class="text-danger mt-1">
            <span>{{ $t("errors.requiredFields") }}</span>
          </div>
          <div v-if="!$v.email.email" class="text-danger mt-1">
            <span>{{ $t("gu.emailNotValid") }}</span>
          </div>
        </template>
      </div>
      <div class="mt-4 position-relative">
        <div class="form-group">
          <label class="font-weight-600 mb-1 text-dark-gray">{{
            $t("gu.ticketDescription")
          }}</label>
          <textarea
            id="textarea-scroll"
            v-model.trim.lazy="message"
            required
            class="form-control rounded-card scrollbar-blue"
            :class="[{ 'border border-danger': $v.message.$error }]"
            :placeholder="$t('gu.ticketDescription')"
            minlength="5"
            rows="5"
            :disabled="loadingTicket"
          />
          <template v-if="$v.message.$dirty">
            <div v-if="!$v.message.minLength" class="text-danger mt-1">
              <span>{{ $t("gu.textMinLength", { minLength: "5" }) }}</span>
            </div>
            <div v-else-if="!$v.message.maxLength" class="text-danger mt-1">
              <span>{{ $t("gu.textLengthWarning") + maxWords }}</span>
            </div>
            <div v-else-if="!$v.message.required" class="text-danger mt-1">
              <span>{{ $t("errors.requiredFields") }}</span>
            </div>
            <div
              v-else-if="!$v.message.isSanitizeInput"
              class="text-danger mt-1"
            >
              <span>{{ $t("errors.invalidFields") }}</span>
            </div>
          </template>
        </div>
      </div>
      <div class="mt-4">
        <label class="font-weight-600 mb-1 text-dark-gray">
          {{ $t("iu.uploadScreenshots.uploadScreenshots") }}
        </label>
        <UploadScreenshots @get-images="getImages" />
      </div>
      <div
        v-if="mode === 'guest'"
        class="d-flex guestButtons justify-content-between mb-0 mb-lg-2"
      >
        <button
          class="btn backButton text-white d-block px-4 px-lg-5 py-2 mt-md-4"
          @click="$router.go(-1)"
        >
          {{ $t("gu.back") }}
        </button>
        <ButtonWithLoading
          class="btn blue-btn d-block px-4 px-lg-5 py-2 mt-md-4"
          :loading="loading"
          :disabled="$v.$dirty && $v.$error"
          @action="submitTicket"
        >
          {{ $t("gu.send") }}
        </ButtonWithLoading>
      </div>
      <div
        v-else
        class="iu-create-ticket-submit"
        :class="{ 'small-iu-create-ticket-submit': $isPhone }"
      >
        <hr />
        <ButtonWithLoading
          class="btn blue-btn text-uppercase rounded-card float-right small-text px-4"
          :class="{
            'enabled ': !loading,
            'disabled ': loading,
            'h-40': $isPhone,
          }"
          :loading="loading"
          :disabled="$v.$dirty && $v.$error"
          @action="submitTicket"
        >
          {{ $t("gu.submit") }}
        </ButtonWithLoading>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading";
import ChevronDownIcon from "vue-material-design-icons/ChevronDown";
import UploadScreenshots from "@/components/Ticket/UploadScreenshots";

import { getTicketSubject as getTicketSubjectGuest } from "@/services/GU/guTicketsService";
import { getTicketSubject as getTicketSubjectUser } from "@/services/IU/iuTicketService";
import devicesMixin from "@/mixins/Misc/devicesMixin";
import { validationMixin } from "vuelidate";
import dompurifyMixin from "@/mixins/dompurifyMixin";
import {
  required,
  minLength,
  maxLength,
  email,
} from "vuelidate/lib/validators";

export default {
  name: "CreateTicket",

  components: { ButtonWithLoading, ChevronDownIcon, UploadScreenshots },

  mixins: [devicesMixin, validationMixin, dompurifyMixin],

  props: {
    mode: {
      type: String,
      default: "guest",
    },
    ticketSubjects: {
      type: Array,
      default: () => {},
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      selectedSubject: null,
      maxWords: 4000,
      email: null,
      message: null,
      instructions: "",
      ticketSubject: null,
      dataChanged: false,
      uploadedImages: [],
      loadingTicket: false,
    };
  },

  validations() {
    if (this.mode == "guest") {
      return {
        email: {
          required,
          email,
        },
        message: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(4000),
          isSanitizeInput: function (value) {
            return this.sanitizeWithBusinesslogic(value);
          },
        },
      };
    } else {
      return {
        message: {
          required,
          minLength: minLength(5),
          maxLength: maxLength(4000),
          isSanitizeInput: function (value) {
            return this.sanitizeWithBusinesslogic(value);
          },
        },
      };
    }
  },

  computed: {
    getTicketSubjectService() {
      if (this.mode == "guest") return getTicketSubjectGuest;
      else return getTicketSubjectUser;
    },
  },

  watch: {
    selectedSubject() {
      this.getTicketSubject();
    },
    message: {
      handler() {
        this.$emit("set-data-changed", this.message != "");
      },
      deep: true,
    },
  },
  mounted() {
    if (this.$route.query.createSystemTicket) {
      this.selectedSubject = this.ticketSubjects.find(
        (x) => x.name === "System" || x.name === "Other"
      );
    }
  },
  methods: {
    async getTicketSubject() {
      if (!this.selectedSubject) return;

      this.ticketSubject = this.selectedSubject.id;

      if (this.selectedSubject.id === 0)
        return (this.instructions = this.selectedSubject.desc);

      this.loadingTicket = true;
      const response = await this.getTicketSubjectService(
        this.selectedSubject.id
      );
      this.loadingTicket = false;

      if (response.error) return this.$displayServerResponse(response);

      this.instructions = response.desc;
    },

    getImages(images) {
      this.uploadedImages = images;
    },

    submitTicket() {
      this.$v.$touch();
      if (this.$v.$error) return;
      this.$v.$reset();

      this.$emit("set-data-changed", false);

      let formData = new FormData();
      formData.append("email", this.email);
      formData.append("message", this.message);
      formData.append("log[]", new Array());
      formData.append("subjectId", this.selectedSubject.id);
      for (let i = 0; i < this.uploadedImages.length; i++) {
        formData.append("assets[]", this.uploadedImages[i]);
      }

      this.$emit("on-save", formData);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "~vue-select/dist/vue-select.css";
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/shared/profileForm.scss";

.guestButtons {
  button {
    border-radius: 20px;
    font-size: 20px;
    &.backButton {
      background: #f2a000;
    }
  }
}
textarea {
  resize: none;
}

.enabled {
  pointer-events: auto;
}

.disabled {
  pointer-events: none;
}

#textarea-scroll::-webkit-scrollbar-track {
  margin: 16px 0px;
}

.iu-create-ticket-submit {
  margin-top: 70px;
  position: relative;
  bottom: 30px;
  width: 100%;
}
.small-iu-create-ticket-submit {
  position: absolute;
  bottom: 40px;
}

.small-text {
  font-size: 14px;
}

@media (max-width: $tabletWidth) {
  .list-group {
    height: 66px;
    overflow: auto;
    .list-group-item {
      padding: 0.4rem 1.25rem 0;
      p {
        margin-bottom: 0.3rem;
      }
    }
  }
  textarea {
    margin-bottom: 35px;
  }
  .guestButtons {
    bottom: 0;
    left: 0;
    width: 100%;
    button {
      font-size: 17px;
    }
  }
}

// very small phone compatibility
@media (max-height: 660px) {
  textarea {
    margin-bottom: 0;
  }
}

.instructions {
  text-align: center;
  span {
    color: $darkgray;
    font-size: 15px;
  }
}

.form-control {
  background: $lightgray !important;
  color: $darkgray;
  border: none;
}
.form-control:focus {
  box-shadow: none;
}

.select-field {
  box-sizing: border-box;
  font-size: 14px;
  -webkit-appearance: none;
}

.select-arrows-icon {
  @extend .input-icon;
  right: 0;
  background-color: $orange;
  border-radius: 0 20px 20px 0;
  padding-left: 0.5em;
  padding-right: 0.5em;
}

.float-right {
  float: right;
}
</style>
