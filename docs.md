Documentacion temporal donde voy dejando cositas

UI (Página Signin) --(llamada a)--> useAuth.signIn() [Frontend] --(petición a)--> Auth.js Backend (server/api/auth/[...all].ts) --(valida en DB + crea sesión)--> Cookie de Sesión --(actualiza estado)--> useAuth
(status) [Frontend] --(protege rutas con)--> auth.global.ts [Middleware]
