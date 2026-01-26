<script lang="ts" setup>
import { ROUTES } from "~/utils/routes";

const localePath = useLocalePath();
</script>

<template>
  <UButton
    :to="localePath(ROUTES.SIGNOUT)"
    icon="lucide:arrow-big-down-dash"
    size="md"
    color="primary"
    variant="subtle"
  >
    Sign Out
  </UButton>
</template>
