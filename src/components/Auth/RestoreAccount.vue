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
        <span class="h4 p-4 bg-gray rounded-card text-center text-dark-gray">
          {{ $t("auth.restoreAccountMessage") }}
        </span>
      </div>
      <div class="d-flex justify-content-center mt-3">
        <div class="restoreAccountButtons justify-content-center">
          <div :class="{ 'mob-restore-account-buttons': $isPhone }">
            <router-link
              :to="{ name: 'login' }"
              class="btn light-gray-btn mx-2 restoreAccount"
              :class="$isPhone ? 'px-4' : 'px-5'"
            >
              {{ $t("auth.cancel") }}
            </router-link>
            <button
              @click="restoreAccount()"
              class="btn orange-btn mx-2 restoreAccount"
              :class="$isPhone ? 'px-4' : 'px-5'"
            >
              {{ $t("auth.restoreAccount") }}
            </button>
          </div>
        </div>
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
import { accountRestoreService } from "@/services/authService";
import toastMixin from "@/mixins/toastMixin";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  name: "RestoreAccount",
  mixins: [toastMixin, devicesMixin],
  methods: {
    async restoreAccount() {
      const response = await accountRestoreService({
        token: this.$route.params.token,
      });
      this.$displayServerResponse(response);

      if (response.error) {
        this.handleError(response);
        return;
      }

      this.$router.push({ name: "login" });
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
.restoreAccount {
  border-radius: 20px;
  font-size: 20px;
  font-weight: 600;
  z-index: 100;
}
.restoreAccountText {
  max-width: 773px;
}
@media (max-width: $laptopWidth) {
  .restoreAccountText {
    font-size: 25px;
  }
}
@media (max-width: $tabletWidth) {
  .wrapper {
    display: flex;
    align-items: center;
    .restoreAccountText {
      font-size: 1rem;
      max-width: 90%;
    }
    .restoreAccount {
      max-width: 100%;
    }
    .registerBottomGraphics {
      display: none;
    }
  }
}
.restoreAccountButtons {
  display: flex;
  width: 773px;
}
.mob-restore-account-buttons {
  display: flex;
  width: 100%;
  justify-content: space-evenly;
}
.flex-col-first {
  flex: 2 1 0;
}
.flex-col-second {
  flex: 1 1 0;
}
</style>
