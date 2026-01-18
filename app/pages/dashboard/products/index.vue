<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import type { Product } from "~/types";
import { storeToRefs } from "pinia";
import { h, resolveComponent } from "vue";
import ProductDeleteModal from "~/components/Dashboard/forms/products/ProductDeleteModal.vue";
import ProductFormModal from "~/components/Dashboard/forms/products/ProductFormModal.vue";

definePageMeta({
  layout: "dashboard",
});

const companiesStore = useCompaniesStore();
const productsStore = useProductsStore();

// Refresh data asynchronously for lazy loading
companiesStore.refreshCompanies();
productsStore.refreshProducts();

const { products, pending } = storeToRefs(productsStore);

const isAddModalOpen = ref(false);
const isDeleteModalOpen = ref(false);
const selectedProduct = ref<Product | null>(null);

const columns: TableColumn[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }: any) => `€${row.getValue("price")}`,
  },
  {
    accessorKey: "stock",
    header: "Stock",
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
            selectedProduct.value = row.original;
            isAddModalOpen.value = true;
          },
        }, "Edit"),
        h(UButton, {
          size: "xs",
          variant: "outline",
          color: "error",
          onClick: () => {
            selectedProduct.value = row.original;
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
    <h1>{{ $t('dashboard.products.title') }}</h1>

    <UButton
      label="Add Product"
      color="primary"
      @click="isAddModalOpen = true; selectedProduct = null"
    />

    <ProductFormModal
      v-model:open="isAddModalOpen"
      :edit-mode="!!selectedProduct"
      :product-data="selectedProduct"
    />

    <ProductDeleteModal v-model:open="isDeleteModalOpen" :product="selectedProduct" />

    <UTable
      :data="products"
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
