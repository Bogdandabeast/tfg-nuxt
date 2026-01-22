import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  nitro: {
    preset: "cloudflare_module",
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
    },
  },
  devtools: { enabled: true },
  srcDir: "app",
  modules: [
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/test-utils/module",
    "@nuxtjs/color-mode",
    "@nuxtjs/i18n",
    "@nuxt/ui",
    "@vueuse/nuxt",
    "nuxt-og-image",
    "@pinia/nuxt",
    "nuxt-csurf",
  ],
  vite: {

    plugins: [tailwindcss()],
  },
  css: ["~/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  csurf: {
    https: process.env.CSRF_HTTPS === "true",
    cookieKey: process.env.CSRF_COOKIE_KEY || "__Host-csrf",
    cookie: {
      path: "/",
      httpOnly: true,
      secure: process.env.CSRF_HTTPS === "true",
      sameSite: "strict",
    },
    methodsToProtect: ["POST", "PUT", "PATCH", "DELETE"],
    addCsrfTokenToEventCtx: true,
    headerName: "csrf-token",
  },
  routeRules: {
    "/api/**": {
      cors: true,
    },
  },
  i18n: {
    strategy: "prefix",
    defaultLocale: "es",
    langDir: "locales",
    locales: [
      { code: "en", name: "English", file: "en.json" },
      { code: "es", name: "Español", file: "es.json" },
    ],

  },

  runtimeConfig: {
    public: {
      appUrl: process.env.NUXT_PUBLIC_APP_URL,
    },
  },

  colorMode: {
    dataValue: "theme",
  },
});
