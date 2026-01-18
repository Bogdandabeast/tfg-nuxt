<script setup lang="ts">
import { storeToRefs } from "pinia";
import ProductForm from "~/components/Dashboard/forms/ProductForm.vue";
import { getProductPath } from "~/utils/routes";

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
  <UContainer class="space-y-4 w-full">
    <h1>{{ $t('dashboard.products.title') }}</h1>

    <ProductForm />

    <UCard class="mt-4">
      <template #header>
        <h3>{{ $t('dashboard.products.existing') }}</h3>
      </template>
      <USkeleton v-if="pending" class="h-20 w-full" />
      <ul v-else>
        <li v-for="product in products" :key="product.id">
          <NuxtLink :to="useLocalePath()(getProductPath(product.id))" class="text-blue-600 hover:underline">
            {{ product.id }} - {{ product.name }}
          </NuxtLink>
        </li>
      </ul>
    </UCard>
  </UContainer>
</template>
