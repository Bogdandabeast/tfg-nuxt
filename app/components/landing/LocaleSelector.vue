<script setup lang="ts">
const { locale, locales, setLocale } = useI18n();
</script>

<template>
  <USelect
    :model-value="locale"
    :items="locales.map(l => ({ label: l.name, value: l.code }))"
    @update:model-value="setLocale($event)"
  />
</template>
