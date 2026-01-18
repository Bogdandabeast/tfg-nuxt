<script setup lang="ts">
import type { Period, Range, Stat } from "~/types";
import { randomInt } from "~/utils/math";

definePageMeta({
  layout: "dashboard",
});

const period = ref<Period>("monthly");
const range = ref<Range>({
  start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
  end: new Date(),
});

function formatCurrency(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });
}

type BaseStat = {
  title: string;
  icon: string;
  minValue: number;
  maxValue: number;
  minVariation: number;
  maxVariation: number;
  formatter?: (value: number) => string;
};

const baseStats: BaseStat[] = [{
  title: "Customers",
  icon: "i-lucide-users",
  minValue: 400,
  maxValue: 1000,
  minVariation: -15,
  maxVariation: 25,
}, {
  title: "Conversions",
  icon: "i-lucide-chart-pie",
  minValue: 1000,
  maxValue: 2000,
  minVariation: -10,
  maxVariation: 20,
}, {
  title: "Revenue",
  icon: "i-lucide-circle-dollar-sign",
  minValue: 200000,
  maxValue: 500000,
  minVariation: -20,
  maxVariation: 30,
  formatter: formatCurrency,
}, {
  title: "Orders",
  icon: "i-lucide-shopping-cart",
  minValue: 100,
  maxValue: 300,
  minVariation: -5,
  maxVariation: 15,
}];

const { data: stats } = await useAsyncData<Stat[]>("stats", async () => {
  return baseStats.map((stat) => {
    const value = randomInt(stat.minValue, stat.maxValue);
    const variation = randomInt(stat.minVariation, stat.maxVariation);

    return {
      title: stat.title,
      icon: stat.icon,
      value: stat.formatter ? stat.formatter(value) : value,
      variation,
    };
  });
}, {
  watch: [() => period.value, () => range.value],
  default: () => [],
});
</script>

<template>
  <UContainer class="py-8">
    <DashboardMetricsInsights
      :period="period"
      :range="range"
      :stats="stats || []"
    />
  </UContainer>
</template>
