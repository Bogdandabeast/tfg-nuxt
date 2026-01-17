<script lang="ts" setup>
definePageMeta({
  layout: "dashboard",
});
const route = useRoute();
const productId = Number(route.params.id);

const productsStore = useProductsStore();
const { data, pending, error } = productsStore.getProductById(productId);

const isDeleteModalOpen = ref(false);

const handleDelete = async () => {
  // Implement delete logic
  isDeleteModalOpen.value = false;
};

const stockPercentage = computed(() => {
  if (!data) return 0;
  return Math.min((data.stock / 100) * 100, 100); // Assuming max stock 100 for demo
});
</script>

<template>
  <UContainer>
    <UPageHeader
      title="Product Details"
      :description="`Viewing product ${productId}`"
    >
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
              label="Edit Product"
            />
            <UDropdownMenuItem
              icon="i-heroicons-currency-dollar-20-solid"
              label="Update Price"
            />
            <UDropdownMenuItem
              icon="i-heroicons-trash-20-solid"
              label="Delete Product"
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
        title="Error loading product"
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
            <UIcon name="i-heroicons-cube-20-solid" class="h-8 w-8 text-primary" />
            <div>
              <h3 class="text-lg font-semibold">{{ data.name }}</h3>
              <p class="text-sm text-gray-500">Product ID: {{ data.id }}</p>
            </div>
            <UBadge :color="data.stock > 0 ? 'green' : 'red'" variant="subtle">
              {{ data.stock > 0 ? 'In Stock' : 'Out of Stock' }}
            </UBadge>
          </div>
        </template>

        <UTabs>
          <UTab name="details" label="Product Details">
            <div class="space-y-6">
              <UTable
                :rows="[
                  { label: 'ID', value: data.id },
                  { label: 'Name', value: data.name },
                  { label: 'Description', value: data.description },
                  { label: 'Price', value: `$${data.price}` },
                  { label: 'Stock', value: data.stock },
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
                  <UBadge v-else-if="row.label === 'Stock'" :color="row.value > 0 ? 'green' : 'red'" variant="soft">{{ row.value }}</UBadge>
                  <span v-else>{{ row.value }}</span>
                </template>
              </UTable>

              <div>
                <label class="text-sm font-medium">Stock Level</label>
                <UProgress :percentage="stockPercentage" class="mt-2" />
                <p class="text-xs text-gray-500 mt-1">{{ data.stock }} units available</p>
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
                Edit Product
              </UButton>
              <UButton
                icon="i-heroicons-shopping-cart-20-solid"
                variant="outline"
                size="lg"
                block
              >
                Add to Cart
              </UButton>
              <UButton
                icon="i-heroicons-eye-20-solid"
                variant="outline"
                size="lg"
                block
                to="/dashboard/products"
              >
                View All Products
              </UButton>
            </div>
          </UTab>
        </UTabs>

        <template #footer>
          <div class="flex justify-between">
            <UButton
              icon="i-heroicons-arrow-left-20-solid"
              variant="ghost"
              to="/dashboard/products"
            >
              Back to Products
            </UButton>
            <div class="flex gap-2">
              <UTooltip text="Print product details">
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
          icon="i-heroicons-cube-20-solid"
          title="Product not found"
          description="The requested product could not be found."
        >
          <UButton to="/dashboard/products">Back to Products</UButton>
        </UEmpty>
      </UCard>
    </div>

    <UModal v-model="isDeleteModalOpen">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Delete Product</h3>
        </template>
        <p>Are you sure you want to delete this product? This action cannot be undone.</p>
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
