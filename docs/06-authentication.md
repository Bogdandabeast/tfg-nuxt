# Flujo de Autenticación

La autenticación en este proyecto se gestiona mediante una combinación de la librería `better-auth`, middlewares de Nuxt y manejadores de eventos específicos en el backend. Este sistema garantiza que tanto las rutas del frontend como los endpoints de la API estén debidamente protegidos.

El flujo general se puede dividir en dos partes: el lado del servidor y el lado del cliente.

## Lado del Servidor (Server-Side)

1.  **Endpoint de Autenticación (`server/api/auth/[...all].ts`)**:
    Este es el núcleo de la autenticación en el backend. `better-auth` utiliza este endpoint "catch-all" para gestionar todas las operaciones relacionadas con la autenticación:
    - **Inicio de sesión (Login)**: Recibe las credenciales del usuario, las valida contra la base de datos y, si son correctas, crea una sesión.
    - **Registro (Signup)**: Crea un nuevo usuario en la base de datos.
    - **Cierre de sesión (Logout)**: Invalida la sesión del usuario.
    - **Gestión de la sesión**: Emite y refresca los tokens de sesión, que se almacenan en cookies `httpOnly` y seguras.

2.  **Middleware de Servidor (`server/middleware/auth.ts`)**:
    - Este middleware se ejecuta en **cada solicitud** que llega al servidor (Nitro).
    - Su función es inspeccionar las cookies de la solicitud para encontrar el token de sesión.
    - Si existe un token válido, lo verifica y recupera los datos del usuario correspondiente desde la base de datos.
    - Finalmente, inyecta la información del usuario en el contexto del evento: `event.context.user = user`. Este paso es **fundamental**, ya que hace que el estado de autenticación esté disponible para toda la lógica del servidor (otras rutas de API, renderizado de páginas, etc.).

3.  **Manejador de Eventos Autenticado (`server/utils/define-authenticated-event-handler.ts`)**:
    - Es una utilidad personalizada que simplifica la protección de endpoints de la API.
    - Al envolver un manejador de eventos con esta función, se asegura que el código del endpoint solo se ejecutará si `event.context.user` existe.
    - Si el usuario no está autenticado, la utilidad corta la ejecución y devuelve automáticamente un error `401 Unauthorized`, evitando el acceso no autorizado a los datos.

## Lado del Cliente (Client-Side)

1.  **Composable `useAuth()` (`app/composables/useAuth.ts`)**:
    - Este composable es el punto de entrada para la autenticación en el frontend. Proporciona métodos y estado reactivo para:
      - `signIn()`: Llama al endpoint de login del backend.
      - `signOut()`: Llama al endpoint de logout.
      - `user`: Un estado reactivo que contiene la información del usuario actual (o `null` si no está autenticado).
      - `status`: Un estado que indica si la sesión se está cargando, está autenticada o no está autenticada.

2.  **Middleware Global de Navegación (`app/middleware/auth.global.ts`)**:
    - Este middleware se ejecuta en **cada cambio de ruta** en el cliente (y también en la primera carga de página en el servidor).
    - Utiliza el `useAuth()` para comprobar el estado de autenticación del usuario.
    - Si el usuario intenta acceder a una ruta protegida (p.ej., `/dashboard`) sin estar autenticado, el middleware lo redirige a la página de login (`/login`).
    - También puede evitar que un usuario ya autenticado acceda a páginas como `/login` o `/signup`, redirigiéndolo al dashboard.

3.  **Plugin de Nuxt (`app/plugins/auth.ts`)**:
    - Este plugin se ejecuta al iniciar la aplicación.
    - Su propósito principal es inicializar el estado de autenticación. Llama a `useAuth()` para que intente recuperar la sesión del usuario desde el backend en la carga inicial de la aplicación. Esto asegura que si el usuario ya tiene una sesión válida (por ejemplo, de una visita anterior), su estado de "logueado" se restaure correctamente.
