<script setup lang="ts">
import type { Customer, Product, Sale } from "~~/types/api";
import { storeToRefs } from "pinia";
import { createSaleSchema } from "~~/utils/schemas/sales";

const props = defineProps<{
  initialData?: Sale;
  formOnly?: boolean;
}>();

const emit = defineEmits<{
  (e: "success", sale: Sale): void;
  (e: "cancel"): void;
}>();

const { t } = useI18n();
const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const isCreateModalOpen = ref(false);
const { isCreateSaleLoading, isUpdateSaleLoading, createSale, updateSale } = useSalesApi();

const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const isEditing = computed(() => !!props.initialData);

const newSale = reactive({
  customer_id: undefined as string | undefined,
  product_id: undefined as string | undefined,
  quantity: 1,
  sale_date: new Date().toISOString().split("T")[0],
  tax_rate: "0",
  discount: "0",
});

const error = ref("");

// Initialize form if initialData is provided
watch(() => props.initialData, (data) => {
  if (data) {
    newSale.customer_id = data.customer_id;
    newSale.product_id = data.product_id;
    newSale.quantity = data.quantity;
    newSale.sale_date = new Date(data.sale_date).toISOString().split("T")[0];
    newSale.tax_rate = data.tax_rate ?? 0;
    newSale.discount = data.discount ?? 0;
  }
}, { immediate: true });

const selectedProduct = computed(() =>
  products.value?.find((p: Product) => p.id === newSale.product_id),
);

const selectedCustomer = computed(() =>
  customers.value?.find((c: Customer) => c.id === newSale.customer_id),
);

const customerOptions = computed(() =>
  customers.value?.map((c: Customer) => ({ label: c.name, value: c.id })) || [],
);
const productOptions = computed(() =>
  products.value?.map((p: Product) => ({ label: p.name, value: p.id })) || [],
);

async function submitHandler() {
  if (!companiesStore.currentCompany?.id) {
    const errorMessage = t("forms.saleForm.noCompany");
    error.value = errorMessage;
    toast.add({
      title: t("common.error"),
      description: errorMessage,
      color: "error",
    });
    return;
  }

  const formSchema = createSaleSchema.pick({
    customer_id: true,
    product_id: true,
    quantity: true,
    sale_date: true,
    tax_rate: true,
    discount: true,
  });

  const result = formSchema.safeParse(newSale);
  console.log(newSale, result);

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
    // Update logic
    const saleData = {
      ...result.data,
      sale_date: result.data.sale_date.toLocaleDateString("en-CA"),
    };

    const updatedSale = await updateSale(props.initialData.id, saleData);
    if (updatedSale) {
      salesStore.refreshSales();
      salesStore.refreshCurrentSale();
      toast.add({
        title: t("common.success"),
        description: t("forms.saleForm.updatedSuccess"),
        color: "success",
      });
      error.value = "";
      emit("success", updatedSale);
      if (!props.formOnly) {
        isCreateModalOpen.value = false;
      }
    }
  }
  else {
    // Create logic
    const product = selectedProduct.value;
    const customer = selectedCustomer.value;

    if (!product || !customer) {
      const errorMessage = t("forms.saleForm.missingDetails");
      error.value = errorMessage;
      toast.add({
        title: t("common.error"),
        description: errorMessage,
        color: "error",
      });
      return;
    }

    const saleData = {
      ...result.data,
      sale_date: result.data.sale_date.toLocaleDateString("en-CA"),
      product_name: product.name,
      unit_price: product.price,
      customer_name: customer.name,
      company_id: companiesStore.currentCompany.id,
    };

    const resultApi = await createSale(saleData);
    if (resultApi) {
      salesStore.refreshSales();
      resetForm();
      toast.add({
        title: t("common.success"),
        description: t("forms.saleForm.createdSuccess"),
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
  newSale.customer_id = undefined;
  newSale.product_id = undefined;
  newSale.quantity = 1;
  newSale.sale_date = new Date().toISOString().split("T")[0];
  newSale.tax_rate = "0";
  newSale.discount = "0";
}
</script>

<template>
  <!-- If formOnly is true, just render the content -->
  <div v-if="props.formOnly">
    <UCard class="mb-4">
      <template #header>
        <h3>{{ isEditing ? t('actions.edit.sale') : t('forms.saleForm.createTitle') }}</h3>
      </template>

      <div class="space-y-4">
        <UFormField :label="t('forms.saleForm.customerLabel')" name="saleCustomer">
          <USelect
            v-model="newSale.customer_id"
            :items="customerOptions"
            option-attribute="value"
            :placeholder="t('forms.selectCustomer')"
          />
        </UFormField>

        <UFormField :label="t('forms.saleForm.productLabel')" name="saleProduct">
          <USelect
            v-model="newSale.product_id"
            :items="productOptions"
            option-attribute="value"
            :placeholder="t('forms.saleForm.productPlaceholder')"
          />
        </UFormField>

        <UFormField :label="t('forms.saleForm.quantity')" name="saleQuantity">
          <UInput
            v-model.number="newSale.quantity"
            type="number"
            :min="1"
          />
        </UFormField>

        <UFormField :label="t('forms.saleForm.saleDateLabel')" name="saleDate">
          <UInput
            v-model="newSale.sale_date"
            type="date"
          />
        </UFormField>

        <UFormField :label="t('forms.saleForm.taxRateLabel')" name="saleTaxRate">
          <UInput
            v-model.number="newSale.tax_rate"
            type="number"
            :min="0"
            step="0.01"
          />
        </UFormField>

        <UFormField :label="t('forms.saleForm.discountLabel')" name="saleDiscount">
          <UInput
            v-model.number="newSale.discount"
            type="number"
            :min="0"
            step="0.01"
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
            :loading="isCreateSaleLoading || isUpdateSaleLoading"
            color="primary"
            variant="subtle"
            @click="submitHandler"
          >
            {{ isEditing ? t('actions.save') : t('forms.saleForm.createButton') }}
          </UButton>
        </div>
      </template>
    </UCard>
    <div v-if="error" class="mt-4 text-red-500">
      {{ error }}
    </div>
  </div>

  <!-- Else render the modal wrapper (Legacy/Default behavior) -->
  <UModal
    v-else
    v-model:open="isCreateModalOpen"
    :title="t('sales.create.title')"
    :description="t('sales.create.description')"
  >
    <UButton
      :label="t('dashboard.sales.create.button')"
      color="primary"
      variant="subtle"
    />

    <template #content>
      <UCard class="mb-4">
        <template #header>
          <h3>{{ t('forms.saleForm.createTitle') }}</h3>
        </template>

        <div class="space-y-4">
          <UFormField :label="t('forms.saleForm.customerLabel')" name="saleCustomer">
            <USelect
              v-model="newSale.customer_id"
              :items="customerOptions"
              option-attribute="value"
              :placeholder="t('forms.selectCustomer')"
            />
          </UFormField>

          <UFormField :label="t('forms.saleForm.productLabel')" name="saleProduct">
            <USelect
              v-model="newSale.product_id"
              :items="productOptions"
              option-attribute="value"
              :placeholder="t('forms.saleForm.productPlaceholder')"
            />
          </UFormField>

          <UFormField :label="t('forms.saleForm.quantity')" name="saleQuantity">
            <UInput
              v-model.number="newSale.quantity"
              type="number"
              :min="1"
            />
          </UFormField>

          <UFormField :label="t('forms.saleForm.saleDateLabel')" name="saleDate">
            <UInput
              v-model="newSale.sale_date"
              type="date"
            />
          </UFormField>

          <UFormField :label="t('forms.saleForm.taxRateLabel')" name="saleTaxRate">
            <UInput
              v-model.number="newSale.tax_rate"
              type="number"
              :min="0"
              step="0.01"
            />
          </UFormField>

          <UFormField :label="t('forms.saleForm.discountLabel')" name="saleDiscount">
            <UInput
              v-model.number="newSale.discount"
              type="number"
              :min="0"
              step="0.01"
            />
          </UFormField>
        </div>

        <template #footer>
          <UButton
            :loading="isCreateSaleLoading"
            color="primary"
            variant="subtle"
            @click="submitHandler"
          >
            {{ t('forms.saleForm.createButton') }}
          </UButton>
        </template>
      </UCard>

      <div v-if="error" class="mt-4 text-red-500">
        {{ error }}
      </div>
    </template>
  </UModal>
</template>
