# Backend (API Nitro/H3)

El backend de la aplicación está impulsado por **Nitro**, el servidor web que Nuxt 3 utiliza bajo el capó. Nitro ofrece un rendimiento excepcional y la capacidad de desplegar la aplicación en una variedad de entornos (Node.js, serverless, edge).

## API Endpoints

La lógica de la API reside en el directorio `server/api/`. Nuxt sigue una convención de enrutamiento basada en archivos para crear los endpoints de la API.

- **Estructura:** Los archivos dentro de `server/api/` se mapean directamente a rutas de la API. Por ejemplo:
  - `server/api/companies.get.ts` se convierte en el endpoint `GET /api/companies`.
  - `server/api/sales.[id].put.ts` se convierte en `PUT /api/sales/:id`.

- **Métodos HTTP:** El método HTTP (GET, POST, PUT, DELETE, etc.) se especifica en el nombre del archivo (p.ej., `.get.ts`, `.post.ts`).

- **Manejadores de Eventos:** Cada archivo de la API exporta por defecto un "manejador de eventos" (`event handler`) definido con `defineEventHandler` o `defineAuthenticatedEventHandler`. Estos manejadores reciben el `event` de H3, que contiene la información de la solicitud (headers, body, parámetros de ruta) y permite enviar la respuesta.

## Middleware de Servidor

El directorio `server/middleware/` contiene middlewares que se ejecutan en el servidor en cada solicitud que llega, antes de que se procese cualquier ruta de la API o se renderice una página.

- **`auth.ts`**: Este middleware es crucial para la seguridad. Probablemente se encarga de:
  - Leer la sesión del usuario a partir de las cookies o headers de la solicitud.
  - Validar la sesión y obtener los datos del usuario.
  - Inyectar la información del usuario en el contexto del evento (`event.context.user`), haciéndola disponible para los endpoints de la API y el renderizado del lado del servidor.

## Utilidades de Servidor

El directorio `server/utils/` contiene funciones y utilidades que se pueden usar en cualquier parte del servidor (endpoints de la API, middlewares).

- **`define-authenticated-event-handler.ts`**: Es una utilidad personalizada que probablemente envuelve el `defineEventHandler` de H3. Su propósito es abstraer la lógica de autenticación:
  1. Comprueba si existe un usuario en `event.context.user` (inyectado por el middleware de autenticación).
  2. Si no hay usuario, lanza un error de "No autorizado" (401), protegiendo el endpoint.
  3. Si hay un usuario, ejecuta el manejador de eventos real, pasándole el evento con la garantía de que el usuario está autenticado.
- **`utils/schemas/sales.ts`**: Define un esquema de validación (probablemente con `zod`) para los datos relacionados con las ventas. Esto asegura que los datos que llegan al backend a través de las solicitudes POST o PUT tengan la forma y el tipo correctos antes de ser procesados o insertados en la base de datos.

## Protección CSRF

El módulo `nuxt-csurf` está configurado para proteger la aplicación contra ataques de Cross-Site Request Forgery. Automáticamente añade protección a los métodos `POST`, `PUT` y `PATCH`, asegurando que las solicitudes que modifican datos provengan de la propia aplicación y no de un sitio malicioso.
