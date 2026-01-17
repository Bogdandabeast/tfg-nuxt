<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const saleId = route.params.id as string;

const salesStore = useSalesStore();
const { data } = salesStore.getSaleById(saleId);
</script>

<template>
  <div>
    <div>sale id requested {{ saleId }}</div>
    <pre>{{ data }}</pre>
  </div>
</template>
