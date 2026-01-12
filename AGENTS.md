# AGENTS.md - Development Guidelines for AI Agents

This file contains essential information for AI coding agents working on this Nuxt.js project. It covers build commands, testing procedures, and code style guidelines to ensure consistent development practices.

## Project Overview

Full-stack Nuxt.js app for managing companies, customers, products, and sales.

- **Frontend:** Nuxt.js (Vue 3), Pinia, Nuxt UI, Tailwind CSS
- **Backend:** Nitro (H3), Drizzle ORM, PostgreSQL
- **Auth:** better-auth
- **Tools:** TypeScript, ESLint, Vitest, Husky, commitlint

## Package Management

**Use `pnpm` for dependencies and `bunx` for temporary tools** (avoid npm/npx).

- Install: `pnpm install`
- Add dep: `pnpm add <package>`
- Add dev dep: `pnpm add -D <package>`
- Remove: `pnpm remove <package>`
- Temp tool: `bunx <command>` (e.g., `bunx nuxi typecheck`)

## Build & Test Commands

### Development

- Dev server: `pnpm dev`
- Build: `pnpm build`
- Generate: `pnpm generate`
- Preview: `pnpm preview`

### Quality

- Lint: `pnpm lint`
- Fix lint: `pnpm lint:fix`
- Type check: `bunx nuxi typecheck`

### Testing (Vitest with @nuxt/test-utils)

- All tests: `bunx vitest`
- Unit: `bunx vitest run --project unit`
- Nuxt integration: `bunx vitest run --project nuxt`
- Watch: `bunx vitest --watch`
- Single file: `bunx vitest path/to/file.test.ts`
- Coverage: `bunx vitest run --coverage`

**Test locations:** `test/unit/*.test.ts`, `test/e2e/*.test.ts`, `test/nuxt/*.test.ts`

## Code Style Guidelines

### General

- **TypeScript:** Strict typing, avoid `any`, use `type` over `interface`
- **Vue 3:** `<script setup lang="ts">` for components
- **Nuxt 4:** Follow conventions and auto-imports

### File Naming

- Components: PascalCase (e.g., `ProductForm.vue`)
- Composables: `useFeatureName` (e.g., `useAuth.ts`)
- Stores: `useStoreName` (e.g., `useAuthStore`)
- Types: kebab-case in `types/` (e.g., `index.d.ts`)
- Pages: kebab-case matching routes

### Vue Components

- Script: `<script setup lang="ts">`
- Data: `ref()` for primitives, `reactive()` for objects
- Computed: `computed()` with full syntax
- Props: Proper TypeScript types
- Events: camelCase with `Handler` suffix

### State Management (Pinia)

- Stores: `defineStore("name", () => { ... })`
- Export: `useStoreName`
- State: `ref()` for reactive, `computed()` for derived
- Return all public methods

### API & Data

- CSRF: Include tokens for state-changing requests
- Errors: Try-catch, toast messages
- Loading: Show indicators for async ops
- Validation: Use Zod schemas

### Styling & UI

- Components: Nuxt UI (UButton, UCard, etc.)
- CSS: Tailwind utilities
- Responsive: Nuxt UI/Tailwind responsive utilities
- Themes: @nuxtjs/color-mode for light/dark

### Imports

- Auto-imports for Vue/Nuxt utilities
- Explicit imports for third-party/local modules
- Group by type: Vue → Nuxt → third-party → local

### Error Handling

- Avoid `console.log/error` (ESLint warns)
- User feedback: Toast notifications
- Validation: Clear error displays
- Network: Graceful fallbacks

### Security

- CSRF: Enabled for POST/PUT/PATCH/DELETE
- Input validation: Client + server
- Secrets: Never commit env vars
- HTTPS: Configure for production

### Performance

- Lazy loading: Nuxt lazy components
- Computed caching: For expensive calculations
- Images: @nuxt/image optimization
- Bundle: Monitor and optimize size

### Git & Commits

- **Conventional commits:** `type(scope): description`
  - Types: `feat`, `fix`, `docs`, `refactor`, `test`
  - Example: `feat: add user auth`
- **Pre-commit:** Husky + lint-staged
- **Branches:** Descriptive names (feature/, bugfix/)
- **GitHub CLI:** `gh` for issues/PRs

### Testing Guidelines

- Structure: Arrange-Act-Assert
- Mocking: Vitest utilities
- Components: Test behavior, not implementation
- Stores: Test logic independently
- Integration: Full Nuxt flows
- Coverage: Meaningful, not just percentage

### i18n

- Default: Spanish (es)
- Supported: English (en), Spanish (es)
- Usage: `t()` for translations

### Database

- **ORM:** Drizzle ORM (PostgreSQL/SQLite)
- **Migrations:** `bunx drizzle-kit generate` or `bunx drizzle-kit push`
- **Types:** Auto-generated from schema

## Development Workflow

Following GitHub Flow:

1. **Create Issue**: `gh issue create --title "Feature/Issue title" --body "Detailed description"`
2. **Create Branch**: `gh issue develop <issue-number> --name "feature/branch-name"` (creates branch from issue)
3. **Implement Changes**: Make incremental changes with small commits
4. **Verify Quality**:
   - `pnpm lint` and `pnpm lint:fix`
   - `bunx nuxi typecheck`
   - `pnpm build` (test build before pushing)
5. **Commit**: Small, conventional commits (e.g., `feat: add new feature`, `fix: resolve bug`)
6. **Push & PR**: `git push -u origin branch-name` then `gh pr create --title "PR title" --body "Description. Closes #<issue-number>"`

### GitHub CLI

- Issue: `gh issue create --title "Title" --body "Desc"`
- Branch from issue: `gh issue develop <num> --name "feature/name"`
- Push: `git push -u origin feature/name`
- PR: `gh pr create --title "feat: desc" --body "Details. Closes #<num>"`

### Husky Hooks

- Setup: `pnpm run prepare`
- Linting: Husky ejecuta automáticamente linting en archivos staged
- Commit validation: Husky aplica validación de formato convencional de commits

**Pre-commit check:** Además de las comprobaciones automáticas de Husky, se recomienda ejecutar manualmente `pnpm lint`, `bunx nuxi typecheck`, y `pnpm build` antes de hacer push. El comando `pnpm build` es especialmente aconsejable antes de releases, aunque no obligatorio en cada commit.
