# Project Context

## Purpose

Full-stack Nuxt.js application for managing companies, customers, products, and sales. This is a business management system designed to handle CRM and inventory operations for small to medium businesses.

## Tech Stack

- **Frontend:** Nuxt.js (Vue 3), Pinia, Nuxt UI, Tailwind CSS
- **Backend:** Nitro (H3), Drizzle ORM, PostgreSQL
- **Auth:** better-auth
- **Tools:** TypeScript, ESLint, Vitest, Husky, commitlint
- **Package Manager:** pnpm (with bunx for temporary tools)

## Project Conventions

### Code Style

- **TypeScript:** Strict typing, avoid `any`, use `type` over `interface`
- **Vue 3:** `<script setup lang="ts">` for components
- **Nuxt 4:** Follow conventions and auto-imports
- **File Naming:**
  - Components: PascalCase (e.g., `ProductForm.vue`)
  - Composables: `useFeatureName` (e.g., `useAuth.ts`)
  - Stores: `useStoreName` (e.g., `useAuthStore`)
  - Types: kebab-case in `types/` (e.g., `index.d.ts`)
  - Pages: kebab-case matching routes
- **Vue Components:**
  - Script: `<script setup lang="ts">`
  - Data: `ref()` for primitives, `reactive()` for objects
  - Computed: `computed()` with full syntax
  - Props: Proper TypeScript types
  - Events: camelCase with `Handler` suffix
- **Imports:** Auto-imports for Vue/Nuxt utilities, explicit for third-party/local, group by type
- **Error Handling:** Avoid `console.log/error`, user feedback via toast notifications

### Architecture Patterns

- **State Management:** Pinia stores with `defineStore("name", () => { ... })`
- **API Operations:** GET operations in Pinia stores, POST/DELETE through composables (`use<Entity>Api`)
- **UI Components:** Nuxt UI (UButton, UCard, etc.) with Tailwind utilities
- **Responsive Design:** Nuxt UI/Tailwind responsive utilities
- **Theming:** @nuxtjs/color-mode for light/dark modes
- **Validation:** Zod schemas
- **Security:** CSRF tokens for state-changing requests

### Testing Strategy

- **Framework:** Vitest with @nuxt/test-utils
- **Test Locations:** `test/unit/*.test.ts`, `test/e2e/*.test.ts`, `test/nuxt/*.test.ts`
- **Commands:**
  - All tests: `bunx vitest`
  - Unit: `bunx vitest run --project unit`
  - Nuxt integration: `bunx vitest run --project nuxt`
  - Watch: `bunx vitest --watch`
  - Single file: `bunx vitest path/to/file.test.ts`
  - Coverage: `bunx vitest run --coverage`
- **Structure:** Arrange-Act-Assert
- **Mocking:** Vitest utilities
- **Coverage:** Meaningful, not just percentage

### Git Workflow

- **Conventional Commits:** `type(scope): description`
  - Types: `feat`, `fix`, `docs`, `refactor`, `test`
  - Examples: `feat: add user auth`, `fix: resolve bug`
- **Branching:** Descriptive names (feature/, bugfix/)
- **GitHub CLI:** `gh` for issues/PRs
- **Workflow:** GitHub Flow - create issue, branch from issue, implement, verify quality, commit, push & PR
- **Pre-commit:** Husky + lint-staged, automatic linting and typecheck
- **Commands:** `gh issue develop <num> --name "feature/name"` to create branch from issue

## Domain Context

- **Business Entities:** Companies, Customers, Products, Sales
- **Operations:** CRUD operations for all entities, sales tracking, inventory management
- **User Management:** Authentication via better-auth
- **Localization:** Default Spanish (es), supports English (en)

## Important Constraints

- **Security:** CSRF enabled for POST/PUT/PATCH/DELETE, input validation client + server, never commit secrets
- **Performance:** Lazy loading, computed caching, @nuxt/image optimization
- **Database:** Drizzle ORM with PostgreSQL/SQLite
- **Migrations:** `bunx drizzle-kit generate` or `bunx drizzle-kit push`

## External Dependencies

- **Database:** PostgreSQL (primary) or SQLite (development)
- **Auth Provider:** better-auth for authentication
- **UI Library:** Nuxt UI and Tailwind CSS
- **ORM:** Drizzle ORM for database operations
