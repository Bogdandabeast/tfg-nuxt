<script setup>
const { breadcrumbItems } = useBreadcrumbs();
</script>

<template>
  <UDashboardNavbar>
    <template #leading>
      <UDashboardSidebarCollapse />
      <UBreadcrumb :items="breadcrumbItems" class="px-4 py-2" />
    </template>

    <template #right>
      <UTooltip>
        <LandingLocaleSelector />
        <UColorModeSwitch />
      </UTooltip>
    </template>
  </UDashboardNavbar>
</template>
