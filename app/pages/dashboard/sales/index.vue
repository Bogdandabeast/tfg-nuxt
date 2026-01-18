<script setup lang="ts">
import type { Sale } from "~/types";
import { storeToRefs } from "pinia";
import { h, resolveComponent } from "vue";
import SalesDeleteModal from "~/components/Dashboard/forms/sales/SalesDeleteModal.vue";
import SalesFormModal from "~/components/Dashboard/forms/sales/SalesFormModal.vue";

definePageMeta({
  layout: "dashboard",
});

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();

// Refresh data on page load asynchronously for lazy loading
salesStore.refreshSales();
customersStore.refreshCustomers();
productsStore.refreshProducts();

const { sales } = storeToRefs(salesStore);
const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const detailedSales = computed(() => {
  return sales.value?.map((sale) => {
    const customer = customers.value?.find(c => c.id === sale.customer_id);
    const product = products.value?.find(p => p.id === sale.product_id);
    const amount = product ? Number(product.price) * sale.quantity : 0;
    return {
      ...sale,
      customerName: customer ? customer.name : "Unknown",
      productName: product ? product.name : "Unknown",
      amount,
    };
  });
});

const isEditModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedSale = ref<Sale | null>(null);

const columns = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }: any) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "sale_date",
    header: "Date",
    cell: ({ row }: any) => {
      return new Date(row.getValue("sale_date")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }: any) => row.getValue("customerName"),
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }: any) => row.getValue("productName"),
  },
  {
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "Amount"),
    cell: ({ row }: any) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }: any) => {
      const UButton = resolveComponent("UButton");
      return h("div", { class: "flex gap-2" }, [
        h(UButton, {
          size: "xs",
          variant: "outline",
          color: "primary",
          onClick: () => {
            selectedSale.value = row.original;
            isEditModalOpen.value = true;
          },
        }, "Edit"),
        h(UButton, {
          size: "xs",
          variant: "outline",
          color: "error",
          onClick: () => {
            selectedSale.value = row.original;
            isDeleteModalOpen.value = true;
          },
        }, "Delete"),
      ]);
    },
  },
];
</script>

<template>
  <UContainer class="space-y-4 w-full">
    <h1>{{ $t('dashboard.sales.title') }}</h1>

    <UButton
      label="Add Sale"
      color="primary"
      @click="isEditModalOpen = true"
    />

    <SalesFormModal
      v-model:open="isEditModalOpen"
      :edit-mode="!!selectedSale"
      :sale-data="selectedSale"
    />

    <SalesDeleteModal
      v-model:open="isDeleteModalOpen"
      :sale="selectedSale"
    />

    <UTable
      :data="detailedSales"
      :columns="columns"
      class="shrink-0"
      :ui="{
        base: 'table-fixed border-separate border-spacing-0',
        thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
        tbody: '[&>tr]:last:[&>td]:border-b-0',
        th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
        td: 'border-b border-default',
      }"
    />
  </UContainer>
</template>
