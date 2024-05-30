<template>
  <article
    v-if="hasUserOverview"
    class="font-montserrat d-flex justify-content-between"
    :class="{
      'row user-overview': $isPhone || $isTablet,
    }"
  >
    <div
      class="bg-blue rounded-card text-white p-4"
      :class="
        $isPhone ? 'col-12 mb-2' : $isTablet ? 'col-12 mb-3' : 'custom-col-2'
      "
    >
      <h4>
        Welcome back <span class="font-weight-600">{{ firstName }}</span>
      </h4>
      <div class="row g-0">
        <div class="col-auto" :class="{ 'col-1': $isTablet }">
          <svg-quote class="icon-medium me-3" />
        </div>
        <div
          class="col-10 small-text text-md-lg fst-italic"
          :class="{ 'small-text': !$isTablet, 'col-11': $isTablet }"
        >
          May <span class="font-weight-600">Allah Almighty</span> give you the
          wealth of humility and meaningful character so that you can become the
          best servant of
          <span class="font-weight-600">Allah Almighty</span> and serve his
          creation appropriately
        </div>
      </div>
    </div>
    <div
      class="bg-orange rounded-card text-white ps-4 pe-3 pt-4 pb-3"
      :class="
        $isPhone ? 'col-12 mb-2' : $isTablet ? 'custom-col-3' : 'custom-col-1'
      "
    >
      <div class="row g-0 h-100">
        <div class="col-12 d-flex flex-column justify-content-between">
          <h5 class="font-weight-600 title-small">Courses in Progress</h5>
        </div>
        <div class="col-12 d-flex align-items-end justify-content-between">
          <h4 class="font-weight-600 number-font mb-0">
            {{ ongoingCoursesCount }}
          </h4>
          <div
            class="icon-container-orange d-flex justify-content-center align-items-center py-2 px-2"
          >
            <svg-course class="icon-large" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-green rounded-card text-white ps-4 pe-3 pt-4 pb-3"
      :class="
        $isPhone ? 'col-12 mb-2' : $isTablet ? 'custom-col-3' : 'custom-col-1'
      "
    >
      <div class="row g-0 h-100">
        <div class="col-12 d-flex flex-column justify-content-between">
          <h5 class="font-weight-600 title-small">Completed Courses</h5>
        </div>
        <div class="col-12 d-flex align-items-end justify-content-between">
          <h4 class="font-weight-600 number-font mb-0">
            {{ coursesCompletedCount }}
          </h4>
          <div
            class="icon-container-green d-flex justify-content-center align-items-center py-2 px-2"
          >
            <svg-completed class="icon-large" />
          </div>
        </div>
      </div>
    </div>
    <div
      class="bg-red rounded-card text-white ps-4 pe-3 pt-4 pb-3"
      :class="$isPhone ? 'col-12' : $isTablet ? 'custom-col-3' : 'custom-col-1'"
    >
      <div class="row g-0 h-100">
        <div class="col-12 d-flex flex-column justify-content-between">
          <h5 class="font-weight-600 title-small">Certificates</h5>
        </div>
        <div class="col-12 d-flex align-items-end justify-content-between">
          <h4 class="font-weight-600 number-font mb-0">
            {{ certificatesCount }}
          </h4>
          <div
            class="icon-container-red d-flex justify-content-center align-items-center py-2 px-2"
          >
            <svg-certificate class="icon-large" />
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

<script>
import { getDashboard } from "@/services/iuService";
import { mapGetters } from "vuex";
import SvgQuote from "@/assets/svg/quote.svg";
import SvgCompleted from "@/assets/svg/completed.svg";
import SvgCertificate from "@/assets/svg/certificate.svg";
import SvgCourse from "@/assets/svg/course.svg";
import devicesMixin from "@/mixins/Misc/devicesMixin";

export default {
  components: {
    SvgQuote,
    SvgCompleted,
    SvgCertificate,
    SvgCourse,
  },
  mixins: [devicesMixin],
  data() {
    return {
      dashboard: null,
    };
  },
  computed: {
    hasUserOverview() {
      if (this.dashboard == null || this.dashboard.userOverview == undefined)
        return false;
      return this.dashboard.userOverview.length > 0;
    },
    ongoingCoursesCount() {
      return String(
        this.dashboard.userOverview.find(
          (item) => item.name == "ongoingCoursesCount"
        ).count
      ).padStart(2, "0");
    },
    coursesCompletedCount() {
      return String(
        this.dashboard.userOverview.find(
          (item) => item.name == "completedCoursesCount"
        ).count
      ).padStart(2, "0");
    },
    certificatesCount() {
      return String(
        this.dashboard.userOverview.find(
          (item) => item.name == "certificatesCount"
        ).count
      ).padStart(2, "0");
    },
    ...mapGetters({
      firstName: "user/getFirstName",
    }),
  },
  async mounted() {
    await this.init();
  },
  methods: {
    async init() {
      this.dashboard = await getDashboard();
    },
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.custom-col-1 {
  width: 20%;
}
.custom-col-2 {
  width: 35%;
}
.custom-col-3 {
  width: 32%;
}
.user-overview {
  width: 100% !important;
  margin-left: 0px !important;
  margin-right: 0px !important;
}
.bg-blue {
  background-image: url("/public/img/welcomeBg.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
}
.bg-orange {
  background-color: $orange;
}
.bg-green {
  background-color: $green;
}
.bg-red {
  background-color: $red;
}
.small-text {
  font-size: 10.5px;
}
.title-small {
  font-size: 17px;
}
.number-font {
  font-size: 2.2rem;
}
.icon-container-orange {
  background-color: #c48201;
  border-radius: 10px;
}
.icon-container-green {
  background-color: #489949;
  border-radius: 10px;
}
.icon-container-red {
  background-color: #ce4850;
  border-radius: 10px;
}
</style>
