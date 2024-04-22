<template>
  <div>
    <table class="table border bg-white">
      <thead class="thead-light">
        <tr>
          <th scope="col">ID</th>
          <th scope="col">Name</th>
          <th scope="col">Code</th>
          <th scope="col">Discount</th>
          <th scope="col">Status</th>
          <th scope="col">Redeem</th>
          <!-- <th scope="col">redeem_limit_per_user</th> -->
          <!-- <th scope="col">individual_use</th> -->
          <th scope="col">Created At</th>
          <th scope="col">Updated At</th>
          <th scope="col">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.id">
          <td>{{ item.id }}</td>
          <td>{{ item.name }}</td>
          <!-- TODO: item.description short desc or can show at hover over of coupon name -->
          <td class="code">{{ item.code }}</td>
          <td>
            {{ item.value }}({{ valueDiscountTypes[item.value_type - 1] }})
          </td>
          <td class="text-uppercase">
            <span :class="couponStatusClass[item.status]">
              {{ couponStatus[item.status] }}
            </span>
          </td>
          <td>
            <b>{{ item.redeem_count }}</b>
            /{{ item.redeem_limit }}
          </td>
          <!-- <td>{{ item.redeem_limit_per_user }}</td> -->
          <!-- <td>{{ item.individual_use }}</td> -->
          <td>{{ dateFormat(item.created_at) }}</td>
          <td>{{ dateFormat(item.updated_at) }}</td>
          <td>
            <router-link
              :to="{ name: 'af-coupons-edit', params: { id: item.id } }"
              class="text-dark"
            >
              <pen class="cursor-pointer" :size="20" />
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import Pen from "vue-material-design-icons/Pen";
import { UTCtoLocalDateFormatted } from "@/utils/dateTimeUtils";

export default {
  name: "CouponTable",
  components: {
    Pen,
  },
  props: {
    items: { type: Array },
  },
  data() {
    return {
      // TODO: have to replace with dataobject from @tayyab's branch
      valueDiscountTypes: ["£", "%"],
      couponStatus: ["expired", "active", "inactive"],
      couponStatusClass: [
        "badge bg-danger",
        "badge bg-success",
        "badge bg-secondary",
      ],
    };
  },
  methods: {
    dateFormat(date) {
      return UTCtoLocalDateFormatted(new Date(date));
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/sass/_variables.scss";
.code {
  color: $blue;
  font-size: 16px;
  font-weight: bold;
}
</style>
