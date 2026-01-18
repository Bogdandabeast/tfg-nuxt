<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const saleId = route.params.id as string;

const salesStore = useSalesStore();
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const { data: saleData, pending, error } = salesStore.getSaleById(saleId);
const { data: customerData } = customersStore.getCustomerById(saleData.value!.customer_id);
const { data: productData } = productsStore.getProductById(saleData.value!.product_id);

const isDeleteModalOpen = ref(false);

const timelineItems = computed(() => [
  {
    title: "Sale Created",
    description: `Sale #${saleData.value?.id} was created on ${saleData.value?.sale_date ? new Date(saleData.value.sale_date).toLocaleDateString() : ""}.`,
    icon: "i-heroicons-shopping-bag-20-solid",
  },
  {
    title: "Payment Processed",
    description: "Payment was successfully processed.",
    icon: "i-heroicons-currency-dollar-20-solid",
  },
  {
    title: "Order Fulfilled",
    description: "Order has been fulfilled and shipped.",
    icon: "i-heroicons-truck-20-solid",
  },
]);

async function handleDelete() {
  // Implement delete logic
  isDeleteModalOpen.value = false;
}

const UBadge = resolveComponent("UBadge");

const tableData = computed(() => [
  { label: "Sale ID", value: saleData.value?.id },
  { label: "Customer Name", value: customerData.value?.name || "Loading..." },
  { label: "Customer Email", value: customerData.value?.email || "Loading..." },
  { label: "Product Name", value: productData.value?.name || "Loading..." },
  { label: "Product Price", value: productData.value?.price ? `$${productData.value.price}` : "Loading..." },
  { label: "Product Stock", value: productData.value?.stock || "Loading..." },
  { label: "Quantity", value: saleData.value?.quantity },
  { label: "Sale Date", value: saleData.value?.sale_date ? new Date(saleData.value.sale_date).toLocaleString() : "N/A" },
  { label: "Company ID", value: saleData.value?.company_id },
]);

const tableColumns = [
  {
    accessorKey: "label",
    header: "Field",
    cell: ({ row }: { row: Record<string, any> }) =>
      h("span", { class: "font-medium" }, row.getValue("label")),
  },
  {
    accessorKey: "value",
    header: "Value",
    cell: ({ row }: { row: Record<string, any> }) => {
      const label = row.original.label;
      const value = row.getValue("value");

      // Manejar valores vacíos
      if (value == null || value === "") {
        return h("span", { class: "text-gray-400 italic" }, "N/A");
      }

      if (label === "Sale ID" || label === "Quantity") {
        return h(UBadge, { color: "secondary", variant: "soft" }, () => String(value));
      }

      return h("span", {}, String(value));
    },
  },
];
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Sale Details"
      :description="`Viewing sale ${saleId}`"
    >
      <template #actions>
        <UColorModeButton />
        <UDropdownMenu mode="click">
          <UButton
            color="neutral"
            variant="soft"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
            square
            aria-label="More actions"
          />
          <template #items>
            <UDropdownMenuItem
              icon="i-heroicons-pencil-square-20-solid"
              label="Edit Sale"
            />
            <UDropdownMenuItem
              icon="i-heroicons-receipt-refund-20-solid"
              label="Process Refund"
            />
            <UDropdownMenuItem
              icon="i-heroicons-trash-20-solid"
              label="Delete Sale"
              @click="isDeleteModalOpen = true"
            />
          </template>
        </UDropdownMenu>
      </template>
    </UPageHeader>

    <div class="space-y-6">
      <UAlert
        v-if="error"
        color="error"
        variant="subtle"
        icon="i-heroicons-exclamation-triangle-20-solid"
        title="Error loading sale"
        :description="error?.message || 'An error occurred'"
      />

      <UCard v-else-if="pending">
        <template #header>
          <USkeleton class="h-6 w-32" />
        </template>
        <div class="space-y-4">
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="h-4 w-1/2" />
        </div>
      </UCard>

      <UCard v-else-if="saleData">
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-shopping-bag-20-solid" class="h-8 w-8 text-primary" />
            <div>
              <h3 class="text-lg font-semibold">
                Sale #{{ saleData.id }}
              </h3>
              <p class="text-sm text-gray-500">
                Sale Date: {{ new Date(saleData.sale_date).toLocaleDateString() }}
              </p>
            </div>
            <UBadge color="success" variant="subtle">
              Completed
            </UBadge>
          </div>
        </template>

        <UTabs>
          <UTab name="details" label="Sale Details">
            <div class="space-y-6">
              <UTable
                :data="tableData"
                :columns="tableColumns"
                class="w-full"
              />

              <USeparator />

              <div>
                <h4 class="text-lg font-semibold mb-4">
                  Sale Timeline
                </h4>
                <UTimeline :items="timelineItems" />
              </div>
            </div>
          </UTab>

          <UTab name="actions" label="Actions">
            <div class="space-y-4">
              <UButton
                icon="i-heroicons-pencil-square-20-solid"
                size="lg"
                block
              >
                Edit Sale
              </UButton>
              <UButton
                icon="i-heroicons-receipt-refund-20-solid"
                variant="outline"
                size="lg"
                block
              >
                Process Refund
              </UButton>
              <UButton
                icon="i-heroicons-eye-20-solid"
                variant="outline"
                size="lg"
                block
                to="/dashboard/sales"
              >
                View All Sales
              </UButton>
            </div>
          </UTab>
        </UTabs>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              variant="ghost"
              to="/dashboard/sales"
            >
              Back to Sales
            </UButton>
            <div class="flex gap-2">
              <UTooltip text="Print receipt">
                <UButton
                  icon="i-heroicons-printer-20-solid"
                  variant="ghost"
                  size="sm"
                />
              </UTooltip>
              <UButton
                icon="i-heroicons-share-20-solid"
                variant="ghost"
                size="sm"
              >
                Share
              </UButton>
              <UButton
                icon="i-heroicons-bookmark-20-solid"
                variant="ghost"
                size="sm"
              >
                Bookmark
              </UButton>
            </div>
          </div>
        </template>
      </UCard>

      <UCard v-else>
        <UEmpty
          icon="i-heroicons-shopping-bag-20-solid"
          title="Sale not found"
          description="The requested sale could not be found."
        >
          <UButton to="/dashboard/sales">
            Back to Sales
          </UButton>
        </UEmpty>
      </UCard>
    </div>

    <UModal v-model="isDeleteModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">
            Delete Sale
          </h3>
        </template>
        <p>Are you sure you want to delete this sale? This action cannot be undone.</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="isDeleteModalOpen = false">
              Cancel
            </UButton>
            <UButton color="error" @click="handleDelete">
              Delete
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>
