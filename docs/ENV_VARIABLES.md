# Variables de Entorno

## Variables requeridas

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `AIRTABLE_TOKEN` | Personal Access Token de Airtable | `patXXXXXXXXXXXXXX.XXXXXXXX...` |
| `AUTH_SECRET` | String aleatorio para firmar JWT (mínimo 32 chars) | `super-secreto-largo-y-random-2026` |
| `AUTH_USER` | Nombre de usuario para el login | `martin` |
| `AUTH_PASS` | Contraseña para el login | `marto` |

---

## Cómo obtener el AIRTABLE_TOKEN

1. Ir a [airtable.com](https://airtable.com)
2. Hacer clic en tu avatar (arriba a la derecha)
3. Ir a **Developer Hub**
4. Ir a **Personal access tokens**
5. Crear un nuevo token con los scopes:
   - `data.records:read`
   - `schema.bases:read`
6. Copiar el token (empieza con `pat...`)

---

## Configuración local (desarrollo)

Crear el archivo `.env.local` en la raíz del proyecto (nunca lo commitees a git):

```bash
# .env.local
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
AUTH_SECRET=super-secreto-largo-y-random-2026
AUTH_USER=martin
AUTH_PASS=marto
```

Existe un archivo `.env.example` como plantilla — copiarlo:
```bash
cp .env.example .env.local
```

---

## Configuración en Vercel (producción)

1. Ir a [vercel.com](https://vercel.com) → tu proyecto `mflow-conversations`
2. Ir a **Settings** → **Environment Variables**
3. Agregar cada variable:

```
Name: AIRTABLE_TOKEN
Value: [tu token de Airtable]
Environment: Production, Preview, Development ✓

Name: AUTH_SECRET
Value: [string largo y random]
Environment: Production, Preview, Development ✓

Name: AUTH_USER
Value: martin
Environment: Production, Preview, Development ✓

Name: AUTH_PASS
Value: marto
Environment: Production, Preview, Development ✓
```

4. Hacer **Save** y luego redeploy para que los cambios tomen efecto.

---

## Notas de seguridad

- `AIRTABLE_TOKEN` y `AUTH_SECRET` **nunca** deben estar en el código fuente
- `.env.local` está en `.gitignore` — git nunca lo trackea
- En Vercel, las variables de entorno de las Functions **no** son accesibles desde el frontend (React)
- El frontend solo usa `/api/*` endpoints que validan JWT — nunca accede a Airtable directamente
