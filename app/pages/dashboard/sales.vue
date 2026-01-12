<script setup lang="ts">
import { storeToRefs } from "pinia";
import SaleForm from "~/components/Dashboard/forms/SaleForm.vue";

definePageMeta({
  layout: "dashboard",
});

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();

const { sales, pending: salesPending } = storeToRefs(salesStore);
const { customers, pending: customersPending } = storeToRefs(customersStore);
const { products, pending: productsPending } = storeToRefs(productsStore);

const pending = computed(() => salesPending.value || customersPending.value || productsPending.value);

const detailedSales = computed(() => {
  return sales.value?.map((sale: Sale) => {
    const customer = customers.value?.find((c: Customer) => c.id === sale.customer_id);
    const product = products.value?.find((p: Product) => p.id === sale.product_id);
    return {
      ...sale,
      customerName: customer ? customer.name : "Unknown",
      productName: product ? product.name : "Unknown",
    };
  });
});

onMounted(() => {
  salesStore.refreshSales();
  customersStore.refreshCustomers();
  productsStore.refreshProducts();
});
</script>

<template>
  <div class="space-y-4">
    <h1>Sales Management</h1>

    <SaleForm />

    <UCard class="mt-4">
      <template #header>
        <h3>Existing Sales</h3>
      </template>
      <div v-if="pending">
        Loading sales...
      </div>
      <ul v-else>
        <li v-for="sale in detailedSales" :key="sale.id">
          Sale #{{ sale.id }}: {{ sale.customerName }} bought {{ sale.quantity }} x {{ sale.productName }}
        </li>
      </ul>
    </UCard>
  </div>
</template>
