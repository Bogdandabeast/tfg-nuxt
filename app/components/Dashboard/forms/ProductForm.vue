<script setup lang="ts">
import { useProducts } from '~/app/composables/useProducts';

const { createProduct, deleteProduct } = useProducts();

const newProductName = ref('');
const productToDeleteId = ref('');

const createProductHandler = async () => {
  if (newProductName.value) {
    await createProduct({ name: newProductName.value });
    newProductName.value = '';
    alert('Product created successfully!');
  }
};

const deleteProductHandler = async () => {
  const id = Number(productToDeleteId.value);
  if (productToDeleteId.value && !isNaN(id)) {
    await deleteProduct(id.toString()); // Convert back to string for consistency with URL params
    productToDeleteId.value = '';
    alert('Product deleted successfully!');
  } else {
    alert('Please enter a valid Product ID to delete.');
  }
};
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>Create New Product</h3>
    </template>

    <UFormGroup label="Product Name" name="newProductName" class="mb-4">
      <UInput v-model="newProductName" placeholder="Enter product name" />
    </UFormGroup>

    <UButton @click="createProductHandler">Create Product</UButton>
  </UCard>

  <UCard>
    <template #header>
      <h3>Delete Product by ID</h3>
    </template>

    <UFormGroup label="Product ID" name="productToDeleteId" class="mb-4">
      <UInput v-model="productToDeleteId" placeholder="Enter product ID to delete" />
    </UFormGroup>

    <UButton color="red" @click="deleteProductHandler">Delete Product</UButton>
  </UCard>
</template>