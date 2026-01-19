<script setup lang="ts">
import type { Period, Range, Stat } from "~/types";

const props = defineProps<{
  period: Period;
  range: Range;
  stats: Stat[];
  loading?: boolean;
}>();
</script>

<template>
  <UPageGrid class="lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-px">
    <UPageCard
      v-for="(stat, index) in props.stats"
      :key="index"
      :icon="stat.icon"
      :title="stat.title"
      variant="subtle"
      :ui="{
        container: 'gap-y-1.5',
        wrapper: 'items-start',
        leading: 'p-2.5 rounded-full bg-primary/10 ring ring-inset ring-primary/25 flex-col',
        title: 'font-normal text-muted text-xs uppercase',
      }"
      class="m-5 lg:rounded-none first:rounded-l-lg last:rounded-r-lg hover:z-1"
    >
      <div class="flex items-center gap-2">
        <USkeleton v-if="props.loading" class="h-8 w-20" />
        <span v-else class="text-2xl font-semibold text-highlighted">
          {{ stat.value }}
        </span>

        <USkeleton v-if="props.loading" class="h-6 w-12 rounded-full" />
        <UBadge
          v-else
          :color="stat.variation > 0 ? 'success' : 'error'"
          variant="subtle"
          class="text-xs"
        >
          {{ stat.variation > 0 ? '+' : '' }}{{ stat.variation }}%
        </UBadge>
      </div>
    </UPageCard>
  </UPageGrid>
</template>
