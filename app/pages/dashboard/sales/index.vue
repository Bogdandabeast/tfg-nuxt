<script setup lang="ts">
import type { Sale, TableCellContext } from "~/types/api";
import { storeToRefs } from "pinia";
import { getSalePath } from "~/utils/routes";

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
    cell: ({ row }: TableCellContext<Sale>) => {
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
    cell: ({ row }: TableCellContext<Sale>) => {
      const unitPrice = Number.parseFloat(row.getValue("unit_price") as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(unitPrice);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "total",
    header: () => h("div", { class: "text-right" }, t("tables.headers.total")),
    cell: ({ row }: TableCellContext<Sale>) => {
      const total = Number.parseFloat(row.getValue("total") as string);
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "EUR",
      }).format(total);
      return h("div", { class: "text-right font-medium" }, formatted);
    },
  },
  {
    accessorKey: "actions",
    header: t("tables.headers.actions"),
    cell: ({ row }: TableCellContext<Sale>) => {
      const saleId = row.original.id;
      return h("div", { class: "flex gap-2" }, [
        h(
          resolveComponent("UButton"),
          {
            to: localePath(getSalePath(saleId)),
            variant: "ghost",
            color: "primary",
            size: "xs",
            icon: "i-lucide-edit",
          },
        ),
      ]);
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
