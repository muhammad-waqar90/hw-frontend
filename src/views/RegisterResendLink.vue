<template>
  <div class="absoluteCenter">
    <section
      class="registerSuccess shadow col-12 mt-5 mb-0 mx-auto border bg-white row py-5 px-0 position-relative"
    >
      <register-success :resend-link="true" @submit="submit" />
    </section>
    <router-link
      :to="{ name: 'gu-faq-dashboard' }"
      class="contactPageLink mx-auto text-uppercase text-white"
    >
      <span class="d-flex justify-content-center mt-3">
        {{ $t("auth.contactPageLink") }}
      </span>
    </router-link>
  </div>
</template>

<script>
import toastMixin from "@/mixins/toastMixin";
import RegisterSuccess from "@/components/Auth/RegisterSuccess";

export default {
  components: { RegisterSuccess },

  mixins: [toastMixin],
};
</script>

<style lang="scss" scoped>
section.registerSuccess {
  border-radius: 20px;
  height: 620px;
  font-family: "Montserrat", sans-serif;
  overflow: hidden;
}

.contactPageLink {
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  &:hover {
    color: #313336;
  }
}
</style>
