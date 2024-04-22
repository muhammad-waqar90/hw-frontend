<template>
  <div>
    <div v-for="item in list" :key="item.type + item.id" class="mt-3">
      <CheckoutItem
        :item="item"
        @remove-item="removeItem"
        @remove-child="removeChild"
        @remove-e-notes="removeEnotes"
      />
    </div>
    <div
      v-if="isPhysicalProduct"
      class="d-flex justify-content-end align-items-end mt-4"
    >
      <PaymentCheckbox
        v-if="isAddressExist"
        :label="$t('iu.checkout.addDifferentShippingAddress')"
        @on-change="addShippingAddress"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import CheckoutItem from "@/components/Common/Checkout/CheckoutItem";
import PaymentCheckbox from "@/components/Common/Checkout/PaymentCheckbox.vue";

export default {
  components: {
    CheckoutItem,
    PaymentCheckbox,
  },
  data() {
    return {
      differentShippingAddress: false,
    };
  },
  props: {
    list: {
      type: Array,
      default: () => [],
    },
    isAddressExist: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters({ isPhysicalProduct: "cart/getItemType" }),
  },
  methods: {
    removeItem(item) {
      this.$emit("remove-item", item);
    },
    removeChild(item) {
      this.$emit("remove-child", item);
    },
    removeEnotes(item) {
      this.$emit("remove-e-notes", item);
    },
    addShippingAddress(value) {
      this.differentShippingAddress = value;
      this.$emit("add-shipping-address", this.differentShippingAddress);
    },
    updateProfile() {
      this.$router.push({ name: "iu-profile-info" });
    },
  },
};
</script>

<style>
.shipping-button {
  background-color: transparent;
  outline: none;
  padding: 4px;
  color: blue;
  border: none;
}
</style>
