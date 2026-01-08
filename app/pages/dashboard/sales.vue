<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useSalesStore } from "~/app/stores/sales";

definePageMeta({
  layout: "dashboard",
});

const salesStore = useSalesStore();
const { sales, pending } = storeToRefs(salesStore);

onMounted(() => {
  salesStore.refreshSales();
});
</script>

<template>
  <div class="space-y-4">
    <h1>Sales</h1>
    <div v-if="pending">
      Loading sales...
    </div>
    <ul v-else>
      <li v-for="sale in sales" :key="sale.id">
        {{ sale.id }}
      </li>
    </ul>
  </div>
</template>
