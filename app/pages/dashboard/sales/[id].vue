<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const saleId = route.params.id as string;

const salesStore = useSalesStore();
const { data, pending, error } = salesStore.getSaleById(saleId);

const isDeleteModalOpen = ref(false);

const handleDelete = async () => {
  // Implement delete logic
  isDeleteModalOpen.value = false;
};
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Sale Details"
      :description="`Viewing sale ${saleId}`"
    >
      <template #headline>
        <UBreadcrumb
          :items="[
            { label: 'Dashboard', to: '/dashboard' },
            { label: 'Sales', to: '/dashboard/sales' },
            { label: `Sale ${saleId}` }
          ]"
        />
      </template>

      <template #actions>
        <UColorModeButton />
        <UDropdownMenu mode="click">
          <UButton
            color="gray"
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
        color="red"
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

      <UCard v-else-if="data">
        <template #header>
          <div class="flex items-center gap-3">
            <UIcon name="i-heroicons-shopping-bag-20-solid" class="h-8 w-8 text-primary" />
            <div>
              <h3 class="text-lg font-semibold">Sale #{{ data.id }}</h3>
              <p class="text-sm text-gray-500">Sale Date: {{ new Date(data.sale_date).toLocaleDateString() }}</p>
            </div>
            <UBadge color="green" variant="subtle">Completed</UBadge>
          </div>
        </template>

        <UTabs>
          <UTab name="details" label="Sale Details">
            <div class="space-y-6">
              <UTable
                :rows="[
                  { label: 'ID', value: data.id },
                  { label: 'Customer ID', value: data.customer_id },
                  { label: 'Product ID', value: data.product_id },
                  { label: 'Quantity', value: data.quantity },
                  { label: 'Sale Date', value: new Date(data.sale_date).toLocaleString() },
                  { label: 'Company ID', value: data.company_id }
                ]"
                :columns="[
                  { key: 'label', label: 'Field' },
                  { key: 'value', label: 'Value' }
                ]"
                class="w-full"
              >
                <template #label-data="{ row }">
                  <span class="font-medium">{{ row.label }}</span>
                </template>
                <template #value-data="{ row }">
                  <UBadge v-if="row.label === 'ID'" color="blue" variant="soft">{{ row.value }}</UBadge>
                  <UBadge v-else-if="row.label === 'Quantity'" color="purple" variant="soft">{{ row.value }}</UBadge>
                  <span v-else>{{ row.value }}</span>
                </template>
              </UTable>

              <USeparator />

              <div>
                <h4 class="text-lg font-semibold mb-4">Sale Timeline</h4>
                <UTimeline>
                  <UTimelineItem
                    title="Sale Created"
                    :description="`Sale #${data.id} was created on ${new Date(data.sale_date).toLocaleDateString()}`"
                    icon="i-heroicons-shopping-bag-20-solid"
                  />
                  <UTimelineItem
                    title="Payment Processed"
                    description="Payment was successfully processed"
                    icon="i-heroicons-currency-dollar-20-solid"
                  />
                  <UTimelineItem
                    title="Order Fulfilled"
                    description="Order has been fulfilled and shipped"
                    icon="i-heroicons-truck-20-solid"
                  />
                </UTimeline>
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
          <UButton to="/dashboard/sales">Back to Sales</UButton>
        </UEmpty>
      </UCard>
    </div>

    <UModal v-model="isDeleteModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Delete Sale</h3>
        </template>
        <p>Are you sure you want to delete this sale? This action cannot be undone.</p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton variant="ghost" @click="isDeleteModalOpen = false">Cancel</UButton>
            <UButton color="red" @click="handleDelete">Delete</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </UContainer>
</template>
