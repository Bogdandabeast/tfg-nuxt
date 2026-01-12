# Frontend (Nuxt.js)

La interfaz de usuario de la aplicación está construida con Nuxt 3, un potente framework de Vue.js. Esta sección detalla los aspectos clave de la implementación del frontend.

## Estructura de Directorios `app/`

El código fuente del frontend se encuentra principalmente en el directorio `app/`.

- **`assets/`**: Contiene los archivos estáticos que son procesados por las herramientas de compilación, como el archivo `main.css`.
- **`components/`**: Alberga los componentes de Vue, organizados por funcionalidad (p.ej., `Dashboard`, `landing`). Esta estructura modular facilita la reutilización y el mantenimiento.
- **`composables/`**: Contiene los "composables" de Vue (`useAuth`, `useDashboard`), que son funciones reutilizables para encapsular y gestionar lógica con estado, siguiendo la Composition API de Vue 3.
- **`layouts/`**: Define las plantillas o estructuras de página. Por ejemplo, `dashboard.vue` probablemente incluye la navegación lateral y la cabecera del panel de control, mientras que `auth.vue` proporciona una estructura para las páginas de login y registro.
- **`middleware/`**: Los middlewares de Nuxt se ejecutan antes de renderizar una página o un layout. `auth.global.ts` es un middleware global que probablemente comprueba el estado de autenticación del usuario en cada cambio de ruta, protegiendo las rutas privadas.
- **`pages/`**: Nuxt utiliza un sistema de enrutamiento basado en archivos. Cada archivo `.vue` en este directorio corresponde a una ruta de la aplicación. La estructura de subdirectorios anidados crea rutas anidadas (p.ej., `dashboard/settings/members.vue`).
- **`plugins/`**: Los plugins de Nuxt permiten ejecutar código en el momento de la creación de la aplicación Vue. `auth.ts` podría inicializar el estado de autenticación o hacer que la información del usuario esté disponible globalmente.
- **`stores/`**: Utiliza Pinia para la gestión del estado. Cada archivo define un "almacén" para una parte específica del estado de la aplicación (p.ej., `auth.ts` para la autenticación, `products.ts` para los productos).

## Gestión de Estado con Pinia

La aplicación utiliza Pinia para centralizar el estado. Los almacenes (`stores`) son responsables de:

- Mantener el estado de la aplicación (p.ej., el usuario actual, la lista de empresas).
- Exponer acciones (`actions`) para modificar el estado de forma controlada.
- Proporcionar `getters` para acceder a datos computados del estado.

Esta separación de responsabilidades hace que el flujo de datos sea predecible y fácil de depurar.

## Componentes y UI

La interfaz se construye con **Nuxt UI**, una librería de componentes basada en **Tailwind CSS**. Esto permite:

- Un desarrollo rápido utilizando componentes pre-construidos y personalizables (`UButton`, `UModal`, `UForm`, etc.).
- La capacidad de mantener una consistencia visual en toda la aplicación.
- La personalización del tema y los estilos a través de la configuración de Tailwind CSS y las variables de Nuxt UI.

## Internacionalización

El módulo `nuxtjs/i18n` se utiliza para la traducción de la aplicación. Los textos de la interfaz se almacenan en archivos JSON dentro del directorio `i18n/locales/`, permitiendo un soporte multi-idioma (inglés y español, según la configuración).
