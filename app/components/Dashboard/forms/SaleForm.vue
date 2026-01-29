<script setup lang="ts">
import type { Customer } from "~~/lib/db/queries/customers";
import type { Product } from "~~/lib/db/queries/products";
import { storeToRefs } from "pinia";

const { t } = useI18n();
const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const toast = useToast();
const isCreateModalOpen = ref(false);
const { isCreateSaleLoading, createSale } = useSalesApi();

const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const newSale = reactive({
  customer_id: undefined as string | undefined,
  product_id: undefined as string | undefined,
  quantity: 1,
  sale_date: new Date().toISOString().split("T")[0],
  tax_rate: 0,
  discount: 0,
});

const error = ref("");

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

async function createSaleHandler() {
  if (!companiesStore.currentCompany?.id) {
    error.value = t("forms.saleForm.noCompany");
    return;
  }
  if (!newSale.customer_id || !newSale.product_id || newSale.quantity <= 0) {
    error.value = t("forms.saleForm.invalidData");
    return;
  }

  const product = selectedProduct.value;
  const customer = selectedCustomer.value;

  if (!product || !customer || !newSale.sale_date) {
    error.value = t("forms.saleForm.missingDetails");
    return;
  }

  const saleData = {
    customer_id: newSale.customer_id,
    product_id: newSale.product_id,
    quantity: newSale.quantity,
    sale_date: newSale.sale_date,
    product_name: product.name,
    unit_price: Number.parseFloat(product.price),
    customer_name: customer.name,
    tax_rate: newSale.tax_rate,
    discount: newSale.discount,
    company_id: companiesStore.currentCompany.id,
  };

  const result = await createSale(saleData);
  if (result) {
    salesStore.refreshSales();
    newSale.customer_id = undefined;
    newSale.product_id = undefined;
    newSale.quantity = 1;
    newSale.sale_date = new Date().toISOString().split("T")[0];
    newSale.tax_rate = 0;
    newSale.discount = 0;
    toast.add({
      title: t("common.success"),
      description: t("forms.saleForm.createdSuccess"),
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
