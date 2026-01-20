<script setup>
const { breadcrumbItems } = useBreadcrumbs();
</script>

<template>
  <UDashboardNavbar>
    <template #leading>
      <UDashboardSidebarCollapse />
    </template>

    <template #right>
      <UTooltip>
        <LandingLocaleSelector />
        <UColorModeSwitch />
      </UTooltip>
    </template>
  </UDashboardNavbar>

  <UBreadcrumb :items="breadcrumbItems" class="px-4 py-2 border-b border-gray-200 dark:border-gray-700" />
</template>
