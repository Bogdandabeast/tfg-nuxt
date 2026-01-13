<script setup lang="ts">
import type { Customer } from "~~/lib/db/queries/customers";
import type { Product } from "~~/lib/db/queries/products";
import { storeToRefs } from "pinia";
import { getFetchErrorMessage } from "~~/utils/error-handler";

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const { $csrfFetch } = useNuxtApp();
const toast = useToast();

const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const newSale = reactive({
  customer_id: undefined as number | undefined,
  product_id: undefined as number | undefined,
  quantity: 1,
});
const isCreating = ref(false);
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
  isCreating.value = true;
  try {
    await $csrfFetch("/api/sales", {
      method: "POST",
      body: {
        customer_id: Number(newSale.customer_id),
        product_id: Number(newSale.product_id),
        quantity: newSale.quantity,
        company_id: companiesStore.currentCompany.id,
      },
    });
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
  catch (e) {
    error.value = getFetchErrorMessage(e);
  }
  finally {
    isCreating.value = false;
  }
}

async function deleteSaleHandler() {
  const id = Number(saleToDeleteId.value);
  if (!saleToDeleteId.value || Number.isNaN(id)) {
    error.value = "Please enter a valid Sale ID to delete.";
    return;
  }
  try {
    await $csrfFetch(`/api/sales/${id}`, {
      method: "DELETE",
    });
    salesStore.refreshSales();
    saleToDeleteId.value = "";
    toast.add({
      title: "Success",
      description: "Sale deleted successfully!",
      color: "success",
    });
    error.value = "";
  }
  catch (e) {
    error.value = getFetchErrorMessage(e);
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

      <h1>
        {{
          products
        }}
      </h1>

      <UFormField label="Quantity" name="saleQuantity">
        <UInput
          v-model.number="newSale.quantity"
          type="number"
          :min="1"
        />
      </UFormField>
    </div>

    <template #footer>
      <UButton :loading="isCreating" @click="createSaleHandler">
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

    <UButton color="secondary" @click="deleteSaleHandler">
      Delete Sale
    </UButton>
  </UCard>

  <div v-if="error" class="mt-4 text-red-500">
    {{ error }}
  </div>
</template>
