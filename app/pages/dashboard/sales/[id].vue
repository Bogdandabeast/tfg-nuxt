<script setup lang="ts">
import type { TableCellContext, TableRowData } from "~~/types/api";
import { h, resolveComponent } from "vue";
import { ACTION_ICONS } from "~/lib/icons";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const saleId = route.params.id as string;

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const { data: saleData, pending, error, refresh } = salesStore.getSaleById(saleId);

const { t, locale } = useI18n();
const { deleteSale } = useSalesApi();
const toast = useToast();
const localePath = useLocalePath();

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleting = ref(false);

async function handleDelete() {
  if (isDeleting.value || !saleData.value?.company_id)
    return;

  isDeleting.value = true;

  try {
    const success = await deleteSale(saleId, saleData.value.company_id);

    if (success === true) {
      toast.add({
        title: t("common.success"),
        description: t("forms.saleForm.deletedSuccess"),
        color: "success",
      });
      isDeleteModalOpen.value = false;
      navigateTo(localePath(ROUTES.SALES));
    }
    else {
      toast.add({
        title: t("common.error"),
        description: t("forms.saleForm.deletedError"),
        color: "error",
      });
    }
  }
  catch {
    toast.add({
      title: t("common.error"),
      description: t("forms.saleForm.deletedError"),
      color: "error",
    });
  }
  finally {
    isDeleting.value = false;
  }
}

const customerData = computed(() => {
  if (!saleData.value?.customer_id)
    return null;

  const { data } = customersStore.getCustomerById(saleData.value.customer_id);
  return data.value;
});

const productData = computed(() => {
  if (!saleData.value?.product_id)
    return null;

  const { data } = productsStore.getProductById(saleData.value.product_id);
  return data.value;
});

const menuItems = computed(() => [

  {

    label: t("actions.edit.sale"),

    icon: ACTION_ICONS.editSale,

    click: () => {
      isEditModalOpen.value = true;
    },

  },

  {

    label: t("actions.processRefund"),

    icon: ACTION_ICONS.processRefund,

    disabled: true,

    click: () => {

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

const UBadge = resolveComponent("UBadge");

const tableData = computed<TableRowData[]>(() => {
  const data: TableRowData[] = [
    { label: t("tables.headers.id"), value: saleData.value?.id },
    { label: t("tables.headers.customer"), value: customerData.value?.name || saleData.value?.customer_name },
    { label: t("tables.headers.email"), value: customerData.value?.email },
    { label: t("tables.headers.product"), value: productData.value?.name || saleData.value?.product_name },
    { label: t("tables.headers.price"), value: saleData.value?.unit_price ?? productData.value?.price },
    { label: t("tables.headers.quantity"), value: saleData.value?.quantity },
    { label: t("tables.headers.discount"), value: saleData.value?.discount && Number(saleData.value.discount) !== 0 ? saleData.value.discount : null },
    { label: t("tables.headers.tax_rate"), value: saleData.value?.tax_rate && Number(saleData.value.tax_rate) !== 0 ? saleData.value.tax_rate : null },
    { label: t("tables.headers.total"), value: saleData.value?.total },
    { label: t("tables.headers.date"), value: saleData.value?.sale_date ? new Date(saleData.value.sale_date).toLocaleString(locale.value) : null },
    { label: t("tables.headers.description"), value: saleData.value?.description || saleData.value?.product_description },
    { label: t("tables.headers.companyId"), value: saleData.value?.company_id },
  ];

  return data.filter(row => row.value != null && row.value !== "");
});

const tableColumns = [

  {

    accessorKey: "label",

    header: t("tables.headers.field"),

    cell: ({ row }: TableCellContext<TableRowData>) =>

      h("span", { class: "font-medium" }, String(row.getValue("label"))),

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

      if (label === t("tables.headers.id") || label === t("tables.headers.quantity")) {
        return h(UBadge, { color: "primary", variant: "soft" }, () => String(value));
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

        :title="t('details.sale.title')"

        :description="t('details.sale.description', { id: saleId })"
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

          :title="t('details.sale.error.title')"

          :description="error?.message || t('details.sale.error.description')"
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

        <UCard v-else-if="saleData">
          <template #header>
            <div class="flex items-center gap-3">
              <div>
                <h3 class="text-lg font-semibold">
                  {{ t('forms.saleForm.idLabel', { id: saleData.id }) }}
                </h3>

                <p class="text-sm text-gray-500">
                  {{ t('forms.saleForm.saleDateLabel') }}: {{ new Date(saleData.sale_date).toLocaleString(locale) }}
                </p>
              </div>

              <UBadge color="green" variant="subtle">
                {{ t('tables.data.active') }}
              </UBadge>
              <UModal
                v-model:open="isEditModalOpen"
                :title="t('actions.edit.sale')"
                :description="t('actions.edit.sale')"
              >
                <UButton
                  :label="t('actions.edit.sale')"
                  color="secondary"
                  variant="subtle"
                />
                <template #content>
                  <div class="p-4">
                    <DashboardFormsSaleForm
                      form-only
                      :initial-data="saleData"
                      @success="() => { isEditModalOpen = false; refresh(); }"
                      @cancel="isEditModalOpen = false"
                    />
                  </div>
                </template>
              </UModal>

              <UModal
                v-model:open="isDeleteModalOpen"
                :title="t('actions.delete.sale')"
                :description="t('actions.delete.sale')"
              >
                <UButton
                  :label="t('actions.delete.sale')"
                  color="error"
                  variant="subtle"
                />
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
                        {{ t('actions.delete.sale') }}
                      </UButton>
                    </div>
                  </div>
                </template>
              </UModal>
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
  </UDashboardPanel>
</template>
