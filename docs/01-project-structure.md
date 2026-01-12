# Estructura del Proyecto

Este documento describe la estructura de directorios del proyecto, explicando el propósito de cada carpeta y archivo importante.

```
/
├─── .data/                # Datos de la base de datos local (Turso)
├─── .devcontainer/        # Configuración para desarrollo en contenedores
├─── .husky/               # Hooks de Git para calidad de código
├─── .nuxt/                # Archivos generados por Nuxt en desarrollo
├─── .output/              # Archivos de la compilación para producción
├─── .vscode/              # Configuraciones de VSCode
├─── app/                  # Directorio principal de la aplicación Nuxt
│    ├─── assets/           # Archivos estáticos (CSS, imágenes)
│    ├─── components/       # Componentes de Vue reutilizables
│    ├─── composables/      # Funciones "composables" de Vue para lógica reutilizable
│    ├─── layouts/          # Plantillas de página (e.g., auth, dashboard)
│    ├─── middleware/       # Middlewares de Nuxt para rutas
│    ├─── pages/            # Páginas de la aplicación y su enrutamiento
│    ├─── plugins/          # Plugins de Nuxt
│    ├─── stores/           # Almacenes de estado de Pinia
│    └─── types/            # Definiciones de tipos de TypeScript
├─── db_data/              # Datos de la base de datos (si se usa SQLite local)
├─── docs/                 # Documentación del proyecto
├─── i18n/                 # Archivos de internacionalización
├─── lib/                  # Librerías y utilidades principales
│    ├─── auth-client.ts    # Lógica de autenticación del lado del cliente
│    ├─── auth.ts           # Lógica de autenticación principal (servidor)
│    └─── db/               # Lógica de acceso a la base de datos
│         ├─── index.ts     # Cliente de Drizzle ORM
│         ├─── queries/     # Consultas a la base de datos
│         └─── schema/      # Esquemas de la base de datos con Drizzle
├─── migrations/           # Migraciones de la base de datos generadas por Drizzle Kit
├─── node_modules/         # Dependencias de Node.js
├─── public/               # Archivos públicos accesibles directamente
├─── server/               # Lógica del servidor (API)
│    ├─── api/              # Endpoints de la API REST
│    ├─── middleware/       # Middlewares del servidor Nitro/H3
│    └─── utils/            # Utilidades del lado del servidor
├─── .gitignore             # Archivos ignorados por Git
├─── nuxt.config.ts         # Archivo de configuración de Nuxt
├─── drizzle.config.ts      # Archivo de configuración de Drizzle ORM
├─── package.json           # Dependencias y scripts del proyecto
├─── tsconfig.json          # Configuración de TypeScript
└─── README.md              # README principal del proyecto
```
