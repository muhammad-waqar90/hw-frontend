<template>
  <nav
    class="side-navigation side-navigation-wide"
    :class="{ 'side-navigation-wide': !mini }"
  >
    <ul class="nav flex-column">
      <router-link :to="{ name: 'af-dashboard' }" class="navbar-brand mb-4">
        <img
          :src="mini ? '/img/logo-small.png' : '/img/logo.png'"
          width="30"
          height="30"
          alt=""
        />
      </router-link>

      <li class="nav-item">
        <!-- TODO: use router link and translations -->
        <!-- <router-link to="/af/dashboard" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Dashboard
          </div>
        </router-link> -->
        <!-- <router-link to="/af/platform-users" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Platform Users
          </div>
        </router-link> -->
        <!-- <router-link to="/af/certificates" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Certificates
          </div>
        </router-link> -->
        <router-link
          v-if="$isTicketContentManager || $isTicketSystemManager"
          :to="{ path: '/af/tickets', query: { status: defaultTicketStatus } }"
          class="nav-link"
          :class="
            ($route.name === 'af-support-tickets' ||
              $route.name === 'af-support-ticket') &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Support Tickets</div>
        </router-link>
        <router-link
          v-if="$isTicketContentManager || $isTicketSystemManager"
          to="/af/tickets/me"
          class="nav-link"
          :class="
            $route.name === 'af-my-support-tickets' &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">My Support Tickets</div>
        </router-link>
        <router-link
          v-if="$isTicketLessonQAManager"
          :to="{
            path: '/af/lesson/qas',
            query: {
              category: lectureQATicketCategory,
              status: defaultTicketStatus,
            },
          }"
          class="nav-link"
          :class="
            ($route.name === 'af-lesson-qa-tickets' ||
              $route.name === 'af-lesson-qa-ticket') &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Lecture Q&A Tickets</div>
        </router-link>
        <router-link
          v-if="$isTicketSubjectManager"
          to="/af/tickets/subjects"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/tickets/subjects') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Ticket Subjects</div>
        </router-link>
        <router-link
          v-if="$isEventManager"
          :to="{ name: 'af-events' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/events') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Events</div>
        </router-link>
        <!-- <router-link to="/af/advertisment-blocks" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Advertisment Blocks
          </div>
        </router-link> -->
        <!-- <router-link to="/af/transactions" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Transactions
          </div>
        </router-link> -->
        <!-- <router-link to="/af/course-access-management" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Course Access Management
          </div>
        </router-link> -->
        <!-- <router-link to="/af/exam-access-management" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Exam Access Management
          </div>
        </router-link> -->
        <!-- <router-link to="/af/external-login-issues" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            External - Login issues
          </div>
        </router-link> -->
        <!-- <router-link to="/af/orders-overview" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Orders Overview
          </div>
        </router-link> -->
        <!-- <router-link to="/af/stock-requests-overview" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Stock Requests Overview
          </div>
        </router-link> -->
        <router-link
          v-if="$isFaqCategoryManager"
          :to="{ name: 'af-faqs-categories' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/faqs/categories') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">FAQ Categories</div>
        </router-link>
        <router-link
          v-if="$isFaqManager"
          :to="{ name: 'af-faqs-entries' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/faqs/entries') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">FAQ Entries</div>
        </router-link>
        <!-- <router-link to="/af/institutions" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Institutions
          </div>
        </router-link> -->
        <!-- <router-link to="/af/classes-overview" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Classes Overview
          </div>
        </router-link> -->
        <!-- <router-link to="/af/pending-approval-requests" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Pending Approval Requests
          </div>
        </router-link> -->
        <router-link
          v-if="$isCategoryManager"
          :to="{ name: 'af-category' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/categories') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Categories</div>
        </router-link>
        <router-link
          v-if="$isCourseManager"
          :to="{ name: 'af-courses' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/courses') === 0 &&
            $route.path.indexOf('/af/categories') !== 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Courses</div>
        </router-link>
        <!-- <router-link to="/af/shop-categories" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Shop Categories
          </div>
        </router-link> -->
        <!-- <router-link to="/af/shop-distributors" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Shop Distributors
          </div>
        </router-link> -->
        <!-- <router-link to="/af/products-overview" class="nav-link">
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">
            Products Overview
          </div>
        </router-link> -->
        <router-link
          v-if="$isUserManager"
          :to="{ name: 'af-users' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/users') === 0 && 'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Users</div>
        </router-link>
        <router-link
          v-if="$isAbleToViewRefunds"
          :to="{ name: 'af-refunds' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/refunds') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Refunds</div>
        </router-link>
        <router-link
          v-if="$isGlobalNotificationsManager"
          :to="{
            name: 'af-global-notifications',
            query: { archiveStatus: archiveActiveStatus.value },
          }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/global-notifications') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Global Notifications</div>
        </router-link>
        <router-link
          v-if="$isAdvertManager"
          :to="{
            name: 'af-adverts',
            query: { status: advertActiveStatus.value },
          }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/advert') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Adverts</div>
        </router-link>
        <router-link
          v-if="$isPhysicalProductManager"
          :to="{ name: 'af-products' }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/products') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Products</div>
        </router-link>
        <router-link
          v-if="$isCouponManager"
          :to="{
            name: 'af-coupons',
          }"
          class="nav-link"
          :class="
            $route.path.indexOf('/af/coupons') === 0 &&
            'router-link-exact-active'
          "
        >
          <view-dashboard-icon :size="33" />
          <div class="nav-link-text">Coupons</div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import ViewDashboardIcon from "vue-material-design-icons/ViewDashboard";
import permissionsMixin from "@/mixins/AF/permissionsMixin";
import { UNCLAIMED } from "@/dataObject/tickets/ticketStatusData";
import { LECTURE_QA } from "@/dataObject/tickets/ticketCategoryData";
import { ACTIVE as archiveActiveStatus } from "@/dataObject/globalNotifications/archiveStatusData.js";
import { ACTIVE as advertActiveStatus } from "@/dataObject/advert/advertData.js";

export default {
  name: "SideNavigation",

  components: {
    ViewDashboardIcon,
  },

  mixins: [permissionsMixin],

  props: { mini: true },

  data() {
    return {
      defaultTicketStatus: UNCLAIMED,
      lectureQATicketCategory: LECTURE_QA,
      archiveActiveStatus: archiveActiveStatus,
      advertActiveStatus: advertActiveStatus,
    };
  },
};
</script>

<style scoped lang="scss">
@import "@/assets/sass/_variables.scss";
.side-navigation {
  height: 100%;
  width: 100px;
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  background-color: #fff;
  overflow-x: hidden;
  transition: 0.5s;
  padding-top: 60px;
  padding-left: 10px;
  padding-right: 10px;
  text-align: center;

  .navbar-brand {
    margin: 0;

    img {
      width: 100%;
      height: 70px;
      object-fit: contain;
    }
  }

  .nav-link {
    color: #d4d4d4;
    cursor: pointer;
    &.router-link-exact-active {
      color: $orange;
    }
  }

  .nav-link-text {
    display: none;
  }

  &.side-navigation-wide {
    width: 250px;
    padding-left: 30px;
    padding-right: 30px;
    text-align: left;

    .navbar-brand {
      img {
        height: 70px;
      }
    }

    .nav-link {
      padding: 3px 8px;
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      .nav-link-text {
        color: #b3b3b3;
        margin-left: 7.5px;
        font-weight: 500;
      }

      &.router-link-exact-active {
        color: $orange;
        background-color: $blue;
        border-radius: 50px;
        .nav-link-text {
          color: #fff;
        }
      }
    }
    .nav-link-text {
      display: block;
    }
  }
}
</style>
