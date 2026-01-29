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

        <DashboardSignOut />
      </UTooltip>
    </template>
  </UDashboardNavbar>
  <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
    <UBreadcrumb :items="breadcrumbItems" />
    <UColorModeSwitch class="mr-5" />
  </div>
</template>
