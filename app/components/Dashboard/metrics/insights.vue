<script setup lang="ts">
import type { Period, Range, Stat } from "~~/types/api";

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
      <DashboardMetricSkeleton
        :loading="props.loading"
        :value="stat.value"
      />
    </UPageCard>
  </UPageGrid>
</template>
