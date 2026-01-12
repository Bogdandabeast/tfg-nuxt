<script setup lang="ts">
import { storeToRefs } from "pinia";

type Customer = { id: number; name: string };
type Product = { id: number; name: string };

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const toast = useToast();

const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const newSale = reactive({
  customer_id: null as number | null,
  product_id: null as number | null,
  quantity: 1,
});
const saleToDeleteId = ref("");

const customerOptions = computed(() =>
  customers.value?.map((c: Customer) => ({ label: c.name, value: c.id })) || [],
);
const productOptions = computed(() =>
  products.value?.map((p: Product) => ({ label: p.name, value: p.id })) || [],
);

onMounted(() => {
  customersStore.refreshCustomers();
  productsStore.refreshProducts();
});

async function createSaleHandler() {
  if (newSale.customer_id && newSale.product_id && newSale.quantity > 0) {
    await salesStore.createSale({
      customer_id: Number(newSale.customer_id),
      product_id: Number(newSale.product_id),
      quantity: newSale.quantity,
    });
    newSale.customer_id = null;
    newSale.product_id = null;
    newSale.quantity = 1;
    toast.add({
      title: "Success",
      description: "Sale created successfully!",
      color: "success",
    });
  }
  else {
    toast.add({
      title: "Error",
      description: "Please select a customer, a product, and enter a valid quantity.",
      color: "error",
    });
  }
}

async function deleteSaleHandler() {
  const id = Number(saleToDeleteId.value);
  if (saleToDeleteId.value && !Number.isNaN(id)) {
    await salesStore.deleteSale(id);
    saleToDeleteId.value = "";
    toast.add({
      title: "Success",
      description: "Sale deleted successfully!",
      color: "success",
    });
  }
  else {
    toast.add({
      title: "Error",
      description: "Please enter a valid Sale ID to delete.",
      color: "error",
    });
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
          :items="customerOptions"
          placeholder="Select a customer"
        />
      </UFormField>

      <h1>
        {{
          customers
        }}
      </h1>
      <h2>
        {{ customerOptions }}
      </h2>

      <UFormField label="Product" name="saleProduct">
        <USelectMenu
          v-model="newSale.product_id"
          :items="productOptions"
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

    <UButton color="secondary" @click="deleteSaleHandler">
      Delete Sale
    </UButton>
  </UCard>
</template>
