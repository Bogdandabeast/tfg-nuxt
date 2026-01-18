<script setup lang="ts">
import type { FormSubmitEvent } from "@nuxt/ui";
import * as z from "zod";

const props = defineProps<{
  open: boolean;
  editMode?: boolean;
  customerData?: any;
}>();

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const schema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const open = computed({
  get: () => props.open,
  set: value => emit("update:open", value),
});

type Schema = z.output<typeof schema>;

const state = reactive<Partial<Schema>>({
  name: "",
  email: "",
  phone: "",
  address: "",
});

if (props.editMode && props.customerData) {
  state.name = props.customerData.name;
  state.email = props.customerData.email;
  state.phone = props.customerData.phone;
  state.address = props.customerData.address;
}

const toast = useToast();
async function onSubmit(event: FormSubmitEvent<Schema>) {
  const { createCustomer } = useCustomersApi();
  const companiesStore = useCompaniesStore();

  const customerData = {
    ...event.data,
    company_id: companiesStore.currentCompany!.id,
  };

  const result = await createCustomer(customerData);
  if (result) {
    toast.add({
      title: "Success",
      description: `Customer ${event.data.name} created successfully`,
      color: "success",
    });
    emit("update:open", false);
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="New Customer"
    description="Create a new customer in the database"
  >
    <UButton label="New Customer" icon="i-lucide-plus" />

    <template #body>
      <UForm
        :schema="schema"
        :state="state"
        class="space-y-4"
        @submit="onSubmit"
      >
        <UFormField
          label="Name"
          placeholder="Customer name"
          name="name"
        >
          <UInput v-model="state.name" class="w-full" />
        </UFormField>
        <UFormField
          label="Email"
          placeholder="customer@example.com"
          name="email"
        >
          <UInput
            v-model="state.email"
            type="email"
            class="w-full"
          />
        </UFormField>
        <UFormField
          label="Phone"
          placeholder="Phone number"
          name="phone"
        >
          <UInput v-model="state.phone" class="w-full" />
        </UFormField>
        <UFormField
          label="Address"
          placeholder="Customer address"
          name="address"
        >
          <UTextarea v-model="state.address" class="w-full" />
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
