<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const productId = Number(route.params.id);

const productsStore = useProductsStore();
const { data } = productsStore.getProductById(productId);
</script>

<template>
  <div>
    <div>product id requested {{ productId }}</div>
    <pre>{{ data }}</pre>
  </div>
</template>
