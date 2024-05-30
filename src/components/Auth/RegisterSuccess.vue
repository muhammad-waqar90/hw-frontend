<template>
  <div class="w-100 wrapper">
    <div class="logoHolder w-100">
      <div class="d-flex justify-content-center my-2 my-md-4">
        <img
          class="logo bg-static-white rounded-card px-3 py-2"
          :src="'/img/logo.png'"
          alt=""
        />
      </div>
      <div class="d-flex justify-content-center">
        <span
          class="h4 p-4 bg-gray rounded-card text-center text-dark-gray"
          :class="{ resendLinkText: resendLink }"
        >
          {{ resendLink ? message : $t("auth.registerSuccessMessage") }}
        </span>
      </div>
      <div v-if="resendLink" class="d-flex justify-content-center mt-3">
        <form
          class="resendParentEmail justify-content-center"
          :class="{ 'row ': $isPhone }"
          @submit.prevent="submit"
        >
          <div
            v-if="!isParentVerified"
            class="form-group"
            :class="$isPhone ? 'col-10' : 'flex-col-first me-3'"
          >
            <div class="container-mt-outline-input mb-1">
              <div class="material-textfield">
                <input
                  v-model.trim.lazy="$v.inputEmail.$model"
                  placeholder=" "
                  :class="{ 'text-red': $v.inputEmail.$error }"
                  type="email"
                />
                <label>{{ $t("auth.parentEmailAddress") }}*</label>
              </div>
            </div>
            <template v-if="$v.inputEmail.$error">
              <small v-if="!$v.inputEmail.required" class="text-danger">
                {{ $t("auth.requiredEmailAddress") }}
              </small>
              <small v-if="!$v.inputEmail.email" class="text-danger">
                {{ $t("auth.emailInvalid") }}
              </small>
            </template>
          </div>
          <div
            class="form-group d-flex justify-content-center"
            :class="{ 'flex-col-second': !isParentVerified }"
          >
            <ButtonWithLoading
              class="btn orange-btn px-5 resendLink"
              :class="$isPhone ? 'fz-14 mt-1' : 'fz-20'"
              :is-submit="true"
              :disabled="shouldDisable"
              :loading="loading"
            >
              {{ $t("auth.resendLink") }}
            </ButtonWithLoading>
          </div>
        </form>
      </div>
    </div>
    <div class="registerBottomGraphics">
      <div class="triangle-left" />
      <div class="triangle-middle" />
      <img class="half-star" src="/img/halfStar.png" alt="" />
    </div>
  </div>
</template>

<script>
import ButtonWithLoading from "@/components/Misc/Buttons/ButtonWithLoading.vue";
import { required, email } from "vuelidate/lib/validators";
import { validationMixin } from "vuelidate";
import devicesMixin from "@/mixins/Misc/devicesMixin";
export default {
  name: "RegisterSuccess",
  components: { ButtonWithLoading },
  mixins: [validationMixin, devicesMixin],
  props: {
    resendLink: {
      type: Boolean,
      default: false,
    },
    usernameProp: {
      type: String,
      default: "",
    },
    isParentVerified: {
      type: Boolean,
      default: false,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  validations() {
    const validation = {
      inputEmail: {
        required,
        email,
      },
    };
    return validation;
  },
  data() {
    return {
      username: "",
      inputEmail: "",
    };
  },
  computed: {
    message() {
      return this.isParentVerified
        ? this.$t("auth.registerResendLinkMessage")
        : this.$t("auth.registerResendParentLinkMessage");
    },
    shouldDisable() {
      if (!this.isParentVerified) {
        return this.$v.$invalid || this.loading;
      }
      return this.loading;
    },
  },
  mounted() {
    this.username = this.usernameProp;
  },
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.$invalid && !this.isParentVerified) return;
      this.$emit("resend-link", this.username, this.inputEmail);
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
@import "@/assets/sass/text.scss";
.bg-gray {
  background-color: $lightgray;
}
.logoHolder {
  .logo {
    width: 200px;
    height: auto;
  }
}
form {
  z-index: 10;
}
.registerBottomGraphics {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 180px;
  background: $orange;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  .triangle-left {
    z-index: 3;
    width: 0;
    height: 0;
    border-top: 391px solid #e59200;
    border-right: 422px solid transparent;
    position: absolute;
    top: 0;
    left: 0;
  }
  .triangle-middle {
    width: 0;
    height: 0;
    border-left: 133px solid transparent;
    border-right: 177px solid transparent;
    border-bottom: 178px solid #dd8d00;
    position: absolute;
    bottom: 0;
    left: 214px;
  }
  .half-star {
    position: absolute;
    left: calc(50% - 150px);
    width: 300px;
    bottom: 0;
    z-index: 4;
  }
}
.container-mt-outline-input {
  align-items: flex-start !important;
  height: fit-content !important;
}
button.resendLink {
  border-radius: 20px;
  font-weight: 600;
  z-index: 100;
}
.fz-20 {
  font-size: 20px;
}
.fz-14 {
  font-size: 14px;
}
.resendLinkText {
  max-width: 773px;
}
@media (max-width: $laptopWidth) {
  .resendLinkText {
    font-size: 25px;
  }
}
@media (max-width: $tabletWidth) {
  .wrapper {
    display: flex;
    align-items: center;
    .resendLinkText {
      font-size: 1rem;
      max-width: 90%;
    }
    .button.resendLink {
      max-width: 100%;
    }
    .registerBottomGraphics {
      display: none;
    }
  }
}
.resendParentEmail {
  display: flex;
  width: 773px;
}
.flex-col-first {
  flex: 2 1 0;
}
.flex-col-second {
  flex: 1 1 0;
}
</style>
