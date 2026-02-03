<script setup lang="ts">
import type { TableCellContext, TableRowData } from "~~/types/api";
import { ACTION_ICONS } from "~/lib/icons";
import { ROUTES } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const companyId = route.params.id as string;

const companiesStore = useCompaniesStore();
const { data, pending, error } = companiesStore.getCompanyById(companyId);

const { t } = useI18n();
const { deleteCompany } = useCompaniesApi();
const toast = useToast();
const localePath = useLocalePath();

const isDeleteModalOpen = ref(false);
const isEditModalOpen = ref(false);
const isDeleting = ref(false);

async function handleDelete() {
  if (isDeleting.value)
    return;

  if (companiesStore.currentCompany?.id === companyId) {
    toast.add({
      title: t("common.error"),
      description: t("companies.manage.deleteCurrentCompanyError"),
      color: "error",
    });
    isDeleteModalOpen.value = false;
    return;
  }

  isDeleting.value = true;
  try {
    const result = await deleteCompany(companyId);
    if (result) {
      toast.add({
        title: t("common.success"),
        description: t("forms.companyForm.deletedSuccess"),
        color: "success",
      });
      navigateTo(localePath(ROUTES.COMPANIES));
    }
  }
  finally {
    isDeleting.value = false;
    isDeleteModalOpen.value = false;
  }
}

const menuItems = computed(() => [
  {
    label: t("actions.edit.company"),
    icon: ACTION_ICONS.editCompany,
    click: () => {
      isEditModalOpen.value = true;
    },
  },
  {
    label: t("actions.delete.company"),
    icon: ACTION_ICONS.deleteCompany,
    disabled: companiesStore.currentCompany?.id === companyId,
    click: () => {
      isDeleteModalOpen.value = true;
    },
  },
]);

const UBadge = resolveComponent("UBadge");

const tableData = computed<TableRowData[]>(() => [
  { label: t("tables.headers.id"), value: data.value?.id },
  { label: t("tables.headers.name"), value: data.value?.name },
  { label: t("tables.headers.userId"), value: data.value?.user_id },
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

      if (value == null || value === "") {
        return h("span", { class: "text-gray-400 italic" }, t("common.na"));
      }

      if (label === t("tables.headers.id")) {
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
        :title="t('details.company.title')"
        :description="t('details.company.description', { id: companyId })"
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
          :title="t('details.company.error.title')"
          :description="error?.message || t('details.company.error.description')"
        />

        <DashboardTableSkeleton
          v-else-if="pending"
          :columns="2"
          :rows="3"
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
                  {{ t('companies.companyId', { id: data.id }) }}
                </p>
              </div>
              <UBadge color="green" variant="subtle">
                {{ t('status.active') }}
              </UBadge>

              <UModal v-model:open="isEditModalOpen" :title="t('actions.edit.company')">
                <UButton
                  :label="t('actions.edit.company')"
                  color="secondary"
                  variant="subtle"
                />
                <template #content>
                  <div class="p-4">
                    <DashboardFormsCompanyForm
                      form-only
                      :initial-data="data"
                      @success="isEditModalOpen = false"
                      @cancel="isEditModalOpen = false"
                    />
                  </div>
                </template>
              </UModal>

              <UModal v-model:open="isDeleteModalOpen" :title="t('company.delete.title')">
                <UButton
                  :label="t('actions.delete.company')"
                  color="error"
                  variant="subtle"
                  :disabled="companiesStore.currentCompany?.id === companyId"
                />
                <template #content>
                  <div class="p-4 space-y-4">
                    <p>{{ t('company.delete.description') }}</p>
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
