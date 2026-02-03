<script lang="ts" setup>
import type { TableCellContext, TableRowData } from "~~/types/api";
import { ACTION_ICONS } from "~/lib/icons";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const customerId = route.params.id as string;

const customersStore = useCustomersStore();
const { data, pending, error } = customersStore.getCustomerById(customerId);

const { t } = useI18n();
const { deleteCustomer } = useCustomersApi();
const localePath = useLocalePath();

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleting = ref(false);

async function handleDelete() {
  if (isDeleting.value)
    return;
  isDeleting.value = true;
  try {
    const success = await deleteCustomer(customerId);
    if (success === true) {
      navigateTo(localePath(ROUTES.CUSTOMERS));
    }
  }
  finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
}

const menuItems = computed(() => [
  {
    label: t("actions.edit.customer"),
    icon: ACTION_ICONS.editCustomer,
    click: () => {
      isEditModalOpen.value = true;
    },
  },
  {
    label: t("actions.sendEmail"),
    icon: ACTION_ICONS.sendEmail,
  },
  {
    label: t("actions.delete.customer"),
    icon: ACTION_ICONS.deleteCustomer,
    click: () => {
      isDeleteModalOpen.value = true;
    },
  },
]);

const UBadge = resolveComponent("UBadge");

const tableData = computed<TableRowData[]>(() => [
  { label: t("tables.headers.id"), value: data.value?.id },
  { label: t("tables.headers.name"), value: data.value?.name },
  { label: t("tables.headers.email"), value: data.value?.email },
  { label: t("tables.headers.phone"), value: data.value?.phone },
  { label: t("tables.headers.address"), value: data.value?.address },
  { label: t("tables.headers.companyId"), value: data.value?.company_id },
]);

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

      if (label === "ID") {
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
        :title="t('details.customer.title')"
        :description="t('details.customer.description', { id: customerId })"
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
          :title="t('details.customer.error.title')"
          :description="error?.message || t('details.customer.error.description')"
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
                :src="undefined"
                :alt="data.name"
                size="2xl"
                :initials="data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()"
              />
              <div>
                <h3 class="text-lg font-semibold">
                  {{ data.name }}
                </h3>
                <p class="text-sm text-gray-500">
                  {{ t('customers.customerId', { id: data.id }) }}
                </p>
              </div>
              <UBadge color="blue" variant="subtle">
                {{ t('tables.data.active') }}
              </UBadge>

              <UModal
                v-model:open="isEditModalOpen"
                :title="t('actions.edit.customer')"
                :description="t('actions.edit.customer')"
              >
                <UButton
                  :label="t('actions.edit.customer')"
                  color="secondary"
                  variant="subtle"
                />
                <template #content>
                  <div class="p-4">
                    <DashboardFormsCustomerForm
                      form-only
                      :initial-data="data"
                      @success="isEditModalOpen = false"
                      @cancel="isEditModalOpen = false"
                    />
                  </div>
                </template>
              </UModal>

              <UModal
                v-model:open="isDeleteModalOpen"
                :title="t('actions.delete.customer')"
                :description="t('actions.delete.customer')"
              >
                <UButton
                  :label="t('actions.delete.customer')"
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
                        {{ t('actions.delete.customer') }}
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
