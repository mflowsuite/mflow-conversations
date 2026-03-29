# Guía de Deploy

## Resumen del flujo

```
Código local → git push → GitHub (mflow-conversations) → Vercel (auto-deploy) → chat.mflowsuite.com
```

---

## Paso 1: Repo en GitHub

El repo `mflow-conversations` ya está creado en GitHub con el código inicial.

Para futuros cambios:
```bash
git add .
git commit -m "descripción del cambio"
git push origin main
# → Vercel detecta el push y hace deploy automático (~1 min)
```

---

## Paso 2: Conectar Vercel a GitHub

1. Ir a [vercel.com](https://vercel.com) → **Add New Project**
2. Seleccionar el repo `mflow-conversations` de GitHub
3. Configuración del build:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
4. Hacer clic en **Deploy**

---

## Paso 3: Configurar Variables de Entorno en Vercel

Ver [ENV_VARIABLES.md](ENV_VARIABLES.md) — sección "Configuración en Vercel".

Las 4 variables a cargar:
- `AIRTABLE_TOKEN`
- `AUTH_SECRET`
- `AUTH_USER`
- `AUTH_PASS`

Después de cargarlas → **Redeploy** (Settings → Deployments → Redeploy).

---

## Paso 4: Configurar dominio en Vercel

1. En Vercel → tu proyecto → **Settings** → **Domains**
2. Agregar dominio: `chat.mflowsuite.com`
3. Vercel te va a mostrar el valor CNAME a configurar en Cloudflare (algo como `cname.vercel-dns.com`)

---

## Paso 5: Configurar DNS en Cloudflare

> ⚠️ Esto solo agrega un registro nuevo — no modifica nada existente en tu dominio.

1. Ir a [dash.cloudflare.com](https://dash.cloudflare.com)
2. Seleccionar el dominio `mflowsuite.com`
3. Ir a **DNS** → **Records**
4. Hacer clic en **Add record**:

```
Type:    CNAME
Name:    chat
Target:  cname.vercel-dns.com   ← (el valor que te dio Vercel en el Paso 4)
Proxy:   DNS only (nube gris, NO naranja)
TTL:     Auto
```

5. Guardar. En ~5 minutos `chat.mflowsuite.com` debería responder.

---

## Verificación del deploy

Una vez completados los pasos:

1. Abrir `https://chat.mflowsuite.com`
2. Debería aparecer la pantalla de login
3. Ingresar `martin` / `marto`
4. Verificar que aparecen los 4 canales en el sidebar
5. Clickear en un canal y verificar que carga la lista de conversaciones
6. Clickear en una conversación y verificar que se ven los mensajes

---

## Deploy manual (sin git push)

Si necesitás hacer un deploy rápido sin commitear:
```bash
npx vercel --prod
```

---

## URLs importantes

| Entorno | URL |
|---------|-----|
| Producción | https://chat.mflowsuite.com |
| Preview (Vercel) | https://mflow-conversations-xxx.vercel.app |
| Dashboard Vercel | https://vercel.com/dashboard |
