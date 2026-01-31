<script setup lang="ts">
import { productCreateSchema } from "~~/utils/schemas/products";

const { t } = useI18n();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateProductLoading, createProduct } = useProductsApi();

const newProduct = ref({
  name: "",
  description: "",
  price: "",
  stock: 0,
});
const error = ref("");
const isCreateModalOpen = ref(false);

async function createProductHandler() {
  if (!companiesStore.currentCompany?.id) {
    const errorMessage = t("forms.productForm.noCompany");
    error.value = errorMessage;
    toast.add({
      title: t("common.error"),
      description: errorMessage,
      color: "error",
    });
    return;
  }

  const formSchema = productCreateSchema.omit({ company_id: true });
  const result = formSchema.safeParse(newProduct.value);

  if (!result.success) {
    const errorMessage = t(result.error.issues[0]?.message || "common.error");
    error.value = errorMessage;
    toast.add({
      title: t("common.error"),
      description: errorMessage,
      color: "error",
    });
    return;
  }

  const productData = {
    ...result.data,
    price: result.data.price.toString(),
    company_id: companiesStore.currentCompany.id,
  };
  const resultApi = await createProduct(productData);
  if (resultApi) {
    await productsStore.refreshProducts();
    newProduct.value = { name: "", description: "", price: "", stock: 0 };
    toast.add({
      title: t("common.success"),
      description: t("forms.productForm.createdSuccess"),
      color: "success",
    });
    error.value = "";
    isCreateModalOpen.value = false;
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
      @click="isCreateModalOpen = true"
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
