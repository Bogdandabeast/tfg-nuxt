<script setup lang="ts">
import { storeToRefs } from "pinia";
import ProductForm from "~/components/Dashboard/forms/ProductForm.vue";

definePageMeta({
  layout: "dashboard",
});

const productsStore = useProductsStore();
const { products, pending } = storeToRefs(productsStore);

onMounted(() => {
  productsStore.refreshProducts();
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
      <USkeleton v-if="pending" class="h-20 w-full" />
      <ul v-else>
        <li v-for="product in products" :key="product.id">
          {{ product.id }} - {{ product.name }}
        </li>
      </ul>
    </UCard>
  </div>
</template>
