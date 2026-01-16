# Change: Add Company Selection Persistence

## Why

Mejorar la experiencia del usuario al recordar la empresa seleccionada entre recargas de página, evitando que el usuario tenga que re-elegir manualmente cada vez. Esto reduce fricción en el flujo de trabajo diario.

## What Changes

- Crear un composable `useLocalStorage` para gestión genérica de localStorage (set, get, remove).
- Modificar el store `useCompaniesStore` para persistir el ID de la empresa seleccionada usando el composable.
- Al cargar empresas, recuperar automáticamente la empresa guardada si existe.

## Impact

- Affected specs: Nueva capacidad `company-management` (persistencia de selección).
- Affected code: `app/stores/companies.ts` (modificación), nuevos composables en `composables/useLocalStorage.ts` y `composables/useCompanySelection.ts`.
- No cambios en APIs, UI o seguridad; solo lógica de estado.
