<script lang="ts" setup>

</script>

<template>
  <footer class="footer sm:footer-horizontal bg-white text-black items-center p-4">
    <aside class="grid-flow-col items-center">
      <icon
        name="mdi:hair-dryer"
        size="25"
        style="color: black"
      />
      <p>Copyright © {{ new Date().getFullYear() }} - All right reserved</p>
    </aside>
    <nav class="grid-flow-col gap-4 md:place-self-center md:justify-self-end">
      <icon
        name="mdi:twitter"
        size="25"
      />
    </nav>
  </footer>
</template>

<style>

</style>
