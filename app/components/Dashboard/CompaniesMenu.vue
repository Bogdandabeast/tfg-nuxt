<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
import { storeToRefs } from "pinia";

defineProps<{
  collapsed?: boolean;
}>();

const companiesStore = useCompaniesStore();
const { companies, currentCompany } = storeToRefs(companiesStore);
const router = useRouter();

const items = computed<DropdownMenuItem[][]>(() => {
  return [companies.value.map(company => ({
    label: company.name,
    id: company.id,
    icon: (company.id === currentCompany.value?.id) ? "i-lucide-check" : "i-lucide-building",
    onSelect: () => {
      companiesStore.setCurrentCompany(company);
    },
  })), [{
    label: "Create company",
    icon: "i-lucide-circle-plus",
    onSelect: () => {
      router.push("/dashboard/companies");
    },
  }, {
    label: "Manage companies",
    icon: "i-lucide-cog",
    onSelect: () => {
      router.push("/dashboard/companies");
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
        label: collapsed ? undefined : currentCompany?.name || 'Select Company',
        trailingIcon: collapsed ? undefined : 'i-lucide-chevrons-up-down',
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
