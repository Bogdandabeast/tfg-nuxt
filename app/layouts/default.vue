<template>
  <div class="flex flex-col gap-4 min-h-screen m-auto container">
    <LayoutHeader class="border-4 border-black" />
    <main class="flex-1 flex border-4 border-black">
      <slot />
    </main>
    <LayoutFooter class="border-4 border-black" />
  </div>
</template>
