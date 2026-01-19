<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const customerId = Number(route.params.id);

const customersStore = useCustomersStore();
const { data, pending, error } = customersStore.getCustomerById(customerId);
const { t } = useI18n();

const isDeleteModalOpen = ref(false);

async function handleDelete() {
  // Implement delete logic
  isDeleteModalOpen.value = false;
}

const UBadge = resolveComponent("UBadge");

const tableData = computed(() => [
  { label: t('tables.headers.id'), value: data.value?.id },
  { label: t('tables.headers.name'), value: data.value?.name },
  { label: t('tables.headers.email'), value: data.value?.email },
  { label: t('tables.headers.phone'), value: data.value?.phone },
  { label: t('tables.headers.address'), value: data.value?.address },
  { label: t('tables.headers.companyId'), value: data.value?.company_id },
]);

const tableColumns = [
  {
    accessorKey: "label",
    header: t('tables.headers.field'),
    cell: ({ row }: { row: Record<string, any> }) =>
      h("span", { class: "font-medium" }, row.getValue("label")),
  },
  {
    accessorKey: "value",
    header: t('tables.headers.value'),
    cell: ({ row }: { row: Record<string, any> }) => {
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
  <UContainer>
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
          <template #items>
            <UDropdownMenuItem
              icon="i-heroicons-pencil-square-20-solid"
              :label="$t('actions.edit.customer')"
            />
            <UDropdownMenuItem
              icon="i-heroicons-envelope-20-solid"
              :label="$t('actions.sendEmail')"
            />
            <UDropdownMenuItem
              icon="i-heroicons-trash-20-solid"
              :label="$t('actions.delete.customer')"
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
          :title="$t('details.customer.error.title')"
          :description="error?.message || $t('details.customer.error.description')"
        />

      <UCard v-else-if="pending">
        <template #header>
          <USkeleton class="h-6 w-32" />
        </template>
        <div class="space-y-4">
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </UCard>

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
  </UContainer>
</template>
