<script setup lang="ts">
import type { Customer } from "~~/lib/db/queries/customers";
import type { Product } from "~~/lib/db/queries/products";
import { storeToRefs } from "pinia";

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateSaleLoading, createSale, isDeleteSaleLoading, deleteSale } = useSalesApi();

const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const newSale = reactive({
  customer_id: undefined as number | undefined,
  product_id: undefined as number | undefined,
  quantity: 1,
});
const saleToDeleteId = ref("");
const error = ref("");

const customerOptions = computed(() =>
  customers.value?.map((c: Customer) => ({ label: c.name, value: c.id })) || [],
);
const productOptions = computed(() =>
  products.value?.map((p: Product) => ({ label: p.name, value: p.id })) || [],
);

async function createSaleHandler() {
  if (!companiesStore.currentCompany?.id) {
    error.value = "No company selected.";
    return;
  }
  if (!newSale.customer_id || !newSale.product_id || newSale.quantity <= 0) {
    error.value = "Please select a customer, a product, and enter a valid quantity.";
    return;
  }
  const saleData = {
    customer_id: Number(newSale.customer_id),
    product_id: Number(newSale.product_id),
    quantity: newSale.quantity,
    company_id: companiesStore.currentCompany.id,
  };
  const result = await createSale(saleData);
  if (result) {
    salesStore.refreshSales();
    newSale.customer_id = undefined;
    newSale.product_id = undefined;
    newSale.quantity = 1;
    toast.add({
      title: "Success",
      description: "Sale created successfully!",
      color: "success",
    });
    error.value = "";
  }
}

async function deleteSaleHandler() {
  const id = Number(saleToDeleteId.value);
  if (!saleToDeleteId.value || Number.isNaN(id)) {
    error.value = "Please enter a valid Sale ID to delete.";
    return;
  }
  const success = await deleteSale(id);
  if (success) {
    salesStore.refreshSales();
    saleToDeleteId.value = "";
    toast.add({
      title: "Success",
      description: "Sale deleted successfully!",
      color: "success",
    });
    error.value = "";
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
        <USelect
          v-model="newSale.customer_id"
          :items="customerOptions"
          option-attribute="value"
          placeholder="Select a customer"
        />
      </UFormField>

      <UFormField label="Product" name="saleProduct">
        <USelect
          v-model="newSale.product_id"
          :items="productOptions"
          option-attribute="value"
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
      <UButton :loading="isCreateSaleLoading" @click="createSaleHandler">
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

    <UButton
      color="secondary"
      :loading="isDeleteSaleLoading"
      @click="deleteSaleHandler"
    >
      Delete Sale
    </UButton>
  </UCard>

  <div v-if="error" class="mt-4 text-red-500">
    {{ error }}
  </div>
</template>
