<script setup lang="ts">
const props = withDefaults(defineProps<{
  count?: number;
  open?: boolean;
  product?: any;
}>(), {
  count: 0,
  open: false,
  product: null,
});

const emit = defineEmits<{
  "update:open": [value: boolean];
}>();

const open = computed({
  get: () => props.open,
  set: value => emit("update:open", value),
});

async function onSubmit() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  emit("update:open", false);
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="'Delete Product #' + (product?.id || '')"
    description="Are you sure you want to delete this product? This action cannot be undone."
  >
    <slot />

    <template #body>
      <div class="flex justify-end gap-2">
        <UButton
          label="Cancel"
          color="neutral"
          variant="subtle"
          @click="emit('update:open', false)"
        />
        <UButton
          label="Delete"
          color="error"
          variant="solid"
          loading-auto
          @click="onSubmit"
        />
      </div>
    </template>
  </UModal>
</template>
