<script setup lang="ts">
import type { TableColumn } from "@nuxt/ui";
import { h } from "vue";
import { storeToRefs } from "pinia";
import SaleForm from "~/components/Dashboard/forms/SaleForm.vue";
import SaleForm from "~/components/Dashboard/forms/SaleForm.vue";

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
    const amount = product ? product.price * sale.quantity : 0;
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
const selectedSale = ref(null);

function openEditModal(sale) {
  selectedSale.value = sale;
  isEditModalOpen.value = true;
}

function openDeleteModal(sale) {
  selectedSale.value = sale;
  isDeleteModalOpen.value = true;
}

function closeModals() {
  isEditModalOpen.value = false;
  isDeleteModalOpen.value = false;
  selectedSale.value = null;
}

async function handleDelete() {
  if (selectedSale.value) {
    await salesStore.deleteSale(selectedSale.value.id);
    closeModals();
  }
}

const columns: TableColumn[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => `#${row.getValue("id")}`,
  },
  {
    accessorKey: "sale_date",
    header: "Date",
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
    accessorKey: "quantity",
    header: "Quantity",
  },
  {
    accessorKey: "amount",
    header: () => h("div", { class: "text-right" }, "Amount"),
    cell: ({ row }) => {
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
    cell: ({ row }) => h("div", { class: "flex gap-2" }, [
      h("UButton", { size: "xs", variant: "outline", color: "primary", onClick: () => openEditModal(row.original) }, "Edit"),
      h("UButton", { size: "xs", variant: "outline", color: "error", onClick: () => openDeleteModal(row.original) }, "Delete"),
    ]),
  },
];
</script>

<template>
  <UContainer class="space-y-4 w-full">
    <h1>{{ $t('dashboard.sales.title') }}</h1>

    <UButton
      label="Add Sale"
      color="primary"
      @click="isEditModalOpen = true; selectedSale = null"
    />

    <UModal v-model="isEditModalOpen">
      <template #body>
        <SaleForm
          :edit-mode="!!selectedSale"
          :sale-data="selectedSale"
          @close="closeModals"
        />
      </template>
    </UModal>

    <UModal v-model="isDeleteModalOpen">
      <template #header>
        <h3>Delete Sale</h3>
      </template>
      <template #body>
        <p>Are you sure you want to delete Sale #{{ selectedSale?.id }}?</p>
        <div class="flex gap-2 mt-4">
          <UButton
            variant="outline"
            @click="closeModals"
          >
            Cancel
          </UButton>
          <UButton
            color="error"
            @click="handleDelete"
          >
            Delete
          </UButton>
        </div>
      </template>
    </UModal>

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
