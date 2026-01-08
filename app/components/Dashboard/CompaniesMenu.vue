<script setup lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";

defineProps<{
  collapsed?: boolean;
}>();

const { companies } = useCompanies();

const selectedCompanies = ref(companies.value[0]);

const items = computed<DropdownMenuItem[][]>(() => {
  return [companies.value.map(company => ({
    ...company,
    onSelect() {
      selectedCompanies.value = company;
    },
  })), [{
    label: "Create company",
    icon: "i-lucide-circle-plus",
  }, {
    label: "Manage companies",
    icon: "i-lucide-cog",
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
        ...selectedCompanies,
        label: collapsed ? undefined : selectedCompanies?.label,
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
