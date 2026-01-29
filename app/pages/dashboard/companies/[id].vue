<script setup lang="ts">
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const companyIdStr = route.params.id as string;
const companyId = Number(companyIdStr);

if (Number.isNaN(companyId)) {
  throw createError({ statusCode: 404, statusMessage: "Invalid company ID" });
}

const companiesStore = useCompaniesStore();
const { data, pending, error } = companiesStore.getCompanyById(companyId);

const { t } = useI18n();
const { deleteCompany } = useCompaniesApi();
const toast = useToast();
const localePath = useLocalePath();

const isDeleteModalOpen = ref(false);
const isDeleting = ref(false);

type _RowData = {
  label: string;
  value: string | number | undefined;
};

async function handleDelete() {
  if (isDeleting.value)
    return;
  isDeleting.value = true;
  try {
    const result = await deleteCompany(companyId);
    if (result) {
      toast.add({
        title: t("common.success"),
        description: t("forms.companyForm.deletedSuccess"),
        color: "success",
      });
      navigateTo(localePath(ROUTES.DASHBOARD.COMPANIES));
    }
  }
  finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
}

const UBadge = resolveComponent("UBadge");

const tableData = computed(() => [
  { label: t("tables.headers.id"), value: data.value?.id },
  { label: t("tables.headers.name"), value: data.value?.name },
  { label: t("tables.headers.userId"), value: data.value?.user_id },
]);

const tableColumns = [
  { accessorKey: "label", header: t("tables.headers.field"), cell: ({ row }: { row: Record<string, any> }) => h("span", { class: "font-medium" }, row.getValue("label")) },
  { accessorKey: "value", header: t("tables.headers.value"), cell: ({ row }: { row: Record<string, any> }) => {
    const label = row.original.label;
    const value = row.getValue("value");
    if (label === "ID") {
      return h(UBadge, { color: "primary", variant: "soft" }, () => value);
    }
    return h("span", {}, () => value);
  } },
];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <DashboardNavBar />
    <UPageHeader
      :title="$t('details.company.title')"
      :description="$t('details.company.description', { id: companyId })"
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
              :label="$t('actions.edit.company')"
            />
            <UDropdownMenuItem
              icon="i-heroicons-trash-20-solid"
              :label="$t('actions.delete.company')"
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
        :title="$t('details.company.error.title')"
        :description="error?.message || $t('details.company.error.description')"
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
              {{ t('status.active') }}
            </UBadge>
          </div>
        </template>

        <UTable
          :data="tableData"
          :columns="tableColumns"
          class="w-full"
        />

        <USeparator />

        <div class="space-y-4">
          <UButton
            icon="i-heroicons-pencil-square-20-solid"
            size="lg"
            block
          >
            {{ t('company.edit') }}
          </UButton>
          <UButton
            icon="i-heroicons-eye-20-solid"
            variant="outline"
            size="lg"
            block
            :to="localePath(ROUTES.DASHBOARD.COMPANIES)"
          >
            {{ t('company.viewAll') }}
          </UButton>
        </div>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              variant="ghost"
              :to="localePath(ROUTES.DASHBOARD.COMPANIES)"
            >
              {{ t('company.backToList') }}
            </UButton>
            <div class="flex gap-2">
              <UButton
                icon="i-heroicons-share-20-solid"
                variant="ghost"
                size="sm"
              >
                {{ t('actions.share') }}
              </UButton>
              <UButton
                icon="i-heroicons-bookmark-20-solid"
                variant="ghost"
                size="sm"
              >
                {{ t('actions.bookmark') }}
              </UButton>
            </div>
          </div>
        </template>
      </UCard>

      <UCard v-else>
        <UEmpty
          icon="i-heroicons-building-office-20-solid"
          :title="$t('details.company.notFound.title')"
          :description="$t('details.company.notFound.description')"
        >
          <UButton :to="localePath(ROUTES.DASHBOARD.COMPANIES)">
            {{ t('company.backToList') }}
          </UButton>
        </UEmpty>
      </UCard>
    </div>

    <UModal v-model="isDeleteModalOpen" :description="t('company.delete.description')">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            {{ t('company.delete.title') }}
          </h3>
        </template>
        <p>{{ t('company.delete.description') }}</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="isDeleteModalOpen = false">
              {{ t('actions.cancel') }}
            </UButton>
            <UButton
              color="error"
              :loading="isDeleting"
              :disabled="isDeleting"
              @click="handleDelete"
            >
              {{ t('actions.delete') }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UDashboardPanel>
</template>
