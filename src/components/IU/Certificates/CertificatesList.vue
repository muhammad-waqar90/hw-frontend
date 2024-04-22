<template>
  <div class="rounded-card px-3 pt-2 pb-3">
    <template v-if="list.length">
      <div v-for="item in list" :key="item.id" class="mt-2">
        <CertificateItem :item="item" />
      </div>
    </template>
    <template v-if="loading">
      <LoadingCertificates />
    </template>
  </div>
</template>

<script>
import CertificateItem from "@/components/IU/Certificates/CertificateItem";
import LoadingCertificates from "@/components/IU/Certificates/LoadingCertificates";

export default {
  components: {
    CertificateItem,
    LoadingCertificates,
  },
  props: {
    list: {
      type: Array,
    },
    loading: {
      type: Boolean,
    },
  },
};
</script>
