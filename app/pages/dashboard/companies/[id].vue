<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const companyId = route.params.id as string;

const companiesStore = useCompaniesStore();
const { data, pending, error } = companiesStore.getCompanyById(Number(companyId));

const isDeleteModalOpen = ref(false);

async function handleDelete() {
  // Implement delete logic
  isDeleteModalOpen.value = false;
}

const UBadge = resolveComponent("UBadge");

const tableData = computed(() => [
  { label: "ID", value: data.value?.id },
  { label: "Name", value: data.value?.name },
  { label: "User ID", value: data.value?.user_id },
]);

const tableColumns = [
  { accessorKey: "label", header: "Field", cell: ({ row }: { row: Record<string, any> }) => h("span", { class: "font-medium" }, row.getValue("label")) },
  { accessorKey: "value", header: "Value", cell: ({ row }: { row: Record<string, any> }) => {
    const label = row.original.label;
    const value = row.getValue("value");
    if (label === "ID") {
      return h(UBadge, { color: "primary", variant: "soft" }, () => value);
    }
    return h("span", {}, () => value);
  } },
];

const tabItems = [
  { label: "General Information", slot: "general" },
  { label: "Actions", slot: "actions" },
];
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Company Details"
      :description="`Viewing company ${companyId}`"
    >
      <template #actions>
        <UColorModeButton />
        <UDropdownMenu mode="click">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
            square
            aria-label="More actions"
          />
          <template #items>
            <UDropdownMenuItem
              icon="i-heroicons-pencil-square-20-solid"
              label="Edit Company"
            />
            <UDropdownMenuItem
              icon="i-heroicons-trash-20-solid"
              label="Delete Company"
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
        title="Error loading company"
        :description="error?.message || 'An error occurred'"
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
            <UIcon name="i-heroicons-building-office-20-solid" class="h-8 w-8 text-primary" />
            <div>
              <h3 class="text-lg font-semibold">
                {{ data.name }}
              </h3>
              <p class="text-sm text-gray-500">
                Company ID: {{ data.id }}
              </p>
            </div>
            <UBadge color="green" variant="subtle">
              Active
            </UBadge>
          </div>
        </template>

        <UTabs :items="[{ label: 'General Information', slot: 'general' }, { label: 'Actions', slot: 'actions' }]">
          <template #general>
            <UTable
              :data="tableData"
              :columns="tableColumns"
              class="w-full"
            />
          </template>

          <template #actions>
            <div class="space-y-4">
              <UButton
                icon="i-heroicons-pencil-square-20-solid"
                size="lg"
                block
              >
                Edit Company
              </UButton>
              <UButton
                icon="i-heroicons-eye-20-solid"
                variant="outline"
                size="lg"
                block
                to="/dashboard/companies"
              >
                View All Companies
              </UButton>
            </div>
          </template>
        </UTabs>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              variant="ghost"
              to="/dashboard/companies"
            >
              Back to Companies
            </UButton>
            <div class="flex gap-2">
              <UButton
                icon="i-heroicons-share-20-solid"
                variant="ghost"
                size="sm"
              >
                Share
              </UButton>
              <UButton
                icon="i-heroicons-bookmark-20-solid"
                variant="ghost"
                size="sm"
              >
                Bookmark
              </UButton>
            </div>
          </div>
        </template>
      </UCard>

      <UCard v-else>
        <UEmpty
          icon="i-heroicons-building-office-20-solid"
          title="Company not found"
          description="The requested company could not be found."
        >
          <UButton to="/dashboard/companies">
            Back to Companies
          </UButton>
        </UEmpty>
      </UCard>
    </div>

    <UModal v-model="isDeleteModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Delete Company
          </h3>
        </template>
        <p>Are you sure you want to delete this company? This action cannot be undone.</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="isDeleteModalOpen = false">
              Cancel
            </UButton>
            <UButton color="error" @click="handleDelete">
              Delete
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>
