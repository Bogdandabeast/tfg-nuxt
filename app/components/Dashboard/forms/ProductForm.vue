<script setup lang="ts">
import type { Product } from "~~/types/api";
import { productCreateSchema } from "~~/utils/schemas/products";

const props = defineProps<{
  initialData?: Product;
  formOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: "success", product: Product): void;
  (e: "cancel"): void;
}>();

const { t } = useI18n();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const { isCreateProductLoading, isUpdateProductLoading, createProduct, updateProduct } = useProductsApi();

const isCreateModalOpen = ref(false);

const isEditing = computed(() => !!props.initialData);

const newProduct = reactive({
  name: "",
  description: "",
  price: "",
  stock: 0,
});

const error = ref("");

// Initialize form if initialData is provided
watch(() => props.initialData, (data) => {
  if (data) {
    newProduct.name = data.name;
    newProduct.description = data.description || "";
    newProduct.price = data.price.toString();
    newProduct.stock = data.stock;
  }
}, { immediate: true });

async function submitHandler() {
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
  const result = formSchema.safeParse(newProduct);

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

  if (isEditing.value && props.initialData) {
    const productData = {
      ...result.data,
      price: result.data.price.toString(),
    };
    const updatedProduct = await updateProduct(props.initialData.id, productData);
    if (updatedProduct) {
      await productsStore.refreshProducts();
      toast.add({
        title: t("common.success"),
        description: t("forms.productForm.updatedSuccess"),
        color: "success",
      });
      error.value = "";
      emit("success", updatedProduct);
      if (!props.formOnly) {
        isCreateModalOpen.value = false;
      }
    }
  }
  else {
    const productData = {
      ...result.data,
      price: result.data.price.toString(),
      company_id: companiesStore.currentCompany.id,
    };
    const resultApi = await createProduct(productData);
    if (resultApi) {
      await productsStore.refreshProducts();
      resetForm();
      toast.add({
        title: t("common.success"),
        description: t("forms.productForm.createdSuccess"),
        color: "success",
      });
      error.value = "";
      emit("success", resultApi);
      if (!props.formOnly) {
        isCreateModalOpen.value = false;
      }
    }
  }
}

function resetForm() {
  newProduct.name = "";
  newProduct.description = "";
  newProduct.price = "";
  newProduct.stock = 0;
}
</script>

<template>
  <div v-if="props.formOnly">
    <UCard class="mb-4">
      <template #header>
        <h3>{{ isEditing ? t('actions.edit.product') : t('forms.productForm.createTitle') }}</h3>
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
        <div class="flex justify-end gap-2">
          <UButton
            v-if="isEditing"
            color="neutral"
            variant="soft"
            @click="emit('cancel')"
          >
            {{ t('actions.cancel') }}
          </UButton>
          <UButton
            :loading="isCreateProductLoading || isUpdateProductLoading"
            color="primary"
            variant="subtle"
            @click="submitHandler"
          >
            {{ isEditing ? t('actions.save') : t('forms.productForm.createButton') }}
          </UButton>
        </div>
      </template>
    </UCard>
    <div v-if="error" class="mt-4 text-red-500">
      {{ error }}
    </div>
  </div>

  <UModal
    v-else
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
            @click="submitHandler"
          />
        </template>
      </UCard>

      <div v-if="error" class="mt-4 text-red-500">
        {{ error }}
      </div>
    </template>
  </UModal>
</template>