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
    "@nuxt/ui",
    "@nuxt/ui",
    "@vueuse/nuxt",
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

  colorMode: {
    dataValue: "theme",
  },

})
;
