<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const props = defineProps<{
  open: boolean;
  editMode?: boolean;
  saleData?: any;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const open = computed({
  get: () => props.open,
  set: value => emit("update:open", value),
});

const schema = z.object({
  customer_id: z.number().min(1, "Please select a customer"),
  product_id: z.number().min(1, "Please select a product"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  customer_id: undefined,
  product_id: undefined,
  quantity: 1,
});

if (props.editMode && props.saleData) {
  state.customer_id = props.saleData.customer_id;
  state.product_id = props.saleData.product_id;
  state.quantity = props.saleData.quantity;
}

// Get options from stores
const customersStore = useCustomersStore();
const productsStore = useProductsStore();
const { customers } = storeToRefs(customersStore);
const { products } = storeToRefs(productsStore);

const customerOptions = computed(() =>
  customers.value?.map(c => ({ label: c.name, value: c.id })) || [],
);
const productOptions = computed(() =>
  products.value?.map(p => ({ label: p.name, value: p.id })) || [],
);

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { createSale } = useSalesApi();
  const companiesStore = useCompaniesStore();

  const saleData = {
    customer_id: event.data.customer_id,
    product_id: event.data.product_id,
    quantity: event.data.quantity,
    company_id: companiesStore.currentCompany!.id,
  };

  const result = await createSale(saleData);
  if (result) {
    toast.add({
      title: "Success",
      description: `New sale created for ${customers.value?.find(c => c.id === event.data.customer_id)?.name}`,
      color: "success",
    });
    emit("update:open", false);
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New Sale"
    description="Create a new sale in the database"
    @update:open="emit('update:open', $event)"
  >
    <UButton label="New Sale" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField label="Customer" name="customer_id">
          <USelect
            v-model="state.customer_id"
            :options="customerOptions"
            placeholder="Select customer"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Product" name="product_id">
          <USelect
            v-model="state.product_id"
            :options="productOptions"
            placeholder="Select product"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Quantity" name="quantity">
          <UInput
            v-model.number="state.quantity"
            type="number"
            min="1"
            class="w-full"
          />
        </UFormField>
        <div class="flex justify-end gap-2">
          <UButton
            label="Cancel"
            color="neutral"
            variant="subtle"
            @click="emit('update:open', false)"
          />
          <UButton
            label="Create"
            color="primary"
            variant="solid"
            type="submit"
          />
        </div>
      </UForm>
    </template>
  </UModal>
</template>
