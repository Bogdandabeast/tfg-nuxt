# Copilot Instructions - Revisión de Pull Requests

## Configuración de Respuestas

- **Idioma**: Responder SIEMPRE en español
- **Ubicación**: Todos los comentarios DEBEN aparecer en la pestaña `Files Changed`
- **Formato**: Incluir los dos botones de implementación automática para cada sugerencia
- **Referencias**: Proporcionar enlaces a documentación oficial cuando sea aplicable
- **Severidad**: Clasificar cada issue como `🚨 Crítico`, `⚠️ Importante` o `💡 Sugerencia`

## Stack Tecnológico del Proyecto

- **Framework**: Nuxt 4 + Vue 3 con Composition API
- **Lenguajes**: TypeScript, SCSS
- **Arquitectura**: SPA (SSR deshabilitado)
- **Estado**: Pinia
- **Internacionalización**: @nuxtjs/i18n
- **CMS**: Strapi v5
- **Testing**: Vitest
- **Iconos**: @nuxt/icon
- **Multimedia**: @nuxt/image, Plyr, HLS.js

## Reglas Críticas - Revisión Obligatoria

### JavaScript y TypeScript

#### 🚨 Prohibido (Error crítico)

- `var` - Usar `const` o `let` exclusivamente
- `console.log()` - Eliminar completamente del código de producción (usar composables de logging si es necesario)
- Comentarios `//` - Solo permitidos si son JSDoc (`/** */`)
- **Magic Strings/Numbers** - Usar constantes del directorio `/constants/` o enums
- **Violaciones SOLID** - Detectar y reportar problemas de principios SOLID
- **any como tipo** - Usar tipos específicos o unknown/generic cuando sea apropiado
- **Mutación directa de props** - Props son read-only en Vue 3

#### ⚠️ Mejoras obligatorias

- **Código duplicado**: Identificar y refactorizar en composables reutilizables
- **Variables no utilizadas**: Eliminar imports y variables sin uso
- **Legibilidad**: Simplificar expresiones complejas y mejorar nombres de variables
- **Tipos TypeScript**: Agregar tipos explícitos, especialmente en `defineProps<T>()`
- **Principios SOLID**: Verificar Single Responsibility, Open/Closed, Dependency Inversion
- **Constantes**: Extraer valores hardcodeados a `/constants/` con nombres descriptivos
- **Composables**: Mover lógica reutilizable a `/composables/`
- **Performance**: Usar `shallowRef`, `shallowReactive` cuando sea apropiado
- **Accessibility**: Verificar atributos ARIA y semántica HTML

#### 💡 Sugerencias de mejora

- **Optimización de renders**: Usar `v-memo` para listas complejas
- **Lazy loading**: Implementar `defineAsyncComponent` para componentes pesados
- **Type narrowing**: Usar type guards para mejor inferencia de tipos

### Vue.js y Nuxt.js

#### 🚨 Prohibido (Error crítico)

- SVG inline en `<template>` - Usar `<Icon name="..." />` del plugin Nuxt Icons
- Imports de Vue (`import { ref } from 'vue'`) - Se autoimportan automáticamente
- Comentarios HTML en `<template>` - Eliminar completamente
- **Reactive() en componentes grandes** - Usar `ref()` para mejor performance
- **Acceso directo a $route/$router** - Usar composables `useRoute()`/`useRouter()`

#### ⚠️ Mejoras obligatorias

- **Composables**: Verificar uso correcto de `useState`, `useFetch`, `useLazyFetch`, etc.
- **Componentes**: Validar estructura `<script setup>`, `<template>`, `<style scoped>`
- **Props**: Definir tipos correctos con `defineProps<T>()` e interfaces
- **Emits**: Definir eventos con `defineEmits<T>()` y tipos específicos
- **Lifecycle**: Usar composables de ciclo de vida apropiados (`onMounted`, `onUnmounted`)
- **Hydration**: Verificar `<ClientOnly>` para componentes que requieren cliente
- **SEO**: Usar `useSeoMeta()` y `useHead()` correctamente
- **Error Handling**: Implementar manejo de errores con `useErrorHandler`

#### 💡 Sugerencias de mejora

- **Slot names**: Usar nombres descriptivos y consistentes
- **Component naming**: Seguir PascalCase y nombres semánticamente correctos
- **Template refs**: Usar `templateRef()` para referencias a elementos DOM

### SCSS y CSS

#### 🚨 Prohibido (Error crítico)

- **Nomenclatura no-BEM** - Todas las clases DEBEN seguir metodología BEM (Bloque\_\_Elemento--Modificador)
- **Selectores anidados profundos** - Máximo 3 niveles de anidación
- **Colores hardcodeados** - Usar variables CSS o tokens de diseño
- **!important** - Solo en casos excepcionales y documentados
- **Valores mágicos** - Documentar significado de números específicos

#### ⚠️ Mejoras obligatorias

- **Estructura BEM**: Verificar que bloques, elementos y modificadores estén correctamente nombrados
- **Variables CSS**: Extraer valores repetidos (colores, espaciados, fuentes) a variables
- **Mixins SCSS**: Usar mixins para patrones repetitivos (media queries, animaciones)
- **Organización**: Agrupar propiedades relacionadas y mantener orden consistente
- **Responsive Design**: Usar mixins de breakpoints consistentes
- **Scoped Styles**: Verificar que estilos estén correctamente encapsulados en componentes Vue

#### 💡 Sugerencias de mejora

- **CSS Grid/Flexbox**: Preferir sobre floats y positioning absolutos
- **CSS Custom Properties**: Usar variables CSS nativas cuando sea posible
- **Performance**: Minimizar reflows con propiedades que afectan layout

## Patrones Específicos del Proyecto

### Estructura de Archivos

- **Componentes**: Seguir estructura de directorios `/app/components/`
  - `ui/` - Componentes reutilizables
  - `views/` - Componentes específicos de vistas
  - `layouts/` - Componentes de layout
- **Composables**: Ubicar en `/app/composables/` con prefijo `use`
- **Constants**: Agrupar en `/app/constants/` por categoría funcional
- **Interfaces**: Ubicar en `/app/interfaces/` con tipos relacionados agrupados

### Composables Pattern

#### 🚨 Verificaciones obligatorias

- **Naming**: Prefijo `use` + PascalCase (ej: `useCardHover`)
- **Return**: Siempre retornar objeto con propiedades nombradas
- **Reactividad**: Usar `ref()`/`reactive()` apropiadamente
- **Cleanup**: Implementar cleanup en `onUnmounted` cuando sea necesario

### Internationalization

#### ⚠️ Reglas de i18n

- **Keys**: Usar estructura jerárquica clara (`page.section.element`)
- **Pluralización**: Implementar reglas de pluralización correctas
- **Parámetros**: Usar interpolación tipada `$t('key', { param: value })`
- **Lazy loading**: Cargar traducciones por ruta cuando sea posible

### Strapi Integration

#### 💡 Buenas prácticas

- **Tipos**: Generar interfaces TypeScript para entidades Strapi
- **Caching**: Usar estrategias de cache apropiadas con `useFetch`
- **Error handling**: Manejar errores de API consistentemente

## Ejemplos de Correcciones

### ❌ Incorrecto - Composable sin cleanup

```typescript
// composables/useTimer.ts
export const useTimer = () => {
  const timer = ref(0)

  const interval = setInterval(() => {
    timer.value++
  }, 1000)

  return { timer }
}
```

### ✅ Correcto - Composable con cleanup

```typescript
// composables/useTimer.ts
export const useTimer = () => {
  const timer = ref(0)
  let interval: NodeJS.Timeout | null = null

  const start = () => {
    if (interval) return
    interval = setInterval(() => {
      timer.value++
    }, 1000)
  }

  const stop = () => {
    if (interval) {
      clearInterval(interval)
      interval = null
    }
  }

  onUnmounted(() => {
    stop()
  })

  return { timer, start, stop }
}
```

### ❌ Incorrecto - Props sin tipos explícitos

```vue
<script setup lang="ts">
const props = defineProps(['title', 'variant', 'size'])
</script>
```

### ✅ Correcto - Props con tipos explícitos

```vue
<script setup lang="ts">
interface Props {
  title: string
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'small' | 'medium' | 'large'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'medium',
})
</script>
```

### ❌ Incorrecto - Magic Strings

```javascript
if (user.role === 'admin') {
  window.location.href = '/dashboard'
}
```

### ✅ Correcto - Constantes

```javascript
const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user'
} as const;

const ROUTES = {
  DASHBOARD: '/dashboard'
} as const;

if (user.role === USER_ROLES.ADMIN) {
  window.location.href = ROUTES.DASHBOARD;
}
```

### ❌ Incorrecto - Violación SOLID (SRP)

```javascript
class UserService {
  saveUser(user) {
    // Lógica de validación
    // Lógica de guardado
    // Lógica de envío de email
    // Lógica de logging
  }
}
```

### ✅ Correcto - Principio de Responsabilidad Única

```javascript
class UserService {
  constructor(
    private validator: UserValidator,
    private repository: UserRepository,
    private emailService: EmailService,
    private logger: Logger
  ) {}

  async saveUser(user: User): Promise<void> {
    this.validator.validate(user);
    await this.repository.save(user);
    await this.emailService.sendWelcomeEmail(user);
    this.logger.log(`User ${user.id} saved successfully`);
  }
}
```

### ❌ Incorrecto - SCSS sin BEM

```scss
.card {
  .title {
    font-size: 24px;
    &.big {
      font-size: 32px;
    }
  }
  .button {
    background: #007bff;
  }
}
```

### ✅ Correcto - SCSS con BEM

```scss
.card {
  &__title {
    font-size: 24px;

    &--large {
      font-size: 32px;
    }
  }

  &__button {
    background: var(--color-primary);
  }
}
```

### ❌ Incorrecto (Vue)

```vue
<template>
  <!-- comentario en template -->
  <svg>...</svg>
</template>
```

### ✅ Correcto (Vue)

```vue
<template>
  <Icon name="heroicons:home" />
</template>
```

## Instrucciones Específicas para Copilot

1. Revisar CADA archivo modificado sin excepción
2. Reportar TODOS los problemas encontrados, no solo los críticos
3. Proporcionar código corregido completo, no solo la línea problemática
4. Incluir explicación breve del por qué del cambio
5. Verificar que no se introduzcan nuevos problemas al corregir
6. **Magic Strings/Numbers**: Detectar y reportar cualquier string o número hardcodeado
7. **Análisis SOLID**: Evaluar si las funciones/clases cumplen los principios SOLID
8. **BEM en SCSS**: Verificar que todas las clases CSS sigan la nomenclatura BEM
9. **Dependencias**: Revisar que las dependencias estén correctamente inyectadas

## Detección Prioritaria

- **Nivel 1 (Crítico)**: Magic strings, violaciones var/console.log, SVG inline
- **Nivel 2 (Importante)**: Violaciones SOLID, nomenclatura no-BEM, imports innecesarios
- **Nivel 3 (Mejora)**: Legibilidad, organización, optimizaciones

## Enlaces de Referencia

- [Guía de estilo JavaScript](https://developer.mozilla.org/es/docs/Web/JavaScript/Guide)
- [TypeScript Best Practices](https://typescript-tips.vercel.app/)
- [Principios SOLID en JavaScript](https://medium.com/@cramirez92/s-o-l-i-d-los-5-principios-que-te-ayudar%C3%A1n-a-desarrollar-software-de-calidad-8a5b9a39e8d9)
- [Metodología BEM](https://getbem.com/introduction/)
- [Vue.js 3 Composition API](https://vuejs.org/guide/essentials/reactivity-fundamentals.html)
- [Nuxt 3 Auto-imports](https://nuxt.com/docs/guide/concepts/auto-imports)
- [Nuxt Icon Module](https://nuxt.com/modules/icon)
- [SCSS Guidelines](https://sass-guidelin.es/es/)
- [Clean Code JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)
