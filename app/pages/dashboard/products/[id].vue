<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const productId = Number(route.params.id);

const productsStore = useProductsStore();
const { data, pending, error } = productsStore.getProductById(productId);

const { t } = useI18n();
const { deleteProduct } = useProductsApi();
const toast = useToast();
const localePath = useLocalePath();
const navigateTo = useNavigateTo();

const isDeleteModalOpen = ref(false);

async function handleDelete() {
  const result = await deleteProduct(productId);
  if (result) {
    toast.add({
      title: t("common.success"),
      description: t("forms.productForm.deletedSuccess"),
      color: "success",
    });
    navigateTo(localePath(ROUTES.PRODUCTS));
  }
  isDeleteModalOpen.value = false;
}

const UBadge = resolveComponent("UBadge");

const tableData = computed(() => [
  { label: t("tables.headers.id"), value: data.value?.id },
  { label: t("tables.headers.name"), value: data.value?.name },
  { label: t("tables.headers.description"), value: data.value?.description },
  { label: t("tables.headers.price"), value: data.value?.price ? `$${data.value.price}` : t("tables.data.na") },
  { label: t("tables.headers.stock"), value: data.value?.stock },
  { label: t("tables.headers.companyId"), value: data.value?.company_id },
]);

const tableColumns: TableColumn[] = [
  {
    accessorKey: "label",
    header: t("tables.headers.field"),
    meta: {
      class: {
        th: "w-1/3",
        td: "w-1/3",
      },
    },
    cell: ({ row }) => h("span", { class: "font-medium text-gray-700" }, row.getValue("label")),
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
    cell: ({ row }) => {
      const label = row.original.label;
      const value = row.getValue("value");

      if (value == null || value === "") {
        return h("span", { class: "text-gray-400 italic" }, "N/A");
      }

      if (label === t("tables.headers.id")) {
        return h(UBadge, { color: "primary", variant: "soft" }, () => String(value));
      }

      if (label === t("tables.headers.stock")) {
        const stockValue = Number(value);
        const color = stockValue > 0 ? "success" : "error";
        const labelText = stockValue > 0 ? t("product.inStock") : t("product.outOfStock");
        return h(UBadge, { color, variant: "subtle" }, () => labelText);
      }

      return h("span", {}, String(value));
    },
  },
];
</script>

<template>
  <UContainer>
    <UPageHeader
      :title="$t('details.product.title')"
      :description="$t('details.product.description', { id: productId })"
    >
      <UTable
        :data="tableData"
        :columns="tableColumns"
        class="w-full"
      />
      <template #actions>
        <UColorModeButton />
        <UDropdownMenu mode="click">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
            square
            :aria-label="$t('actions.more')"
          />
          <template #items>
            <UDropdownMenuItem
              icon="i-heroicons-pencil-square-20-solid"
              :label="$t('actions.edit.product')"
            />
            <UDropdownMenuItem
              icon="i-heroicons-currency-dollar-20-solid"
              :label="$t('actions.updatePrice')"
            />
            <UDropdownMenuItem
              icon="i-heroicons-trash-20-solid"
              :label="$t('actions.delete.product')"
              @click="isDeleteModalOpen = true"
            />
          </template>
        </UDropdownMenu>
      </template>
    </UPageHeader>

    <div class="space-y-6">
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
  </UContainer>
</template>
