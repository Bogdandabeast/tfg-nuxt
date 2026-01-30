<script setup lang="ts">
import type { TableCellContext, TableRowData } from "~/types/api";
import { ACTION_ICONS } from "~/lib/icons";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const productId = route.params.id as string;

const productsStore = useProductsStore();
const { data, pending, error } = productsStore.getProductById(productId);

const { t } = useI18n();
const { deleteProduct } = useProductsApi();
const toast = useToast();
const localePath = useLocalePath();

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleting = ref(false);

async function handleDelete() {
  if (isDeleting.value)
    return;
  isDeleting.value = true;
  try {
    const success = await deleteProduct(productId);
    if (success === true) {
      toast.add({
        title: t("common.success"),
        description: t("forms.productForm.deletedSuccess"),
        color: "success",
      });
      navigateTo(localePath(ROUTES.PRODUCTS));
    }
  }
  finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
}

const menuItems = computed(() => [
  {
    label: t("actions.edit.product"),
    icon: ACTION_ICONS.editProduct,
    click: () => {
      isEditModalOpen.value = true;
    },
  },
  {
    label: t("actions.updatePrice"),
    icon: ACTION_ICONS.updatePrice,
    click: () => {
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

const tableData = computed<TableRowData[]>(() => [
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
    cell: ({ row }: TableCellContext<TableRowData>) =>
      h("span", { class: "font-medium" }, row.getValue("label")),
  },
  {
    accessorKey: "value",
    header: t("tables.headers.value"),
    cell: ({ row }: TableCellContext<TableRowData>) => {
      const label = row.original.label;
      const value = row.getValue("value");

      if (value == null || value === "") {
        return h("span", { class: "text-gray-400 italic" }, t("common.na"));
      }

      if (label === t("tables.headers.id")) {
        return h(UBadge, { color: "primary", variant: "soft" }, () => String(value));
      }

      if (label === t("tables.headers.stock")) {
        const stockValue = Number(value);
        return h("span", {}, stockValue > 0 ? t("product.inStock") : t("product.outOfStock"));
      }

      return h("span", {}, String(value));
    },
  },
];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="m-5">
      <DashboardNavbar />
      <UPageHeader
        :title="t('details.product.title')"
        :description="t('details.product.description', { id: productId })"
      >
        <template #actions>
          <UColorModeButton />
          <UDropdownMenu :items="menuItems" mode="click">
            <UButton
              color="neutral"
              variant="soft"
              icon="i-heroicons-ellipsis-horizontal-20-solid"
              square
              :aria-label="t('actions.more')"
            />
          </UDropdownMenu>
        </template>
      </UPageHeader>

      <div class="space-y-6">
        <UAlert
          v-if="error"
          color="error"
          variant="subtle"
          icon="i-heroicons-exclamation-triangle-20-solid"
          :title="t('details.product.error.title')"
          :description="error?.message || t('details.product.error.description')"
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
                <UAvatar size="2xl" />
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
              <UAvatar
                :src="null"
                :alt="data.name"
                size="2xl"
                :initials="data.name.split(' ').map(n => n[0]).join('').toUpperCase()"
              />
              <div>
                <h3 class="text-lg font-semibold">
                  {{ data.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  Product ID: {{ data.id }}
                </p>
              </div>
              <UBadge :color="data.stock > 0 ? 'green' : 'red'" variant="subtle">
                {{ data.stock > 0 ? t('product.inStock') : t('product.outOfStock') }}
              </UBadge>
            </div>
          </template>

          <UTable
            :data="tableData"
            :columns="tableColumns"
            class="w-full"
          />
        </UCard>
      </div>
    </div>

    <!-- Modals -->
    <UModal v-model:open="isEditModalOpen" :title="t('actions.edit.product')">
      <template #content>
        <div class="p-4">
          <DashboardFormsProductForm :initial-data="data" @success="isEditModalOpen = false" />
        </div>
      </template>
    </UModal>

    <UModal v-model:open="isDeleteModalOpen" :title="t('actions.delete.product')">
      <template #content>
        <div class="p-4 space-y-4">
          <p>{{ t('common.deleteConfirmation') }}</p>
          <div class="flex justify-end gap-2">
            <UButton
              color="neutral"
              variant="soft"
              @click="isDeleteModalOpen = false"
            >
              {{ t('actions.cancel') }}
            </UButton>
            <UButton
              color="error"
              :loading="isDeleting"
              @click="handleDelete"
            >
              {{ t('actions.delete') }}
            </UButton>
          </div>
        </div>
      </template>
    </UModal>
  </UDashboardPanel>
</template>
