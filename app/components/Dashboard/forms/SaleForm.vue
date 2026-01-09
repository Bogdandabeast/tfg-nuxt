<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useCustomersStore } from "~/app/stores/customers";
import { useProductsStore } from "~/app/stores/products";
import { useSalesStore } from "~/app/stores/sales";

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();

const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const newSale = ref({
  customer_id: null,
  product_id: null,
  quantity: 1,
});
const saleToDeleteId = ref("");

const customerOptions = computed(() =>
  customers.value.map(c => ({ label: c.name, value: c.id })),
);
const productOptions = computed(() =>
  products.value.map(p => ({ label: p.name, value: p.id })),
);

onMounted(() => {
  customersStore.refreshCustomers();
  productsStore.refreshProducts();
});

async function createSaleHandler() {
  if (newSale.value.customer_id && newSale.value.product_id && newSale.value.quantity > 0) {
    await salesStore.createSale({
      customer_id: Number(newSale.value.customer_id),
      product_id: Number(newSale.value.product_id),
      quantity: newSale.value.quantity,
    });
    newSale.value = { customer_id: null, product_id: null, quantity: 1 };
    alert("Sale created successfully!");
  }
  else {
    alert("Please select a customer, a product, and enter a valid quantity.");
  }
}

async function deleteSaleHandler() {
  const id = Number(saleToDeleteId.value);
  if (saleToDeleteId.value && !isNaN(id)) {
    await salesStore.deleteSale(id);
    saleToDeleteId.value = "";
    alert("Sale deleted successfully!");
  }
  else {
    alert("Please enter a valid Sale ID to delete.");
  }
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>Create New Sale</h3>
    </template>

    <div class="space-y-4">
      <UFormField label="Customer" name="saleCustomer">
        <USelectMenu
          v-model="newSale.customer_id"
          :options="customerOptions"
          placeholder="Select a customer"
        />
      </UFormField>

      <UFormField label="Product" name="saleProduct">
        <USelectMenu
          v-model="newSale.product_id"
          :options="productOptions"
          placeholder="Select a product"
        />
      </UFormField>

      <UFormField label="Quantity" name="saleQuantity">
        <UInput
          v-model.number="newSale.quantity"
          type="number"
          :min="1"
        />
      </UFormField>
    </div>

    <template #footer>
      <UButton @click="createSaleHandler">
        Create Sale
      </UButton>
    </template>
  </UCard>

  <UCard>
    <template #header>
      <h3>Delete Sale by ID</h3>
    </template>

    <UFormField
      label="Sale ID"
      name="saleToDeleteId"
      class="mb-4"
    >
      <UInput v-model="saleToDeleteId" placeholder="Enter sale ID to delete" />
    </UFormField>

    <UButton color="red" @click="deleteSaleHandler">
      Delete Sale
    </UButton>
  </UCard>
</template>
