<script setup lang="ts"></script>

<template>
  <UModal :dismissible="false" title="Modal non-dismissible">
    <template #body>
      <Placeholder class="h-48" />
    </template>
  </UModal>
</template>
