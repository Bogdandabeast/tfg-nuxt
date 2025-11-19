<script setup>
const colorMode = useColorMode();

colorMode.preference = "dark";

const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value) {
    colorMode.preference = value ? "dark" : "light";
  },

});
</script>

<template>
  <label class="swap swap-rotate">
    <input
      v-model="isDark"
      type="checkbox"
      class="theme-controller"
      value="synthwave"
    >
    <Icon
      class="swap-off"
      name="material-symbols:favorite"
      size="25"
    />
    <Icon
      class="swap-on"
      name="material-symbols:mode-night"
      size="25"
    /></label>
</template>
