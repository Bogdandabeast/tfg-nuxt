<script setup lang="ts">
export type NavLink = {
  name: string;
  url: string;
};

const props = defineProps<{
  links: NavLink[];
}>();
</script>

<template>
  <div class="navbar-center hidden lg:flex">
    <ul class="menu menu-horizontal px-1">
      <li v-for="link in props.links" :key="link.url">
        <NuxtLink :to="link.url">
          {{ link.name }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
