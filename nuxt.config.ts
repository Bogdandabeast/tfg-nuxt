// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/test-utils/module",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-og-image",
  ],
  vite: { plugins: [tailwindcss()] },
  css: ["./app/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },

  routeRules: {
    "/api/**": {
      cors: true,
    },
  },
  i18n: {
    defaultLocale: "es",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "es", name: "Spanish", file: "es.json" },
    ],
  },

  colorMode: {
    dataValue: "theme",
  },
});