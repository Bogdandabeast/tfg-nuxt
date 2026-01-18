<script setup lang="ts">
const { t } = useI18n();
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
    error.value = t("forms.productForm.noCompany");
    return;
  }
  if (!newProduct.value.name || !newProduct.value.description || !newProduct.value.price) {
    error.value = t("forms.productForm.invalidData");
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
      title: t("common.success"),
      description: t("forms.productForm.createdSuccess"),
      color: "success",
    });
    error.value = "";
  }
}

async function deleteProductHandler() {
  const success = await deleteProduct(productToDeleteId.value);
  if (success) {
    productToDeleteId.value = "";
  }
}
</script>

<template>
  <UCard class="mb-4">
    <template #header>
      <h3>{{ t('forms.productForm.createTitle') }}</h3>
    </template>

    <div class="space-y-4">
      <UFormField
        :label="t('forms.productForm.name')"
        name="newProductName"
      >
        <UInput v-model="newProduct.name" :placeholder="t('forms.productForm.namePlaceholder')" />
      </UFormField>

      <UFormField
        :label="t('forms.productForm.description')"
        name="newProductDescription"
      >
        <UInput v-model="newProduct.description" :placeholder="t('forms.productForm.descriptionPlaceholder')" />
      </UFormField>

      <UFormField
        :label="t('forms.productForm.price')"
        name="newProductPrice"
      >
        <UInput
          v-model="newProduct.price"
          :placeholder="t('forms.productForm.pricePlaceholder')"
          type="number"
        />
      </UFormField>

      <UFormField
        :label="t('forms.productForm.stock')"
        name="newProductStock"
      >
        <UInput
          v-model.number="newProduct.stock"
          :placeholder="t('forms.productForm.stockPlaceholder')"
          type="number"
        />
      </UFormField>
    </div>

    <template #footer>
      <UButton :loading="isCreateProductLoading" @click="createProductHandler">
        {{ t('forms.productForm.create') }}
      </UButton>
    </template>
  </UCard>

  <UCard>
    <template #header>
      <h3>{{ t('forms.productForm.deleteTitle') }}</h3>
    </template>

    <UFormField
      :label="t('forms.productForm.id')"
      name="productToDeleteId"
      class="mb-4"
    >
      <UInput v-model="productToDeleteId" :placeholder="t('forms.productForm.idPlaceholder')" />
    </UFormField>

    <UButton
      color="primary"
      :loading="isDeleteProductLoading"
      @click="deleteProductHandler"
    >
      {{ t('forms.productForm.delete') }}
    </UButton>
  </UCard>

  <div v-if="error" class="mt-4 text-red-500">
    {{ error }}
  </div>
</template>
