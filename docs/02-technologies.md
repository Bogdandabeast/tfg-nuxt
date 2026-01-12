# Tecnologías Utilizadas

Este proyecto utiliza un stack de tecnologías moderno basado en TypeScript para construir una aplicación web full-stack.

## Frontend

- **[Nuxt 3](https://nuxt.com/):** Framework de Vue.js para crear aplicaciones web universales. Proporciona renderizado del lado del servidor (SSR), generación de sitios estáticos (SSG), y una estructura de proyecto opinada para un desarrollo rápido.
- **[Vue 3](https://vuejs.org/):** Framework progresivo de JavaScript para construir interfaces de usuario.
- **[Pinia](https://pinia.vuejs.org/):** Solución de gestión de estado para Vue.js, recomendada oficialmente. Se utiliza para gestionar el estado global de la aplicación, como la información del usuario autenticado y los datos de las diferentes secciones (empresas, clientes, etc.).
- **[Nuxt UI](https://ui.nuxt.com/):** Biblioteca de componentes de UI completamente personalizables, construida sobre Headless UI y Tailwind CSS.
- **[Tailwind CSS](https://tailwindcss.com/):** Framework de CSS "utility-first" para un diseño rápido y personalizado.
- **[Iconify](https://iconify.design/):** Framework de iconos que permite usar iconos de diferentes sets (Lucide, Simple Icons) de manera unificada.
- **[i18n](https://i18n.nuxtjs.org/):** Módulo de internacionalización para Nuxt, permitiendo la traducción de la interfaz a múltiples idiomas.

## Backend

- **[Nitro](https://nitro.unjs.io/):** Servidor de backend que viene integrado con Nuxt 3. Es el responsable de gestionar las rutas de la API, los middlewares del servidor y el renderizado del lado del servidor.
- **[H3](https://h3.unjs.io/):** Framework minimalista para HTTP que subyace a Nitro, utilizado para crear los endpoints de la API.
- **[better-auth](https://github.com/sidebase/better-auth):** Librería para gestionar la autenticación, integrada con Nuxt.

## Base de Datos

- **[Drizzle ORM](https://orm.drizzle.team/):** ORM "headless" para TypeScript. Proporciona una forma segura y declarativa de interactuar con la base de datos, escribiendo consultas en un dialecto similar a SQL pero con la seguridad de tipos de TypeScript.
- **[Drizzle Kit](https://orm.drizzle.team/kit/overview):** Herramienta de línea de comandos para gestionar el esquema de la base de datos y generar migraciones.
- **[PostgreSQL](https://www.postgresql.org/):** Sistema de gestión de bases de datos relacional utilizado en producción.
- **[Turso](https://turso.tech/):** Plataforma de base de datos distribuida basada en libSQL (un fork de SQLite), utilizada para el desarrollo local y posiblemente para despliegues "edge".

## Calidad de Código y Herramientas

- **[TypeScript](https://www.typescriptlang.org/):** Superset de JavaScript que añade tipado estático.
- **[ESLint](https://eslint.org/):** Herramienta para identificar y reportar patrones problemáticos encontrados en el código JavaScript/TypeScript.
- **[Husky](https://typicode.github.io/husky/):** Herramienta que permite ejecutar scripts en los hooks de Git (por ejemplo, ejecutar ESLint antes de un `commit`).
- **[Vitest](https://vitest.dev/):** Framework de testing para aplicaciones de Vite (y por extensión, Nuxt).
- **[Docker](https://www.docker.com/):** La presencia de `docker-compose.yml` sugiere que se utiliza para orquestar los servicios de la aplicación (la aplicación Nuxt y la base de datos) en un entorno de desarrollo o producción.
