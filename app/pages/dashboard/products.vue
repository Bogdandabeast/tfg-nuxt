<script setup lang="ts">
import ProductForm from "~/app/components/Dashboard/forms/ProductForm.vue";
import { useProducts } from "~/app/composables/useProducts";

definePageMeta({
  layout: "dashboard",
});

const { products, pending, getAllProducts } = useProducts();

// Initial fetch is already done in the composable, but we can re-fetch if needed
onMounted(() => {
  getAllProducts();
});
</script>

<template>
  <div class="space-y-4">
    <h1>Products Management</h1>

    <ProductForm />

    <UCard class="mt-4">
      <template #header>
        <h3>Existing Products</h3>
      </template>
      <div v-if="pending">
        Loading products...
      </div>
      <ul v-else>
        <li v-for="product in products" :key="product.id">
          {{ product.id }} - {{ product.name }}
        </li>
      </ul>
    </UCard>
  </div>
</template>
