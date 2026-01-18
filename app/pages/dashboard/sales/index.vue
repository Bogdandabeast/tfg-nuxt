<script setup lang="ts">
import type { Sale } from "~/types";
import { storeToRefs } from "pinia";
import { h, resolveComponent } from "vue";
import SaleForm from "~/components/Dashboard/forms/SaleForm.vue";

definePageMeta({
  layout: "dashboard",
});

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const companiesStore = useCompaniesStore();
const { deleteSale } = useSalesApi();

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

function openEditModal(sale: Sale) {
  selectedSale.value = sale;
  isEditModalOpen.value = true;
}

function openDeleteModal(sale: Sale) {
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
    const success = await deleteSale(selectedSale.value.id.toString(), companiesStore.currentCompany!.id.toString());
    if (success) {
      salesStore.refreshSales();
      closeModals();
    }
  }
}

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
        h(UButton, { size: "xs", variant: "outline", color: "primary", onClick: () => openEditModal(row.original) }, "Edit"),
        h(UButton, { size: "xs", variant: "outline", color: "error", onClick: () => openDeleteModal(row.original) }, "Delete"),
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
      @click="isEditModalOpen = true; selectedSale = null"
    />

    <UModal v-model="isEditModalOpen">
      <template #body>
        <SaleForm
          :edit-mode="!!selectedSale"
          :sale-data="selectedSale as any"
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
