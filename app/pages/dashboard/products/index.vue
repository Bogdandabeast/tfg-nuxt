<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
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

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
productsStore.refreshProducts();

const { products, pending: loadingProducts } = storeToRefs(productsStore);
const { isCreateProductLoading, createProduct, isDeleteProductLoading, deleteProduct } = useProductsApi();

async function handleDeleteProducts(ProductsId: string) {
  deletingProductsId.value = ProductsId;
  try {
    const success = await deleteProduct(Number(ProductsId));
    if (success === true) {
      await productsStore.refreshProducts();
      toast.add({
        title: t("common.success"),
        description: t("forms.productForm.deletedSuccess"),
        color: "success",
      });
    }
    else {
      toast.add({
        title: t("common.error"),
        description: success as string,
        color: "error",
      });
    }
  }
  finally {
    deletingProductsId.value = null;
  }
}

const columns: TableColumn[] = [

  {
    accessorKey: "name",
    header: t("tables.headers.name"),
  },
  {
    accessorKey: "price",
    header: t("tables.headers.price"),
    cell: ({ row }: any) => `€${row.getValue("price")}`,
  },
  {
    accessorKey: "stock",
    header: t("tables.headers.stock"),
  },
  {
    accessorKey: "actions",
    header: t("tables.headers.actions"),
    cell: ({ row }: any) => {
      const ProductsId = products.value[row.index].id;
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
            loading: deletingProductsId.value === ProductsId.toString(),
            onClick: () => handleDeleteProducts(ProductsId.toString()),
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
