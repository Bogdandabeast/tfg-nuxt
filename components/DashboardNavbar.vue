<script lang="ts">
</script>

<template>
  <UDashboardNavbar title="Home" :ui="{ right: 'gap-3' }">
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
</template>
