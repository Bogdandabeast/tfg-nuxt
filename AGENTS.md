# AGENTS.md

Este archivo documenta los comandos comunes para tareas de desarrollo en el proyecto tfg-nuxt y proporciona contexto para la colaboración.
Se usa para recordar comandos estándar y facilitar la ejecución automática por herramientas como opencode.

## Contexto del Proyecto

Este proyecto es una aplicación web full-stack desarrollada con Nuxt.js. Incluye un frontend reactivo, un backend API robusto y persistencia de datos a través de una base de datos relacional. El objetivo es proporcionar una plataforma eficiente y escalable para la gestión de empresas, clientes, productos y ventas.

## Tecnologías Clave

- **Framework Frontend:** Nuxt.js (Vue 3)
- **Gestión de Estado:** Pinia
- **UI/CSS Framework:** Nuxt UI, Tailwind CSS
- **Servidor/API:** Nitro (H3)
- **ORM:** Drizzle ORM
- **Base de Datos:** PostgreSQL
- **Autenticación:** better-auth
- **Lenguaje:** TypeScript
- **Herramientas de Calidad:** ESLint, Vitest, Husky, commitlint

## Flujo de Desarrollo

Para garantizar un control de versiones adecuado y una colaboración fluida, sigue este flujo de trabajo al implementar cambios:

1.  **Crear una Nueva Rama:** Antes de iniciar cualquier trabajo, crea una nueva rama desde `main` (o la rama base de desarrollo actual) con un nombre descriptivo (p.ej., `feature/nombre-de-la-caracteristica`, `bugfix/descripcion-del-bug`).
    `git checkout -b feature/your-feature-name`
2.  **Implementar Cambios:** Realiza tus modificaciones en esta nueva rama.
3.  **Verificar Calidad:** Ejecuta `pnpm run lint`, `pnpm run lint:fix`, y `bunx nuxi typecheck` para asegurar la calidad del código.
4.  **Realizar Commits:** Haz commits pequeños y atómicos con mensajes convencionales (usa `feat:`, `fix:`, `docs:`, etc.). Los hooks pre-commit ejecutarán linting automático.

## Gestión de Paquetes

**Preferencias:** Usa siempre `pnpm` para añadir dependencias y `bunx` para herramientas temporales (evita `npm` o `npx` para consistencia y eficiencia).

- Instalar dependencias: `pnpm install` (en lugar de npm install; usa este para setup inicial).
- Añadir dependencia: `pnpm add <package>` (para paquetes runtime).
- Añadir dependencia de desarrollo: `pnpm add -D <package>` (para herramientas como ESLint o Vitest).
- Remover paquete: `pnpm remove <package>`.
- Ejecutar herramienta temporal: `bunx <comando>` (ej. `bunx nuxi typecheck` para type checking sin instalar globalmente).

## Convenciones de Commit

Sigue conventional commits para mantener un historial claro y automatizar el versionado. Mensajes deben tener el formato: `tipo(alcance): descripción`

- Tipos comunes: `feat` (nueva funcionalidad), `fix` (corrección de bug), `docs` (documentación), `refactor` (refactorización), `test` (pruebas).
- Ejemplo: `feat: add user authentication`

## Linting y Calidad de Código

- Ejecutar linting: `pnpm run lint` (usa ESLint para verificar código).
- Corregir errores de linting automáticamente: `pnpm run lint:fix`.
- Ejecutar type checking: `bunx nuxi typecheck` (verifica tipos TypeScript).
- Commitlint: Valida mensajes de commit siguiendo conventional commits (configurado en `.husky/commit-msg`).

## Otros

- Migraciones de DB (si usas Drizzle): `bunx drizzle-kit generate` o `bunx drizzle-kit push` (revisa drizzle.config.ts para comandos específicos).
- Husky hooks: `pnpm run prepare` (configura pre-commit hooks). Los hooks incluyen lint-staged para linting automático en archivos staged y commitlint para validar mensajes de commit.
