<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const props = defineProps<{
  open: boolean;
  editMode?: boolean;
  productData?: any;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be positive"),
  stock: z.number().min(0, "Stock cannot be negative"),
});

const open = computed({
  get: () => props.open,
  set: value => emit("update:open", value),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
  description: "",
  price: 0,
  stock: 0,
});

if (props.editMode && props.productData) {
  state.name = props.productData.name;
  state.description = props.productData.description;
  state.price = props.productData.price;
  state.stock = props.productData.stock;
}

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { createProduct } = useProductsApi();
  const companiesStore = useCompaniesStore();

  const productData = {
    ...event.data,
    company_id: companiesStore.currentCompany!.id,
  };

  const result = await createProduct(productData);
  if (result) {
    toast.add({
      title: "Success",
      description: `Product ${event.data.name} created successfully`,
      color: "success",
    });
    emit("update:open", false);
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New Product"
    description="Create a new product in the database"
  >
    <UButton label="New Product" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Name"
          placeholder="Product name"
          name="name"
        >
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField
          label="Description"
          placeholder="Product description"
          name="description"
        >
          <UTextarea v-model="state.description" class="w-full" />
        </UFormField>
        <UFormField label="Price" name="price">
          <UInput
            v-model.number="state.price"
            type="number"
            min="0"
            step="0.01"
            class="w-full"
          />
        </UFormField>
        <UFormField label="Stock" name="stock">
          <UInput
            v-model.number="state.stock"
            type="number"
            min="0"
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
