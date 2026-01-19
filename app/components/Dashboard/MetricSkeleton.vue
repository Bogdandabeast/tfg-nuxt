<script setup lang="ts">
interface Props {
  loading?: boolean;
  value?: string | number;
  variation?: number;
  valueClass?: string;
  badgeClass?: string;
  showBadge?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  value: '',
  variation: 0,
  valueClass: 'text-2xl font-semibold text-highlighted',
  badgeClass: '',
  showBadge: true,
});
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Value skeleton or real value -->
    <USkeleton
      v-if="props.loading"
      class="h-8 w-20"
    />
    <span
      v-else
      :class="props.valueClass"
    >
      {{ props.value }}
    </span>

    <!-- Badge skeleton or real badge (opcional) -->
    <template v-if="props.showBadge">
      <USkeleton
        v-if="props.loading"
        class="h-6 w-12 rounded-full"
      />
      <UBadge
        v-else
        :color="props.variation > 0 ? 'success' : 'error'"
        variant="subtle"
        class="text-xs"
        :class="props.badgeClass"
      >
        {{ props.variation > 0 ? '+' : '' }}{{ props.variation }}%
      </UBadge>
    </template>
  </div>
</template>