<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { storeToRefs } from "pinia";
import { NAVIGATION_ICONS } from "~/lib/icons";
import { ROUTES } from "~/utils/routes";

defineProps<{
  collapsed?: boolean;
}>();

const companiesStore = useCompaniesStore();
const { companies, currentCompany } = storeToRefs(companiesStore);
const localePath = useLocalePath();
const { t } = useI18n();

const items = computed<DropdownMenuItem[][]>(() => {
  return [companies.value.map(company => ({
    label: company.name,
    id: company.id,
    icon: (company.id === currentCompany.value?.id) ? NAVIGATION_ICONS.companies : NAVIGATION_ICONS.companies,
    onSelect: () => {
      companiesStore.setCurrentCompany(company);
    },
  })), [{
    label: t("companies.menu.create"),
    icon: NAVIGATION_ICONS.create,
    onSelect: () => {
      navigateTo(localePath(ROUTES.COMPANIES_CREATE));
    },
  }, {
    label: t("companies.menu.manage"),
    icon: NAVIGATION_ICONS.manage,
    onSelect: () => {
      navigateTo(localePath(ROUTES.COMPANIES_MANAGE));
    },
  }]];
});
</script>

<template>
  <UDropdownMenu
    :items="items"
    :content="{ align: 'center', collisionPadding: 12 }"
    :ui="{ content: collapsed ? 'w-40' : 'w-(--reka-dropdown-menu-trigger-width)' }"
  >
    <UButton
      v-bind="{
        label: collapsed ? undefined : currentCompany?.name || t('companies.select'),
        trailingIcon: collapsed ? undefined : NAVIGATION_ICONS.select,
      }"
      color="neutral"
      variant="ghost"
      block
      :square="collapsed"
      class="data-[state=open]:bg-elevated"
      :class="[!collapsed && 'py-2']"
      :ui="{
        trailingIcon: 'text-dimmed',
      }"
    />
  </UDropdownMenu>
</template>
