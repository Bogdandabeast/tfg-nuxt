<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const companyId = route.params.id as string;

const companiesStore = useCompaniesStore();
const { data } = companiesStore.getCompanyById(Number(companyId));
</script>

<template>
  <div>
    <div>company id requested {{ companyId }}</div>
    <pre>{{ data }}</pre>
  </div>
</template>
