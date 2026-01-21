<script setup lang="ts">
import type { Sale } from "~/lib/db/queries/sales";
import type { TableColumn } from "@nuxt/ui";
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "dashboard",
});
const localePath = useLocalePath();
const { t } = useI18n();
const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();

// Refresh data on page load asynchronously for lazy loading
salesStore.refreshSales();
customersStore.refreshCustomers();
productsStore.refreshProducts();

const { sales, pending: loadingSales } = storeToRefs(salesStore);
const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const isCreateModalOpen = ref(false);

const detailedSales = computed(() => {
  return sales.value?.map((sale) => {
    const customer = customers.value?.find(c => c.id === sale.customer_id);
    const product = products.value?.find(p => p.id === sale.product_id);
    const amount = product ? Number(product.price) * sale.quantity : 0;
    return {
      ...sale,
      customerName: customer ? customer.name : t("tables.data.unknown"),
      productName: product ? product.name : t("tables.data.unknown"),
      amount,
    };
  });
});

const columns: TableColumn<Sale>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => {
      const id = row.getValue("id") as number;
      return h(
        resolveComponent("UButton"),
        {
          to: localePath(getSalePath(id)),
          variant: "link",
          color: "primary",
          padded: false,
        },
        () => `#${id}`,
      );
    },
  },
  {
    accessorKey: "sale_date",
    header: t("tables.headers.date"),
    cell: ({ row }) => {
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
    cell: ({ row }) => row.getValue("customerName"),
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => row.getValue("productName"),
  },
  {
    accessorKey: "customerName",
    header: t("tables.headers.customer"),
  },
  {
    accessorKey: "productName",
    header: t("tables.headers.product"),
  },
  {
    accessorKey: "quantity",
    header: t("tables.headers.quantity"),
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, t("tables.headers.amount")),
    cell: ({ row }) => {
      const amount = Number.parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(amount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },

];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="p-4">
      <DashboardNavBar />
      <DashboardTableSkeleton
        :loading="loadingSales"
        :columns="6"
        :rows="12"
      >
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
      </DashboardTableSkeleton>
      <UModal
        v-model:open="isCreateModalOpen"
        :title="t('sales.create.title')"
        :description="t('sales.create.description')"
      >
        <UButton
          :label="t('sales.create.button')"
          icon="i-heroicons-plus-20-solid"
          color="primary"
        />

        <template #content>
          <DashboardFormsSaleForm
            :edit-mode="false"
            :sale-data="null"
          />
        </template>
      </UModal>
    </div>
  </UDashboardPanel>
</template>
