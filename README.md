# SGPI Frontend

SPA del SGPI construida con Angular 22.

## Requisitos

- Node.js 22 o 24 recomendado
- npm

## Correr con Docker Compose

La forma mas estable de correr el frontend es junto con el backend y MySQL desde la raiz del proyecto:

```bash
docker compose up -d frontend backend mysql --build
```

Abre:

```text
http://localhost:4200
```

En este modo, Nginx ya redirige `/api/*` hacia el backend automaticamente.

## Correr localmente con Angular

Instala dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm start
```

Angular servira la app normalmente en:

```text
http://localhost:4200
```

## Importante sobre desarrollo local

La aplicacion consume el backend usando rutas relativas como `/api/auth/login`.

- En Docker Compose esto funciona porque `nginx.conf` hace proxy a `backend:8080`.
- Si corres `npm start` con `ng serve`, tambien necesitas tener el backend accesible detras de `/api`.

La opcion recomendada para desarrollo funcional completo es usar `docker compose up -d --build`.

## Build de produccion

```bash
npm run build
```

La salida se genera en:

```text
dist/sgpi-frontend
```

## Usuarios de prueba

Para iniciar sesion usa, por ejemplo:

- `admin` / `Admin123!`
- `inv001` / `Investigador123!`
