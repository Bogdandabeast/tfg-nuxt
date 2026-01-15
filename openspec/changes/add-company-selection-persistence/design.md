## Context

Necesidad de persistir estado de usuario sin backend. localStorage es adecuado para preferencias simples como empresa seleccionada.

## Goals / Non-Goals

- Goals: Persistir ID de empresa de forma confiable, genérica para reutilización.
- Non-Goals: Persistir datos complejos o sensibles; no usar cookies o sessionStorage.

## Decisions

- Composable genérico: `useLocalStorage(key: string)` devuelve objeto con `set(value)`, `get()`, `remove()`.
- En store: Guardar solo ID (string) para evitar serialización de objetos complejos.
- Watcher en `companies`: Al cargar lista, buscar empresa por ID guardado y setear `currentCompany`.
- Seguridad: Solo IDs, no datos sensibles; cliente-side only.

## Risks / Trade-offs

- Riesgo: localStorage puede ser manipulado por usuario, pero no crítico para funcionalidad.
- Trade-off: Si empresa se elimina, usuario debe re-seleccionar (vs. auto-seleccionar primera).

## Migration Plan

Ninguna migración necesaria; funcionalidad aditiva.
