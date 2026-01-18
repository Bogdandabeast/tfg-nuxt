<script setup lang="ts">
import type { Period, Range, Stat } from "~/types";

definePageMeta({
  layout: "dashboard",
});

const period = ref<Period>("monthly");
const range = ref<Range>({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date(),
});

const statsData: Stat[] = [
  {
    title: "Customers",
    icon: "i-lucide-users",
    value: 850,
    variation: 12,
  },
  {
    title: "Conversions",
    icon: "i-lucide-chart-pie",
    value: 1450,
    variation: 8,
  },
  {
    title: "Revenue",
    icon: "i-lucide-circle-dollar-sign",
    value: "$425,000",
    variation: -5,
  },
  {
    title: "Orders",
    icon: "i-lucide-shopping-cart",
    value: 275,
    variation: 15,
  },
];
</script>

<template>
  <UContainer class="py-8">
    <DashboardMetricsInsights
      :period="period"
      :range="range"
      :stats="statsData"
    />
  </UContainer>
</template>
