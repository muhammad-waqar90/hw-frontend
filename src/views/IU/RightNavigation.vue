<!--
    For Now this component is un-used
 -->
<template>
  <div class="container font-montserrat px-0">
    <div class="row">
      <div class="main-container-width">
        <div class="rounded-card bg-white py-3">
          <nav>
            <ul class="ps-0 list-unstyled">
              <li class="mb-2 lists">
                <router-link
                  :to="{ name: 'iu-profile-certificates-dashboard' }"
                  :title="$t('iu.certificates.achievement')"
                  class="nav"
                >
                  <span class="nav-icon">
                    <svg-achievement />
                  </span>
                  <div class="nav-text">
                    {{ $t("iu.certificates.achievement") }}
                  </div>
                </router-link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SvgAchievement from "@/assets/svg/achievement.svg";
export default {
  name: "RightNavigation",
  components: { SvgAchievement },
  methods: {},
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";

.main-container-width {
  flex: 0 0 auto;
  width: 100%;
}

.lists {
  &:hover {
    background-image: linear-gradient(
      to right,
      rgba(200, 236, 254, 0),
      rgb(255, 255, 255)
    ) !important;
    background: #dde7ff;
  }
}

.nav {
  display: flex;
  align-items: center;
  padding: 10px;
  text-decoration: none;
}

.nav.router-link-active {
  border-left: 4px solid $blue;
  background-image: linear-gradient(
    to right,
    rgba(200, 236, 254, 0),
    rgb(255, 255, 255)
  ) !important;
  background: #dde7ff;
}

.nav-icon {
  background-color: transparent;
  color: $blue;
  border-radius: 100%;
  line-height: 0;
}

.nav-text {
  color: $blue;
  margin-left: 1em;
  font-weight: 600;
}
</style>
