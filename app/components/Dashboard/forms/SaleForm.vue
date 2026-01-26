<script setup lang="ts">
import type { Customer } from "~~/lib/db/queries/customers";
import type { Product } from "~~/lib/db/queries/products";
import { storeToRefs } from "pinia";

const emit = defineEmits(["close"]);

const { t } = useI18n();
const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const isCreateModalOpen = ref(false);
const { isCreateSaleLoading, createSale, isDeleteSaleLoading, deleteSale } = useSalesApi();

const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const newSale = reactive({
  customer_id: undefined as number | undefined,
  product_id: undefined as number | undefined,
  quantity: 1,
});

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
    error.value = t("forms.saleForm.noCompany");
    return;
  }
  if (!newSale.customer_id || !newSale.product_id || newSale.quantity <= 0) {
    error.value = t("forms.saleForm.invalidData");
    return;
  }
  const saleData = {
    customer_id: Number(newSale.customer_id),
    product_id: Number(newSale.product_id),
    quantity: newSale.quantity,
    company_id: companiesStore.currentCompany.id,
  };
  const result = await createSale(saleData);
  if (result) {
    salesStore.refreshSales();
    newSale.customer_id = undefined;
    newSale.product_id = undefined;
    newSale.quantity = 1;
    toast.add({
      title: t("common.success"),
      description: t("forms.saleForm.createdSuccess"),
      color: "success",
    });
    error.value = "";
    emit("close");
  }
}

async function deleteSaleHandler() {
  const id = Number(saleToDeleteId.value);
  if (!saleToDeleteId.value || Number.isNaN(id)) {
    error.value = t("forms.saleForm.idInvalid");
    return;
  }
  const success = await deleteSale(id, companiesStore.currentCompany!.id);
  if (success) {
    salesStore.refreshSales();
    saleToDeleteId.value = "";
    toast.add({
      title: t("common.success"),
      description: t("forms.saleForm.deletedSuccess"),
      color: "success",
    });
    error.value = "";
  }
}
</script>

<template>
  <UModal
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
        </div>

        <template #footer>
          <UButton
            :loading="isCreateSaleLoading"
            color="primary"
            variant="subtle"
            @click="createSaleHandler"
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
