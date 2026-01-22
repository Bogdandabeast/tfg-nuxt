<script setup lang="ts">
import { ACTION_ICONS } from "~/lib/icons";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const saleId = route.params.id as string;

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const { data: saleData, pending, error } = salesStore.getSaleById(saleId);

const { t, locale } = useI18n();

// Make customer data reactive - only fetch when saleData is available
const customerData = computed(() => {
  if (!saleData.value?.customer_id)
    return null;
  const { data } = customersStore.getCustomerById(saleData.value.customer_id);
  return data.value;
});

// Make product data reactive - only fetch when saleData is available
const productData = computed(() => {
  if (!saleData.value?.product_id)
    return null;
  const { data } = productsStore.getProductById(saleData.value.product_id);
  return data.value;
});

const isDeleteModalOpen = ref(false);

const menuItems = computed(() => [
  {
    label: t("actions.edit.sale"),
    icon: ACTION_ICONS.editSale,
    click: () => {
      // TODO: Implement edit sale logic
    },
  },
  {
    label: t("actions.delete.sale"),
    icon: ACTION_ICONS.deleteSale,
    click: () => {
      isDeleteModalOpen.value = true;
    },
  },
]);

const tableData = computed(() => [
  { label: t("tables.headers.id"), value: saleData.value?.id },
  { label: t("tables.headers.customer"), value: customerData.value?.name || t("tables.data.loading") },
  { label: t("tables.headers.email"), value: customerData.value?.email || t("tables.data.loading") },
  { label: t("tables.headers.product"), value: productData.value?.name || t("tables.data.unknown") },
  { label: t("tables.headers.price"), value: productData.value?.price != null ? `$${productData.value.price}` : t("tables.data.loading") },
  { label: t("tables.headers.stock"), value: productData.value?.stock ?? t("tables.data.loading") },
  { label: t("tables.headers.quantity"), value: saleData.value?.quantity },
  { label: t("tables.headers.date"), value: saleData.value?.sale_date ? new Date(saleData.value.sale_date).toLocaleString(locale.value) : t("tables.data.na") },
  { label: t("tables.headers.companyId"), value: saleData.value?.company_id },
]);

const tableColumns = [
  {
    accessorKey: "label",
    header: t("tables.headers.field"),
    cell: ({ row }: { row: unknown }) =>
      h("span", { class: "font-medium" }, (row as any).getValue("label")),
  },
  {
    accessorKey: "value",
    header: t("tables.headers.value"),
    cell: ({ row }: { row: unknown }) => {
      const label = (row as any).original.label;
      const value = (row as any).getValue("value");

      // Manejar valores vacíos
      if (value == null || value === "") {
        return h("span", { class: "text-gray-400 italic" }, t("common.na"));
      }

      // Use badges for ID and quantity fields
      if (label === t("tables.headers.id") || label === t("tables.headers.quantity")) {
        return h(resolveComponent("UBadge"), { color: "secondary", variant: "soft" }, () => String(value));
      }

      return h("span", {}, String(value));
    },
  },
];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <DashboardNavBar />
    <UPageHeader
      :title="$t('details.sale.title')"
      :description="$t('details.sale.description', { id: saleId })"
    >
      <template #actions>
        <UColorModeButton />
        <UDropdownMenu :items="menuItems" mode="click">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
            square
            :aria-label="$t('actions.more')"
          />
        </UDropdownMenu>
      </template>
    </UPageHeader>

    <div class="space-y-6 p-4">
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle-20-solid"
        :title="$t('details.sale.error.title')"
        :description="error?.message || $t('details.sale.error.description')"
      />

      <DashboardTableSkeleton
        v-else-if="pending"
        :columns="2"
        :rows="8"
        :show-header="false"
      >
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-shopping-bag-20-solid" class="h-8 w-8" />
              <div class="space-y-2">
                <USkeleton class="h-6 w-32" />
                <USkeleton class="h-4 w-24" />
              </div>
            </div>
          </template>

          <UTable
            :data="tableData"
            :columns="tableColumns"
            class="w-full"
          />
        </UCard>
      </DashboardTableSkeleton>

      <UCard v-else-if="saleData">
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-shopping-bag-20-solid" class="h-8 w-8 text-primary" />
            <div>
              <h3 class="text-lg font-semibold">
                Sale #{{ saleData.id }}
              </h3>
              <p class="text-sm text-gray-500">
                Sale Date: {{ new Date(saleData.sale_date).toLocaleDateString() }}
              </p>
            </div>
            <UBadge color="success" variant="subtle">
              Completed
            </UBadge>
          </div>
        </template>

        <div class="space-y-6">
          <UTable
            :data="tableData"
            :columns="tableColumns"
            class="w-full"
          />
        </div>
      </UCard>
    </div>
  </UDashboardPanel>
</template>
