<script setup lang="ts">
import { storeToRefs } from "pinia";
import ProductForm from "~/components/Dashboard/forms/ProductForm.vue";

definePageMeta({
  layout: "dashboard",
});

const companiesStore = useCompaniesStore();
const productsStore = useProductsStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
productsStore.refreshProducts();

const { products, pending } = storeToRefs(productsStore);
</script>

<template>
  <div class="space-y-4 w-full">
    <h1>Products Management</h1>

    <ProductForm />

    <UCard class="mt-4">
      <template #header>
        <h3>Existing Products</h3>
      </template>
      <USkeleton v-if="pending" class="h-20 w-full" />
      <ul v-else>
        <li v-for="product in products" :key="product.id">
          <NuxtLink :to="`/dashboard/products/${product.id}`" class="text-blue-600 hover:underline">
            {{ product.id }} - {{ product.name }}
          </NuxtLink>
        </li>
      </ul>
    </UCard>
  </div>
</template>
