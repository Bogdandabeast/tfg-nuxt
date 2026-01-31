<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Product, TableCellContext } from "~~/types/api";
import { storeToRefs } from "pinia";
import { getProductPath } from "~/utils/routes";

definePageMeta({
  layout: "dashboard",
});

const localePath = useLocalePath();
const { t } = useI18n();
const toast = useToast();

const companiesStore = useCompaniesStore();
const productsStore = useProductsStore();
const deletingProductsId = ref<string | null>(null);

companiesStore.refreshCompanies();
productsStore.refreshProducts();

const { products, pending: loadingProducts } = storeToRefs(productsStore);
const { deleteProduct } = useProductsApi();

async function handleDeleteProducts(ProductsId: string) {
  deletingProductsId.value = ProductsId;
  try {
    const success = await deleteProduct(ProductsId);
    if (success === true) {
      await productsStore.refreshProducts();
    }
    else {
      // Error toast is already handled by useProductsApi
    }
  }
  finally {
    deletingProductsId.value = null;
  }
}

const columns: TableColumn<Product>[] = [

  {
    accessorKey: "name",
    header: t("tables.headers.name"),
  },
  {
    accessorKey: "price",
    header: t("tables.headers.price"),
    cell: ({ row }: TableCellContext<Product>) => `€${row.getValue("price")}`,
  },
  {
    accessorKey: "stock",
    header: t("tables.headers.stock"),
  },
  {
    accessorKey: "actions",
    header: t("tables.headers.actions"),
    cell: ({ row }: TableCellContext<Product>) => {
      const ProductsId = row.original.id;
      if (!ProductsId)
        return null;
      return h("div", { class: "flex gap-2" }, [
        h(
          resolveComponent("UButton"),
          {
            to: localePath(getProductPath(ProductsId)),
            variant: "ghost",
            color: "primary",
            size: "xs",
            icon: "i-lucide-edit",
          },
        ),
        h(
          resolveComponent("UButton"),
          {
            variant: "ghost",
            color: "red",
            size: "xs",
            icon: "i-lucide-trash",
            loading: deletingProductsId.value === ProductsId,
            onClick: () => handleDeleteProducts(ProductsId),
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
        :loading="loadingProducts"
        :columns="4"
        :rows="10"
      >
        <UTable
          :data="products"
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

      <DashboardFormsProductForm />
    </div>
  </UDashboardPanel>
</template>
