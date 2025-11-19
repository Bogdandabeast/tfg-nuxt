<script lang="ts" setup>
import type { NavLink } from "./NavLinksMenu.vue";

const linksmock: NavLink[] = [
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
  <div class="navbar shadow-sm">
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
      <a class="btn btn-ghost text-xl">Gestion de citas</a>
    </div>

    <LayoutNavLinksMenu :links="linksmock" />
    <div class="navbar-end">
      <UiThemeToggle class="mx-4" />
      <a class="btn">Login</a>
    </div>
  </div>
</template>
