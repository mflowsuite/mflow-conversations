# Variables de Entorno

## Variables requeridas

| Variable | Descripción |
|----------|-------------|
| `AIRTABLE_TOKEN` | Personal Access Token de Airtable (empieza con `pat...`) |
| `AUTH_SECRET` | String largo y aleatorio para firmar JWT (mínimo 32 chars) |
| `AUTH_USER` | Usuario del login |
| `AUTH_PASS` | Contraseña del login |

## Desarrollo local

Crear `.env.local` en la raíz del proyecto (está en `.gitignore`, nunca se commitea):

```bash
AIRTABLE_TOKEN=patTcLoHJ0XAl3Fjt.963190ac...
AUTH_SECRET=un-string-largo-y-random-para-firmar-jwt
AUTH_USER=martin
AUTH_PASS=marto
```

## Configuración en Vercel (producción)

1. Ir a Vercel → proyecto `mflow-conversations` → **Settings → Environment Variables**
2. Agregar las 4 variables marcando todos los entornos (Production + Preview + Development)
3. Después de guardar → **Redeploy** para que tomen efecto

## Cómo obtener el AIRTABLE_TOKEN

1. Ir a airtable.com → avatar → **Developer Hub**
2. **Personal access tokens** → **Create token**
3. Scopes necesarios: `data.records:read`, `schema.bases:read`
4. Copiar el token (solo se muestra una vez)

## Seguridad

- `AIRTABLE_TOKEN` y `AUTH_SECRET` nunca deben estar en el código fuente
- Las env vars de Vercel Functions NO son accesibles desde el browser
- El frontend nunca ve el token de Airtable — solo accede a `/api/*` con JWT
