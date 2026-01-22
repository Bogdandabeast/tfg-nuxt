<script setup lang="ts">
import { ACTION_ICONS } from "~/lib/icons";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const productId = Number(route.params.id);

const productsStore = useProductsStore();
const { data, pending, error } = productsStore.getProductById(productId);

const { t } = useI18n();

const isDeleteModalOpen = ref(false);

const menuItems = computed(() => [
  {
    label: t("actions.edit.product"),
    icon: ACTION_ICONS.editProduct,
    click: () => {
      // TODO: Implement edit functionality
    },
  },
  {
    label: t("actions.delete.product"),
    icon: ACTION_ICONS.deleteProduct,
    click: () => {
      isDeleteModalOpen.value = true;
    },
  },
]);

const UBadge = resolveComponent("UBadge");

const tableData = computed(() => [
  { label: t("tables.headers.id"), value: data.value?.id },
  { label: t("tables.headers.name"), value: data.value?.name },
  { label: t("tables.headers.description"), value: data.value?.description },
  { label: t("tables.headers.price"), value: data.value?.price ? `$${data.value.price}` : t("tables.data.na") },
  { label: t("tables.headers.stock"), value: data.value?.stock },
  { label: t("tables.headers.companyId"), value: data.value?.company_id },
]);

const tableColumns = [
  {
    accessorKey: "label",
    header: t("tables.headers.field"),
    meta: {
      class: {
        th: "w-1/3",
        td: "w-1/3",
      },
    },
    cell: ({ row }: { row: unknown }) => h("span", { class: "font-medium text-gray-700" }, (row as any).getValue("label")),
  },
  {
    accessorKey: "value",
    header: t("tables.headers.value"),
    meta: {
      class: {
        th: "w-2/3",
        td: "w-2/3",
      },
    },
    cell: ({ row }: { row: unknown }) => {
      const label = (row as any).original.label;
      const value = (row as any).getValue("value");

      if (value == null || value === "") {
        return "N/A";
      }

      if (label === t("tables.headers.id")) {
        return String(value);
      }

      if (label === t("tables.headers.stock")) {
        const stockValue = Number(value);
        return stockValue > 0 ? t("product.inStock") : t("product.outOfStock");
      }

      return String(value);
    },
  },
];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <DashboardNavBar />
    <UPageHeader
      :title="$t('details.product.title')"
      :description="$t('details.product.description', { id: productId })"
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
        :title="$t('details.product.error.title')"
        :description="error?.message || $t('details.product.error.description')"
      />

      <DashboardTableSkeleton
        v-else-if="pending"
        :columns="2"
        :rows="6"
        :show-header="false"
      >
        <UCard>
          <template #header>
            <div class="flex items-center gap-3">
              <UIcon name="i-heroicons-cube-20-solid" class="h-8 w-8" />
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

      <UCard v-else-if="data">
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-cube-20-solid" class="h-8 w-8 text-primary" />
            <div>
              <h3 class="text-lg font-semibold">
                {{ data.name }}
              </h3>
              <p class="text-sm text-gray-500">
                Product ID: {{ data.id }}
              </p>
            </div>
            <UBadge :color="data.stock > 0 ? 'green' : 'red'" variant="subtle">
              {{ data.stock > 0 ? 'In Stock' : 'Out of Stock' }}
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
