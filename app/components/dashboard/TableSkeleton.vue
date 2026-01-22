<script setup lang="ts">
type Props = {
  loading?: boolean;
  rows?: number;
  columns?: number;
  showHeader?: boolean;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  loading: true,
  rows: 5,
  columns: 4,
  showHeader: true,
  class: "",
});
</script>

<template>
  <div
    v-if="props.loading"
    class="space-y-4"
    :class="props.class"
  >
    <div v-if="props.showHeader" class="flex gap-4 mb-4">
      <USkeleton
        v-for="col in props.columns"
        :key="`header-${col}`"
        class="h-6 flex-1"
      />
    </div>

    <div
      v-for="row in props.rows"
      :key="`row-${row}`"
      class="flex gap-4 py-2"
    >
      <USkeleton
        v-for="col in props.columns"
        :key="`cell-${row}-${col}`"
        class="h-5 flex-1"
      />
    </div>
  </div>

  <slot v-else />
</template>
