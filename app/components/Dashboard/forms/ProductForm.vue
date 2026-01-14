<script setup lang="ts">
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateProductLoading, createProduct, isDeleteProductLoading, deleteProduct } = useProductsApi();

const newProduct = ref({
  name: "",
  description: "",
  price: "",
  stock: 0,
});
const productToDeleteId = ref("");
const error = ref("");

async function createProductHandler() {
  if (!companiesStore.currentCompany?.id) {
    error.value = "No company selected.";
    return;
  }
  if (!newProduct.value.name || !newProduct.value.description || !newProduct.value.price) {
    error.value = "Please fill in all product details.";
    return;
  }
  const productData = {
    ...newProduct.value,
    price: newProduct.value.price.toString(),
    company_id: companiesStore.currentCompany.id,
  };
  const result = await createProduct(productData);
  if (result) {
    await productsStore.refreshProducts();
    newProduct.value = { name: "", description: "", price: "", stock: 0 };
    toast.add({
      title: "Success",
      description: "Product created successfully!",
      color: "success",
    });
    error.value = "";
  }
}

async function deleteProductHandler() {
  const id = Number(productToDeleteId.value);
  if (!productToDeleteId.value || Number.isNaN(id)) {
    error.value = "Please enter a valid Product ID to delete.";
    return;
  }
  const success = await deleteProduct(id);
  if (success) {
    productsStore.refreshProducts();
    productToDeleteId.value = "";
    toast.add({
      title: "Success",
      description: "Product deleted successfully!",
      color: "success",
    });
    error.value = "";
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
      <UButton :loading="isCreateProductLoading" @click="createProductHandler">
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

    <UButton
      color="primary"
      :loading="isDeleteProductLoading"
      @click="deleteProductHandler"
    >
      Delete Product
    </UButton>
  </UCard>

  <div v-if="error" class="mt-4 text-red-500">
    {{ error }}
  </div>
</template>
