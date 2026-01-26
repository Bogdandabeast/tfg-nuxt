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
const isCreateModalOpen = ref(false);

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
  <UModal
    v-model:open="isCreateModalOpen"

    :title="t('products.create.title')"
    :description="t('products.create.description')"
  >
    <UButton
      :label="t('dashboard.products.create.button')"
      color="primary"
      variant="subtle"
    />

    <template #content>
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
          <UButton
            :label="t('forms.productForm.create.title')"
            color="primary"
            variant="subtle"
            :loading="isCreateProductLoading"
            @click="createProductHandler"
          />
        </template>
      </UCard>

      <div v-if="error" class="mt-4 text-red-500">
        {{ error }}
      </div>
    </template>
  </UModal>
</template>
