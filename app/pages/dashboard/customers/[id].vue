<script lang="ts" setup>
import { ACTION_ICONS } from "~/lib/icons";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const customerId = Number(route.params.id);

const customersStore = useCustomersStore();
const { data, pending, error } = customersStore.getCustomerById(customerId);

const { t } = useI18n();

const isDeleteModalOpen = ref(false);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const menuItems = computed(() => [
  {
    label: t("actions.edit.customer"),
    icon: ACTION_ICONS.editCustomer,
    click: () => {
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

const tableData = computed(() => [
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
    cell: ({ row }: { row: any }) =>
      h("span", { class: "font-medium" }, row.getValue("label")),
  },
  {
    accessorKey: "value",
    header: t("tables.headers.value"),
    cell: ({ row }: { row: any }) => {
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
    <DashboardNavBar />
    <UPageHeader
      :title="$t('details.customer.title')"
      :description="$t('details.customer.description', { id: customerId })"
    >
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
          :items="menuItems"
        </UDropdownMenu>
      </template>
    </UPageHeader>

    <div class="space-y-6 p-4">
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle-20-solid"
        :title="$t('details.customer.error.title')"
        :description="error?.message || $t('details.customer.error.description')"
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
              :initials="data.name.split(' ').map(n => n[0]).join('').toUpperCase()"
            />
            <div>
              <h3 class="text-lg font-semibold">
                {{ data.name }}
              </h3>
              <p class="text-sm text-gray-500">
                Customer ID: {{ data.id }}
              </p>
            </div>
            <UBadge color="blue" variant="subtle">
              {{ t('tables.data.active') }}
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
  </UDashboardPanel>
</template>
