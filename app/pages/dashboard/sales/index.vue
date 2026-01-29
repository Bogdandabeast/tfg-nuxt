<script setup lang="ts">
import { storeToRefs } from "pinia";

definePageMeta({
  layout: "dashboard",
});
const localePath = useLocalePath();
const { t } = useI18n();
const salesStore = useSalesStore();

salesStore.refreshSales();

const { sales, pending: loadingSales } = storeToRefs(salesStore);

const detailedSales = computed(() => {
  return sales.value?.map((sale) => {
    const amount = Number(sale.unit_price) * sale.quantity;
    return {
      ...sale,
      amount,
    };
  });
});

const columns = [
  {
    accessorKey: "sale_date",
    header: t("tables.headers.date"),
    cell: ({ row }: any) => {
      return new Date(row.getValue("sale_date")).toLocaleString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  {
    accessorKey: "customer_name",
    header: t("tables.headers.customer"),
  },
  {
    accessorKey: "product_name",
    header: t("tables.headers.product"),
  },
  {
    accessorKey: "quantity",
    header: t("tables.headers.quantity"),
  },
  {
    accessorKey: "unit_price",
    header: t("tables.headers.unitPrice"),
    cell: ({ row }: any) => {
      const unitPrice = Number.parseFloat(row.getValue("unit_price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(unitPrice);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "discount",
    header: t("tables.headers.discount"),
    cell: ({ row }: any) => {
      const discount = Number.parseFloat(row.getValue("discount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(discount);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "tax_rate",
    header: t("tables.headers.taxRate"),
    cell: ({ row }: any) => {
      const taxRate = Number.parseFloat(row.getValue("tax_rate"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(taxRate);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "total",
    header: () => h("div", { class: "text-right" }, t("tables.headers.total")),
    cell: ({ row }: any) => {
      const total = Number.parseFloat(row.getValue("total"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(total);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
];
</script>

<template>
  <UDashboardPanel class="overflow-y-auto">
    <div class="m-5">
      <DashboardNavbar />
      <DashboardTableSkeleton
        :loading="loadingSales"
        :columns="6"
        :rows="12"
      >
        <UTable
          :data="detailedSales"
          :columns="columns"
          class="shrink-0 m-5"
          :ui="{
            base: 'table-fixed border-separate border-spacing-0',
            thead: '[&>tr]:bg-elevated/50 [&>tr]:after:content-none',
            tbody: '[&>tr]:last:[&>td]:border-b-0',
            th: 'first:rounded-l-lg last:rounded-r-lg border-y border-default first:border-l last:border-r',
            td: 'border-b border-default',
          }"
        />
      </DashboardTableSkeleton>

      <DashboardFormsSaleForm />
    </div>
  </UDashboardPanel>
</template>
