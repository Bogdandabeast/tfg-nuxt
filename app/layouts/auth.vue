<script setup lang="ts">
import { ROUTES } from "~/utils/routes";
import { UI_ICONS } from "~/lib/icons";
</script>

<template>
  <div class="h-screen flex items-center justify-center px-4">
    <UButton
      :icon="UI_ICONS.back"
      :to="useLocalePath()(ROUTES.HOME)"
      size="xl"
      color="neutral"
      variant="subtle"
      class="absolute left-8 top-8 rounded-full z-10"
    />

    <UPageCard variant="subtle" class="max-w-sm w-full">
      <slot />
    </UPageCard>
  </div>
</template>
