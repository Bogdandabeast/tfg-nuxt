## 1. Implementación

- [x] 1.1 Crear composable `composables/useBrowserStorage.ts` con funciones `set`, `get`, `remove`.
- [x] 1.2 Modificar `app/stores/companies.ts`: Importar composable, actualizar `setCurrentCompany` para guardar ID, agregar watcher para cargar empresa guardada.
- [x] 1.3 Probar persistencia: Seleccionar empresa, recargar página, verificar selección automática.
- [x] 1.4 Manejar edge cases: Empresa eliminada (no seleccionar nada), localStorage vacío.

## 2. Validación y Pruebas

- [x] 2.1 Ejecutar `pnpm lint` y `bunx nuxi typecheck`.
- [x] 2.2 Probar en navegador: Recargar, cambiar empresa, eliminar.
- [x] 2.3 Añadir test unitario para el composable (si necesario).
