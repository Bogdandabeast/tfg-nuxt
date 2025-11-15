<script lang="ts" setup>
import type { NavLinksProps } from "./NavLinksMenu.vue";

const linksmock: NavLinksProps[] = [
  {
    name: "Home",
    url: "/",
  },
  {
    name: "About",
    url: "/about",
  },
  {
    name: "Dashboard",
    url: "/dashboard",
  },
  {
    name: "Contact",
    url: "/contact",
  },
];
</script>

<template>
  <div class="navbar bg-base-100 shadow-sm">
    <div class="navbar-start">
      <div class="dropdown">
        <div
          tabindex="0"
          role="button"
          class="btn btn-ghost lg:hidden"
        >
          <icon name="mdi:dots-grid" size="25" />
        </div>
        <LayoutMobileMenu />
      </div>
      <a class="btn btn-ghost text-xl">daisyUI</a>
    </div>
    <LayoutNavLinksMenu :links="linksmock" />
    <div class="navbar-end">
      <a class="btn">Button</a>
    </div>
  </div>
</template>
