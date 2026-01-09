<script setup lang="ts">
import { useProductsStore } from "~/app/stores/products";

const productsStore = useProductsStore();

const newProduct = ref({
  name: "",
  description: "",
  price: "",
  stock: 0,
});
const productToDeleteId = ref("");

async function createProductHandler() {
  if (newProduct.value.name && newProduct.value.description && newProduct.value.price) {
    await productsStore.createProduct({
      ...newProduct.value,
      price: newProduct.value.price.toString(),
    });
    newProduct.value = { name: "", description: "", price: "", stock: 0 };
    alert("Product created successfully!");
  }
  else {
    alert("Please fill in all product details.");
  }
}

async function deleteProductHandler() {
  const id = Number(productToDeleteId.value);
  if (productToDeleteId.value && !isNaN(id)) {
    await productsStore.deleteProduct(id);
    productToDeleteId.value = "";
    alert("Product deleted successfully!");
  }
  else {
    alert("Please enter a valid Product ID to delete.");
  }
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>Create New Product</h3>
    </template>

    <div class="space-y-4">
      <UFormField
        label="Product Name"
        name="newProductName"
      >
        <UInput v-model="newProduct.name" placeholder="Enter product name" />
      </UFormField>

      <UFormField
        label="Description"
        name="newProductDescription"
      >
        <UInput v-model="newProduct.description" placeholder="Enter description" />
      </UFormField>

      <UFormField
        label="Price"
        name="newProductPrice"
      >
        <UInput
          v-model="newProduct.price"
          placeholder="Enter price"
          type="number"
        />
      </UFormField>

      <UFormField
        label="Stock"
        name="newProductStock"
      >
        <UInput
          v-model.number="newProduct.stock"
          placeholder="Enter stock quantity"
          type="number"
        />
      </UFormField>
    </div>

    <template #footer>
      <UButton @click="createProductHandler">
        Create Product
      </UButton>
    </template>
  </UCard>

  <UCard>
    <template #header>
      <h3>Delete Product by ID</h3>
    </template>

    <UFormField
      label="Product ID"
      name="productToDeleteId"
      class="mb-4"
    >
      <UInput v-model="productToDeleteId" placeholder="Enter product ID to delete" />
    </UFormField>

    <UButton color="primary" @click="deleteProductHandler">
      Delete Product
    </UButton>
  </UCard>
</template>
