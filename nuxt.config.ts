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
    https: false,
    cookieKey: "",
    cookie: {
      path: "/",
      httpOnly: true,
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
    "/**": {
      headers: {
        "X-Frame-Options": "DENY",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
      },
    },
  },
  i18n: {
    strategy: "prefix",
    defaultLocale: "es",
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
