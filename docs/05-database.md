# Base de Datos (Drizzle ORM)

La persistencia de datos del proyecto se gestiona a través de **Drizzle ORM**, un ORM (Object-Relational Mapper) de TypeScript que prioriza la seguridad de tipos y una sintaxis cercana a SQL.

## Configuración

- **`drizzle.config.ts`**: Este archivo es el centro de configuración para **Drizzle Kit**, la herramienta CLI de Drizzle. Define:
  - `schema`: La ubicación de los archivos de esquema de la base de datos (`./lib/db/schema/index.ts`).
  - `out`: El directorio donde se guardarán las migraciones generadas (`./migrations`).
  - `dialect`: El dialecto de SQL a utilizar. En este proyecto es `"postgresql"`, lo que indica que la base de datos principal es PostgreSQL.
  - `dbCredentials`: Las credenciales para conectarse a la base de datos, obtenidas de variables de entorno (`process.env.DATABASE_URL`).

## Esquema de la Base de Datos

El esquema se define en el directorio `lib/db/schema/`.

- **`index.ts`**: Este archivo probablemente exporta todos los esquemas definidos en otros archivos del directorio, sirviendo como punto de entrada único para Drizzle.
- **Archivos de esquema (p.ej., `auth.ts`, `companies.ts`)**: Cada archivo define una o más tablas de la base de datos utilizando la sintaxis de Drizzle. Por ejemplo, `companies.ts` definirá la tabla `companies` con sus respectivas columnas, tipos de datos, claves primarias, claves foráneas y relaciones.

Este enfoque declarativo permite tener una representación del esquema de la base de datos directamente en el código TypeScript, con todas las ventajas de autocompletado y verificación de tipos.

## Consultas (Queries)

La lógica para interactuar con la base de datos se encuentra en `lib/db/queries/`.

- **Separación de responsabilidades**: Cada archivo (p.ej., `sales.ts`, `customers.ts`) agrupa las funciones que realizan operaciones CRUD (Crear, Leer, Actualizar, Borrar) sobre una tabla o entidad específica.
- **Seguridad de tipos**: Las consultas se escriben utilizando el cliente de Drizzle y los esquemas definidos. Esto garantiza que las operaciones son seguras en tiempo de compilación. Por ejemplo, no se puede seleccionar una columna que no existe o insertar un tipo de dato incorrecto.
- **Ejemplo de consulta (hipotético) en `lib/db/queries/sales.ts`**:

  ```typescript
  import { eq } from "drizzle-orm";
  import { db } from "../index";
  import { sales } from "../schema";

  export async function getSaleById(saleId: number) {
    return await db.select().from(sales).where(eq(sales.id, saleId));
  }
  ```

## Migraciones

El directorio `migrations/` contiene los archivos SQL generados por Drizzle Kit.

- **Flujo de trabajo**:
  1. Se modifica el esquema en los archivos de `lib/db/schema/`.
  2. Se ejecuta un comando de Drizzle Kit (p.ej., `drizzle-kit generate`).
  3. Drizzle Kit compara el nuevo esquema con el estado anterior de la base de datos y genera un nuevo archivo de migración SQL con los cambios necesarios.
  4. Este archivo de migración se ejecuta contra la base de datos para aplicar los cambios.

Este sistema asegura que los cambios en el esquema de la base de datos se apliquen de forma controlada y versionada.
