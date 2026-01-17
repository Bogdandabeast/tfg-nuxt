<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const customerId = Number(route.params.id);

const customersStore = useCustomersStore();
const { data } = customersStore.getCustomerById(customerId);
</script>

<template>
  <div>
    <div>customer id requested {{ customerId }}</div>
    <pre>{{ data }}</pre>
  </div>
</template>
